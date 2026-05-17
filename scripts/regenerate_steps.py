#!/usr/bin/env python3
"""Regenerate step images with corrected prompts (no text)."""
import json, os, subprocess, sys, time, re
from pathlib import Path
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

PATTERNS_FILE = Path(__file__).parent.parent / "data" / "patterns.json"
OUTPUT_DIR    = Path(__file__).parent.parent / "public" / "assets" / "patterns"
PIXAZO_URL    = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData"
PIXAZO_API_KEY = "fe6f8e8cf44642fba5f16012af42ecf2"
WORKERS       = 5

STYLE_NO_TEXT = (
    "soft natural lighting, cozy craft photography, warm pastel background, "
    "shallow depth of field, sharp focus on yarn texture, high quality, "
    "photorealistic, no text overlay, no labels, no captions, no letters, "
    "no watermark, do not add any text or words"
)

def build_step_prompt(pattern, step_num):
    name = pattern["name"]
    return (
        f"Close-up instructional crochet photo, hands holding a crochet hook "
        f"and yarn, clear demonstration of crochet technique, "
        f"step {step_num} of making a {name.lower()}, "
        f"beginner tutorial, {STYLE_NO_TEXT}"
    )

def generate_image(prompt, width, height):
    headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Ocp-Apim-Subscription-Key": PIXAZO_API_KEY,
    }
    payload = {"prompt": prompt, "num_steps": 4, "height": height, "width": width}
    resp = requests.post(PIXAZO_URL, json=payload, headers=headers, timeout=90)
    if resp.status_code == 200:
        data = resp.json()
        image_url = data.get("output")
        if not image_url:
            raise RuntimeError(f"No output URL: {data}")
        img_resp = requests.get(image_url, timeout=60)
        if img_resp.status_code == 200:
            return img_resp.content
        raise RuntimeError(f"Download failed: {img_resp.status_code}")
    raise RuntimeError(f"API error {resp.status_code}: {resp.text[:200]}")

def save_image(image_bytes, output_path):
    from PIL import Image
    import io
    output_path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(io.BytesIO(image_bytes))
    img.save(output_path, "WEBP", quality=85, method=6)

def process_step(pattern, step_num, step_text):
    pid = pattern["id"]
    step_path = OUTPUT_DIR / pid / f"step-{step_num}.webp"
    try:
        prompt = build_step_prompt(pattern, step_num)
        img_bytes = generate_image(prompt, 640, 512)
        save_image(img_bytes, step_path)
        return (pid, step_num, "OK")
    except Exception as e:
        return (pid, step_num, f"FAIL: {e}")

def main():
    with open(PATTERNS_FILE) as f:
        patterns = json.load(f)

    tasks = []
    for p in patterns:
        instructions = p.get("instructions", [])
        for i, step_text in enumerate(instructions, 1):
            tasks.append((p, i, step_text))

    total = len(tasks)
    print(f"Regenerating {total} step images with {WORKERS} workers...")
    start = time.time()

    done = 0
    errors = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(process_step, p, i, t): (p["id"], i) for p, i, t in tasks}
        for f in as_completed(futures):
            pid, step_num = futures[f]
            result = f.result()
            done += 1
            if result[2] != "OK":
                errors += 1
                print(f"  [{done}/{total}] {result[0]} step-{result[1]}: {result[2]}")
            if done % 50 == 0:
                elapsed = time.time() - start
                rate = done / elapsed
                remaining = (total - done) / rate
                print(f"  [{done}/{total}] {elapsed:.0f}s elapsed, ~{remaining:.0f}s remaining, {errors} errors")

    elapsed = time.time() - start
    print(f"\nDone! {total} images in {elapsed:.0f}s ({total/elapsed:.1f} img/s)")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    main()