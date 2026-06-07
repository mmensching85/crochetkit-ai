"""
Remove watermarks from pattern hero images by blurring the bottom strip.
Watermarks (e.g. "dreamstime®") appear at the bottom center of some images.
"""
import os
import glob
from PIL import Image, ImageFilter

PATTERNS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'patterns')
BLUR_HEIGHT = 40  # pixels from bottom to blur
BLUR_RADIUS = 8


def blur_bottom_strip(img: Image.Image, height: int, radius: int) -> Image.Image:
    """Apply Gaussian blur to the bottom `height` pixels of the image."""
    w, h = img.size
    if height >= h:
        height = h // 4  # safety: don't blur more than 25%

    # Split: top (untouched) + bottom (to blur)
    top = img.crop((0, 0, w, h - height))
    bottom = img.crop((0, h - height, w, h))
    bottom_blurred = bottom.filter(ImageFilter.GaussianBlur(radius=radius))

    # Reassemble
    result = Image.new(img.mode, (w, h))
    result.paste(top, (0, 0))
    result.paste(bottom_blurred, (0, h - height))
    return result


def main():
    pattern_files = sorted(glob.glob(os.path.join(PATTERNS_DIR, '*.webp')))
    print(f"Found {len(pattern_files)} pattern images")

    processed = 0
    for filepath in pattern_files:
        img = Image.open(filepath).convert('RGB')
        img_blurred = blur_bottom_strip(img, BLUR_HEIGHT, BLUR_RADIUS)
        img_blurred.save(filepath, 'WEBP', quality=92, method=6)
        processed += 1

    print(f"Processed {processed} images — blurred bottom {BLUR_HEIGHT}px")


if __name__ == '__main__':
    main()
