#!/usr/bin/env python3
"""
generate_images.py — CrochetKit AI Image Generator
Uses Pixazo.ai (FLUX.1-schnell) to generate:
  1. One hero image per pattern  → public/assets/patterns/{id}.webp
  2. One image per instruction step → public/assets/patterns/{id}/step-{n}.webp

Usage:
    python3 scripts/generate_images.py                  # generate all missing images
    python3 scripts/generate_images.py --pattern pattern-garter-scarf-001  # one pattern only
    python3 scripts/generate_images.py --hero-only      # skip step images
    python3 scripts/generate_images.py --steps-only     # skip hero images
    python3 scripts/generate_images.py --force          # regenerate even if file exists

Requirements:
    pip install requests Pillow
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

# ── Config ────────────────────────────────────────────────────────────────────
# Pixazo.ai — FLUX.1-schnell (synchronous, returns image URL directly)
PIXAZO_URL     = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData"
PIXAZO_API_KEY = "fe6f8e8cf44642fba5f16012af42ecf2"

PATTERNS_FILE  = Path(__file__).parent.parent / "data" / "patterns.json"
OUTPUT_DIR     = Path(__file__).parent.parent / "public" / "assets" / "patterns"

# Image dimensions (Pixazo supports up to 1024; use multiples of 64)
HERO_WIDTH   = 832
HERO_HEIGHT  = 640
STEP_WIDTH   = 640
STEP_HEIGHT  = 512

# Rate limiting
RETRY_WAIT     = 10   # seconds to wait on failure
MAX_RETRIES    = 4
BETWEEN_IMAGES = 1    # seconds between requests

# ── Prompt builders ───────────────────────────────────────────────────────────

STYLE_SUFFIX = (
    "soft natural lighting, cozy craft photography, warm pastel background, "
    "shallow depth of field, sharp focus on yarn texture, high quality, "
    "photorealistic, no watermark, no text overlay"
)

CATEGORY_CONTEXT = {
    "Scarf":              "long knitted scarf draped elegantly",
    "Hat":                "handmade crochet hat resting on a wooden surface",
    "Blanket":            "folded crochet blanket with visible stitch texture",
    "Bag":                "small crocheted tote bag standing upright",
    "Baby":               "tiny soft baby crochet item on white fabric",
    "Toy":                "cute amigurumi stuffed toy crochet animal",
    "Dishcloth":          "square crocheted dishcloth folded on a kitchen counter",
    "Coaster":            "round crocheted coaster with a mug on top",
    "Headband":           "crocheted headband laid flat on wooden surface",
    "Granny square":      "colorful granny square crochet motif flat lay",
    "Shawl":              "lacy crocheted shawl draped over a chair",
    "Accessories":        "specific crocheted accessory item like gloves cowl or warmers displayed as main subject",
    "Home Decor":         "crocheted home decoration item in a cozy interior",
    "Bookmark":           "slim crocheted bookmark with tassel detail",
    "Keychain":           "small crocheted keychain charm",
    "Mug cozy":           "crocheted mug cozy wrapped around a ceramic mug",
    "Cell phone case":    "crocheted phone case laid flat",
    "Eyeglass case":      "soft crocheted glasses case open on a table",
    "Wristband":          "crocheted wristband bracelet",
    "Water bottle holder":"crocheted water bottle holder with a bottle inside",
    "Small plant hanger": "macrame-style crocheted plant hanger with a small succulent",
    "Poncho":             "crocheted poncho draped on a dress form",
    "Sweater":            "handmade crocheted sweater folded neatly",
    "Slippers":           "pair of crocheted slippers on a wooden floor",
}

def build_hero_prompt(pattern: dict) -> str:
    name = pattern["name"]
    category = pattern.get("category", "")
    difficulty = pattern.get("difficulty", {}).get("level", "beginner")
    fiber_types = pattern.get("materials", {}).get("yarn", {}).get("fiberType", [])
    fiber = fiber_types[0].lower() if fiber_types else "acrylic"
    context = CATEGORY_CONTEXT.get(category, f"handmade crochet {category.lower()}")

    return (
        f"Professional product photo of a handmade crochet {name.lower()}, "
        f"{context}, made from {fiber} yarn, {difficulty} level craft project, "
        f"{STYLE_SUFFIX}"
    )

STEP_VARIETY = [
    "top-down view, hands holding hook near the starting edge",
    "slightly angled side view, hook inserted into fabric loop",
    "close side view, yarn wrapped around hook, fingers guiding yarn",
    "angled view, pulling yarn through loop to form new stitch",
    "straight-on view, completed row of stitches visible on fabric",
    "slightly elevated view, resting hands position after completing stitch",
    "side view, turning the work over to start next row",
    "close macro view, hook tip and yarn loop in sharp focus",
]

def build_step_prompt(pattern: dict, step_text: str, step_num: int) -> str:
    name = pattern["name"]
    variety = STEP_VARIETY[(step_num - 1) % len(STEP_VARIETY)]

    return (
        f"Close-up photograph of hands crocheting {name.lower()} with a metal crochet hook, "
        f"{variety}, yarn and textured crochet fabric in frame, soft natural lighting, "
        f"cozy craft photography, warm pastel background, shallow depth of field, "
        f"sharp focus on yarn and hook, photorealistic, clean image, "
        f"no text, no labels, no caption, no watermark"
    )

# ── Pollinations.AI API call ──────────────────────────────────────────────────

def generate_image(prompt: str, width: int, height: int) -> bytes:
    headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Ocp-Apim-Subscription-Key": PIXAZO_API_KEY,
    }
    payload = {
        "prompt": prompt,
        "num_steps": 4,
        "height": height,
        "width": width,
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            # Step 1: Submit generation request (returns image URL directly)
            resp = requests.post(PIXAZO_URL, json=payload, headers=headers, timeout=60)

            if resp.status_code == 200:
                data = resp.json()
                image_url = data.get("output")
                if not image_url:
                    raise RuntimeError(f"No output URL in response: {data}")
                # Step 2: Download the image
                img_resp = requests.get(image_url, timeout=60)
                if img_resp.status_code == 200:
                    return img_resp.content
                raise RuntimeError(f"Failed to download image from {image_url}: {img_resp.status_code}")

            if resp.status_code == 429:
                wait = RETRY_WAIT * 3
                print(f"    Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue

            print(f"    Error {resp.status_code}: {resp.text[:200]} on attempt {attempt}/{MAX_RETRIES}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_WAIT)

        except requests.exceptions.Timeout:
            print(f"    Timeout on attempt {attempt}, retrying...")
            time.sleep(RETRY_WAIT)
        except requests.exceptions.RequestException as e:
            print(f"    Request error: {e}")
            time.sleep(RETRY_WAIT)

    raise RuntimeError(f"Failed to generate image after {MAX_RETRIES} attempts")

def save_image(image_bytes: bytes, output_path: Path):
    """Save raw bytes as webp via Pillow for optimal size/quality."""
    from PIL import Image
    import io
    output_path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(io.BytesIO(image_bytes))
    img.save(output_path, "WEBP", quality=85, method=6)

# ── Main ──────────────────────────────────────────────────────────────────────

def process_pattern(pattern: dict, args):
    pid = pattern["id"]
    name = pattern["name"]
    instructions = pattern.get("instructions", [])

    hero_path = OUTPUT_DIR / f"{pid}.webp"
    step_dir  = OUTPUT_DIR / pid

    generated = 0
    skipped   = 0
    errors    = 0

    # ── Hero image ──
    if not args.steps_only:
        if hero_path.exists() and not args.force:
            print(f"  ✓ Hero exists, skipping ({hero_path.name})")
            skipped += 1
        else:
            try:
                prompt = build_hero_prompt(pattern)
                print(f"  → Generating hero image...")
                print(f"    Prompt: {prompt[:100]}...")
                img_bytes = generate_image(prompt, HERO_WIDTH, HERO_HEIGHT)
                save_image(img_bytes, hero_path)
                print(f"  ✓ Saved: {hero_path}")
                generated += 1
                time.sleep(BETWEEN_IMAGES)
            except Exception as e:
                print(f"  ✗ Hero failed: {e}")
                errors += 1

    # ── Step images ──
    if not args.hero_only and instructions:
        for i, step_text in enumerate(instructions, start=1):
            step_path = step_dir / f"step-{i}.webp"
            if step_path.exists() and not args.force:
                print(f"  ✓ Step {i} exists, skipping")
                skipped += 1
                continue
            try:
                prompt = build_step_prompt(pattern, step_text, i)
                print(f"  → Generating step {i}/{len(instructions)} image...")
                print(f"    Prompt: {prompt[:100]}...")
                img_bytes = generate_image(prompt, STEP_WIDTH, STEP_HEIGHT)
                save_image(img_bytes, step_path)
                print(f"  ✓ Saved: {step_path}")
                generated += 1
                time.sleep(BETWEEN_IMAGES)
            except Exception as e:
                print(f"  ✗ Step {i} failed: {e}")
                errors += 1

    return generated, skipped, errors


def main():
    parser = argparse.ArgumentParser(description="Generate crochet pattern images using FLUX.1-dev")
    parser.add_argument("--pattern", help="Generate images for a single pattern ID only")
    parser.add_argument("--hero-only", action="store_true", help="Only generate hero images, skip step images")
    parser.add_argument("--steps-only", action="store_true", help="Only generate step images, skip hero images")
    parser.add_argument("--force", action="store_true", help="Regenerate images even if they already exist")
    parser.add_argument("--dry-run", action="store_true", help="Print prompts without generating images")
    args = parser.parse_args()

    # Load patterns
    with open(PATTERNS_FILE) as f:
        patterns = json.load(f)

    # Filter to single pattern if requested
    if args.pattern:
        patterns = [p for p in patterns if p["id"] == args.pattern]
        if not patterns:
            print(f"Pattern '{args.pattern}' not found.")
            sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    total_generated = 0
    total_skipped   = 0
    total_errors    = 0

    # Calculate total images to generate
    total_patterns = len(patterns)
    total_steps    = sum(len(p.get("instructions", [])) for p in patterns)
    total_images   = (0 if args.steps_only else total_patterns) + (0 if args.hero_only else total_steps)

    print(f"\nCrochetKit AI — Image Generator")
    print(f"Provider: Pixazo.ai (FLUX.1-schnell)")
    print(f"Patterns: {total_patterns} | Hero images: {total_patterns} | Step images: {total_steps}")
    print(f"Total to generate: ~{total_images} images")
    print(f"Estimated time: ~{total_images * (5 + BETWEEN_IMAGES) // 60} minutes")
    print(f"Output: {OUTPUT_DIR}\n")

    if args.dry_run:
        print("=== DRY RUN — prompts only ===\n")
        for pattern in patterns:
            print(f"[{pattern['id']}] {pattern['name']}")
            if not args.steps_only:
                print(f"  HERO: {build_hero_prompt(pattern)}")
            if not args.hero_only:
                for i, step in enumerate(pattern.get("instructions", []), 1):
                    print(f"  STEP {i}: {build_step_prompt(pattern, step, i)}")
            print()
        return

    for idx, pattern in enumerate(patterns, 1):
        print(f"\n[{idx}/{total_patterns}] {pattern['name']} ({pattern['id']})")
        gen, skip, err = process_pattern(pattern, args)
        total_generated += gen
        total_skipped   += skip
        total_errors    += err

    print(f"\n{'='*50}")
    print(f"Done! Generated: {total_generated} | Skipped: {total_skipped} | Errors: {total_errors}")
    print(f"Images saved to: {OUTPUT_DIR}")

    if total_errors > 0:
        print(f"\nTip: Re-run with --force to retry failed images only after fixing errors.")


if __name__ == "__main__":
    main()
