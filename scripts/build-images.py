#!/usr/bin/env python3
"""
Generate optimized, responsive image derivatives from source photos.

For each source image in /images (e.g. Mumbai.jpg) this produces:
  - WebP at widths 400/800/1200/1600 (capped at the original width)
  - a JPEG fallback at min(1200, native width)
and from /og-image.png it produces a 1200x630 /og-image.jpg social card.

These outputs are git-ignored and regenerated at build/deploy time, so the
repo only carries the source photos + this script — not the derivatives.

Local preview:   python3 scripts/build-images.py
Requires:        Pillow  (pip install Pillow)
"""
import os, re, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "images")
WIDTHS = [400, 800, 1200, 1600]
WEBP_QUALITY = 80
JPG_QUALITY = 80

# matches a generated derivative like "Mumbai-800.webp" or "Dubai-1080.jpg"
DERIVATIVE = re.compile(r"-\d+\.(webp|jpg)$", re.IGNORECASE)


def is_source(path):
    return not DERIVATIVE.search(os.path.basename(path))


def process(src):
    name = os.path.splitext(os.path.basename(src))[0]
    im = Image.open(src).convert("RGB")
    ow, oh = im.size
    made = 0

    for w in WIDTHS:
        if w > ow:
            continue
        h = round(oh * w / ow)
        im.resize((w, h), Image.LANCZOS).save(
            os.path.join(IMG_DIR, f"{name}-{w}.webp"), "WEBP",
            quality=WEBP_QUALITY, method=6)
        made += 1

    # JPEG fallback (+ a WebP at the fallback width if it isn't already covered)
    fw = min(1200, ow)
    fh = round(oh * fw / ow)
    fallback = im.resize((fw, fh), Image.LANCZOS)
    fallback.save(os.path.join(IMG_DIR, f"{name}-{fw}.jpg"), "JPEG",
                  quality=JPG_QUALITY, optimize=True, progressive=True)
    made += 1
    if fw not in WIDTHS:
        fallback.save(os.path.join(IMG_DIR, f"{name}-{fw}.webp"), "WEBP",
                      quality=WEBP_QUALITY, method=6)
        made += 1

    print(f"  {os.path.basename(src):26} {ow}x{oh}  -> {made} files")
    return made


def build_og():
    src = os.path.join(ROOT, "og-image.png")
    if not os.path.exists(src):
        return
    og = Image.open(src).convert("RGB")
    tw, th = 1200, 630
    ow, oh = og.size
    scale = max(tw / ow, th / oh)
    og = og.resize((round(ow * scale), round(oh * scale)), Image.LANCZOS)
    nw, nh = og.size
    left, top = (nw - tw) // 2, (nh - th) // 2
    og.crop((left, top, left + tw, top + th)).save(
        os.path.join(ROOT, "og-image.jpg"), "JPEG",
        quality=82, optimize=True, progressive=True)
    print("  og-image.png -> og-image.jpg (1200x630)")


def main():
    sources = [p for p in glob.glob(os.path.join(IMG_DIR, "*.jpg"))
               + glob.glob(os.path.join(IMG_DIR, "*.png")) if is_source(p)]
    if not sources:
        print("No source images found in /images")
    print(f"Optimizing {len(sources)} source image(s):")
    total = sum(process(p) for p in sorted(sources))
    build_og()
    print(f"Done — {total} responsive files generated.")


if __name__ == "__main__":
    main()
