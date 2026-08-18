"""Rebuild the CinematicIntro frame sequence and the ambient loop video from
the source clips.

Run whenever Source/Up_Video Final_01..04.mp4 (the frame-sequence clips) or
Up_Video Final_05.mp4 (the ambient courtyard loop) are replaced. Frame counts
are re-derived from each clip's own duration every run (largest-remainder
allocation to hit TOTAL_FRAMES exactly), so it self-adjusts if a clip's length
changes - only the four durations need to stay proportionally similar for the
camera-motion pacing to still read the same.

Usage:  python scripts/build-intro-sequence.py
Needs:  ffmpeg/ffprobe on PATH, Pillow (pip install pillow)
"""
import os
import shutil
import subprocess
import sys
from datetime import datetime

from PIL import Image

PROJECT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = r"C:\ClaudeCode\26.07\Homepage\Source"
PUBLIC = os.path.join(PROJECT, "public")

SEQUENCE_CLIPS = [
    os.path.join(SOURCE_DIR, "Up_Video Final_01.mp4"),
    os.path.join(SOURCE_DIR, "Up_Video Final_02.mp4"),
    os.path.join(SOURCE_DIR, "Up_Video Final_03.mp4"),
    os.path.join(SOURCE_DIR, "Up_Video Final_04.mp4"),
]
AMBIENT_CLIP = os.path.join(SOURCE_DIR, "Up_Video Final_05_x2 Slow.mp4")

TOTAL_FRAMES = 382
OUT_W, OUT_H = 1280, 720
WEBP_QUALITY = 35

# The ambient loop is a plain background video rather than a scrubbed sequence,
# so it carries its own resolution: 1080p reads noticeably cleaner full-bleed
# and inter-frame compression keeps it cheap even at the higher size.
AMBIENT_W = 1920
AMBIENT_CRF = 23

SEQ_DIR = os.path.join(PUBLIC, "sequences", "intro")
AMBIENT_OUT = os.path.join(PUBLIC, "ambient-courtyard.mp4")


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def duration(path):
    # The container-level format=duration on these upscaled clips overstates
    # the actual decodable video length by ~40-60ms (they're variable-frame-
    # rate and the muxer wrote a duration that doesn't match the last real
    # frame's timestamp). Sampling against that inflated figure asks ffmpeg
    # for a timestamp past the last frame, which fails with an empty output
    # and no error. The per-stream duration tracks the real content length.
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=duration",
        "-of", "csv=p=0", path,
    ], text=True)
    return float(out.strip())


def freeze_check(path):
    """Frozen tail frames would silently duplicate the last real frame across
    many extracted samples; fail loudly instead of shipping a stutter."""
    out = subprocess.run([
        "ffmpeg", "-v", "error", "-i", path,
        "-vf", "freezedetect=n=-30dB:d=0.4", "-f", "null", "-",
    ], capture_output=True, text=True)
    if "freeze_start" in out.stderr:
        raise RuntimeError(f"frozen frames detected in {path}:\n{out.stderr}")


def allocate_frames(clips):
    durs = [duration(p) for p in clips]
    total = sum(durs)
    raw = [TOTAL_FRAMES * d / total for d in durs]
    base = [int(r) for r in raw]
    remainder = TOTAL_FRAMES - sum(base)
    order = sorted(range(len(clips)), key=lambda i: raw[i] - base[i], reverse=True)
    for i in order[:remainder]:
        base[i] += 1
    assert sum(base) == TOTAL_FRAMES
    return durs, base


def extract_clip_frames(path, count, dur, start_index, staging_dir):
    """count frames evenly spaced from t=0 up to (but not including) t=dur,
    so consecutive clips don't both sample the same instant at the splice."""
    written = []
    for i in range(count):
        t = round(dur * i / count, 4)
        png = os.path.join(staging_dir, f"raw_{start_index + i:04d}.png")
        # Accurate (decode-based) seek, not -ss-before-input: these clips are
        # variable-frame-rate, and fast keyframe-seeking on VFR footage can
        # silently land on the wrong nearby frame instead of failing.
        run([
            "ffmpeg", "-v", "error", "-i", path, "-ss", str(t),
            "-frames:v", "1",
            "-vf", f"scale={OUT_W}:{OUT_H}:flags=lanczos",
            png, "-y",
        ])
        if not os.path.isfile(png) or os.path.getsize(png) == 0:
            raise RuntimeError(
                f"empty extraction: {os.path.basename(path)} @ t={t}s "
                f"(frame {i + 1}/{count}, clip duration {dur}s)"
            )
        written.append(png)
    return written


def main():
    for p in SEQUENCE_CLIPS + [AMBIENT_CLIP]:
        if not os.path.isfile(p):
            print(f"MISSING SOURCE FILE: {p}", file=sys.stderr)
            sys.exit(1)

    print("Checking for frozen tail frames...")
    for p in SEQUENCE_CLIPS + [AMBIENT_CLIP]:
        freeze_check(p)
    print("  none found")

    durs, counts = allocate_frames(SEQUENCE_CLIPS)
    for p, d, n in zip(SEQUENCE_CLIPS, durs, counts):
        print(f"  {os.path.basename(p)}: {d:.3f}s -> {n} frames")

    staging = os.path.join(PROJECT, ".seq-build-tmp")
    if os.path.isdir(staging):
        shutil.rmtree(staging)
    os.makedirs(staging)

    print("Extracting frames...")
    all_pngs = []
    idx = 0
    for path, n, d in zip(SEQUENCE_CLIPS, counts, durs):
        all_pngs += extract_clip_frames(path, n, d, idx, staging)
        idx += n
    assert len(all_pngs) == TOTAL_FRAMES, len(all_pngs)

    print("Verifying frames (dimensions, non-zero, brightness)...")
    for i, png in enumerate(all_pngs, start=1):
        im = Image.open(png)
        if im.size != (OUT_W, OUT_H):
            raise RuntimeError(f"frame {i} wrong size: {im.size}")
        mean = sum(im.convert("L").resize((16, 9)).getdata()) / (16 * 9)
        if mean < 2:
            raise RuntimeError(f"frame {i} is black (mean luma {mean:.1f})")

    print("Converting to WebP...")
    webp_staging = os.path.join(staging, "webp")
    os.makedirs(webp_staging, exist_ok=True)
    for i, png in enumerate(all_pngs, start=1):
        out = os.path.join(webp_staging, f"frame_{i:03d}.webp")
        Image.open(png).save(out, "WEBP", quality=WEBP_QUALITY)

    webp_files = sorted(os.listdir(webp_staging))
    if len(webp_files) != TOTAL_FRAMES:
        raise RuntimeError(f"expected {TOTAL_FRAMES} webp files, got {len(webp_files)}")
    total_size = sum(os.path.getsize(os.path.join(webp_staging, f)) for f in webp_files)
    print(f"  {len(webp_files)} frames, {total_size / 1_000_000:.1f} MB")

    if os.path.isdir(SEQ_DIR):
        backup = f"{SEQ_DIR}.bak.{datetime.now():%Y%m%d%H%M%S}"
        print(f"Backing up existing sequence to {backup}")
        shutil.move(SEQ_DIR, backup)
    os.makedirs(os.path.dirname(SEQ_DIR), exist_ok=True)
    shutil.move(webp_staging, SEQ_DIR)

    print("Transcoding ambient loop video...")
    run([
        "ffmpeg", "-v", "error", "-i", AMBIENT_CLIP,
        "-vf", f"scale={AMBIENT_W}:-2:flags=lanczos",
        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", str(AMBIENT_CRF),
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        AMBIENT_OUT, "-y",
    ])
    print(f"  {os.path.getsize(AMBIENT_OUT) / 1_000_000:.1f} MB")

    shutil.rmtree(staging)
    print("Done.")


if __name__ == "__main__":
    main()
