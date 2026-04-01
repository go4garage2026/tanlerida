"""
Tangred Arch Grant Pitch Video Generator
Creates a 2:30 pitch video with slides and TTS narration.
"""

import os
import sys
import textwrap

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)
from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS
from moviepy import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
    CompositeVideoClip,
    TextClip,
)

# ── Configuration ──────────────────────────────────────────────────
WIDTH, HEIGHT = 1920, 1080
BG_COLOR = (9, 9, 9)
ACCENT_COLOR = (192, 57, 43)
GOLD_COLOR = (191, 160, 122)
WHITE = (255, 255, 255)
LIGHT_GRAY = (180, 180, 180)
DARK_GRAY = (30, 30, 30)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "pitch_video")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Slide content with narration scripts ───────────────────────────
SLIDES = [
    {
        "id": "title",
        "heading": "TANGRED",
        "subheading": "Born in India. Built for Ambition.",
        "body": "Premium Handcrafted Leather  •  AI-Powered Styling  •  Direct to Consumer",
        "narration": (
            "Hi, I'm Vivek, founder of Tangred, "
            "a premium Indian leather brand with AI-powered personal styling, "
            "sold direct to consumers."
        ),
    },
    {
        "id": "problem",
        "heading": "THE PROBLEM",
        "subheading": "",
        "bullets": [
            "Imported luxury brands charge 2-3x due to import duties and retail markup",
            "Domestic brands compete on price, not craftsmanship",
            "Buying leather online is impersonal — no way to assess fit or styling",
            "India's rising professional class is underserved",
        ],
        "narration": (
            "India's luxury market is booming, but for professionals looking for premium leather, "
            "the options are broken. "
            "Imported brands are overpriced due to duties and retail margins. "
            "Domestic brands compete on price, not craft. "
            "And buying leather online is a guessing game with no personalization. "
            "India's rising professional class deserves better."
        ),
    },
    {
        "id": "solution",
        "heading": "THE SOLUTION",
        "subheading": "Tangred + Tan Lerida AI",
        "bullets": [
            "Handcrafted leather goods: bags, briefcases, belts, jackets — Rs 1,299 to Rs 24,999",
            "Small-batch artisan production using full-grain and vegetable-tanned leather",
            "Direct-to-consumer: no middlemen, no retail markup, 60-70% gross margins",
            "Tan Lerida AI: paid styling consultation using computer vision and AI",
            "Upload photos → AI analyzes your look → personalized product recommendation",
        ],
        "narration": (
            "Tangred offers handcrafted leather bags, briefcases, belts, jackets, and accessories, "
            "priced from thirteen hundred to twenty-five thousand rupees. "
            "Direct to consumer, no middlemen, sixty to seventy percent gross margins. "
            "What sets us apart is Tan Lerida, our AI styling assistant. "
            "For 99 rupees, customers upload photos, share their profile, "
            "and our AI recommends the exact piece that suits them. "
            "Like a personal leather tailor on your phone. No one else offers this."
        ),
    },
    {
        "id": "market",
        "heading": "MARKET OPPORTUNITY",
        "subheading": "",
        "bullets": [
            "India's personal luxury market: one of the fastest growing globally",
            "The gap: mass-market under Rs 2,000 vs imported luxury at Rs 30,000+",
            "Target: professionals in Delhi, Mumbai, Bengaluru — founders, executives, consultants",
            "DTC model: zero physical retail overhead, scales nationally and internationally",
            "Diaspora markets: US, UK, Middle East — growing demand for Indian luxury",
        ],
        "narration": (
            "India's personal luxury market is one of the fastest growing globally. "
            "The gap between mass-market leather under two thousand rupees "
            "and imported luxury at thirty thousand plus is wide open. "
            "We target professionals in Delhi, Mumbai, and Bengaluru, "
            "then expand to diaspora markets in the US, UK, and Middle East, "
            "all through our DTC platform with zero retail overhead."
        ),
    },
    {
        "id": "competition",
        "heading": "COMPETITIVE LANDSCAPE",
        "subheading": "",
        "table_data": {
            "headers": ["Brand", "Craft", "DTC", "AI Styling"],
            "rows": [
                ["Hidesign", "Mass-produced", "No — Retail", "No"],
                ["Nappa Dori", "Artisanal", "Limited", "No"],
                ["Da Milano", "Premium", "No — Malls", "No"],
                ["Imported (Coach etc.)", "Varies", "No", "No"],
                ["TANGRED", "Handcrafted", "Yes", "Yes — Tan Lerida"],
            ],
        },
        "narration": (
            "Hidesign is mass-produced. Nappa Dori has no tech. Da Milano is stuck in malls. "
            "Tangred is the only brand combining handcrafted quality, DTC pricing, "
            "and AI-powered styling. "
            "And every consultation captures demand data that tells us what to build next."
        ),
    },
    {
        "id": "closing",
        "heading": "TANGRED",
        "subheading": "Crafted for Those Who Command Respect",
        "body": "Premium Indian Leather  •  AI-Powered Styling  •  Direct to Consumer\n\nvivek@go4garage.in  •  github.com/G4G-EKA-Ai/TANLERIDA",
        "narration": (
            "Tangred. Born in India. Built for ambition. "
            "Our platform is live, our technology moat is real, "
            "and we're ready to scale from Saint Louis. Thank you."
        ),
    },
]


def get_font(size, bold=False):
    """Try to load a good font, fall back to default."""
    font_paths = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            return ImageFont.truetype(fp, size)
    return ImageFont.load_default()


def draw_accent_bar(draw):
    """Draw the top accent bar."""
    draw.rectangle([0, 0, WIDTH, 6], fill=ACCENT_COLOR)


def draw_bottom_bar(draw):
    """Draw a subtle bottom bar."""
    draw.rectangle([0, HEIGHT - 3, WIDTH, HEIGHT], fill=GOLD_COLOR)


def wrap_text(text, font, max_width):
    """Word-wrap text to fit within max_width pixels."""
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        bbox = font.getbbox(test)
        if bbox[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def create_title_slide(slide_data):
    """Create title/closing slide."""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    draw_accent_bar(draw)
    draw_bottom_bar(draw)

    heading_font = get_font(90, bold=True)
    sub_font = get_font(36)
    body_font = get_font(28)

    # Heading
    bbox = draw.textbbox((0, 0), slide_data["heading"], font=heading_font)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, 320), slide_data["heading"], fill=ACCENT_COLOR, font=heading_font)

    # Gold line separator
    draw.rectangle([(WIDTH // 2 - 120), 440, (WIDTH // 2 + 120), 443], fill=GOLD_COLOR)

    # Subheading
    if slide_data.get("subheading"):
        bbox = draw.textbbox((0, 0), slide_data["subheading"], font=sub_font)
        tw = bbox[2] - bbox[0]
        draw.text(((WIDTH - tw) // 2, 470), slide_data["subheading"], fill=GOLD_COLOR, font=sub_font)

    # Body text
    if slide_data.get("body"):
        y = 550
        for line in slide_data["body"].split("\n"):
            if line.strip():
                bbox = draw.textbbox((0, 0), line.strip(), font=body_font)
                tw = bbox[2] - bbox[0]
                draw.text(((WIDTH - tw) // 2, y), line.strip(), fill=LIGHT_GRAY, font=body_font)
            y += 45

    return img


def create_bullet_slide(slide_data):
    """Create a slide with heading and bullet points."""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    draw_accent_bar(draw)
    draw_bottom_bar(draw)

    heading_font = get_font(60, bold=True)
    sub_font = get_font(32)
    bullet_font = get_font(28)

    # Heading
    draw.text((120, 80), slide_data["heading"], fill=ACCENT_COLOR, font=heading_font)

    # Gold underline
    bbox = draw.textbbox((120, 80), slide_data["heading"], font=heading_font)
    draw.rectangle([120, bbox[3] + 10, bbox[2], bbox[3] + 13], fill=GOLD_COLOR)

    # Subheading
    y = bbox[3] + 35
    if slide_data.get("subheading"):
        draw.text((120, y), slide_data["subheading"], fill=GOLD_COLOR, font=sub_font)
        y += 55

    # Bullets
    if slide_data.get("bullets"):
        y = max(y, 240)
        for bullet in slide_data["bullets"]:
            # Bullet marker
            draw.ellipse([140, y + 12, 152, y + 24], fill=ACCENT_COLOR)
            # Wrapped text
            lines = wrap_text(bullet, bullet_font, WIDTH - 320)
            for i, line in enumerate(lines):
                draw.text((175, y), line, fill=WHITE, font=bullet_font)
                y += 42
            y += 20

    return img


def create_table_slide(slide_data):
    """Create a slide with a comparison table."""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    draw_accent_bar(draw)
    draw_bottom_bar(draw)

    heading_font = get_font(60, bold=True)
    header_font = get_font(26, bold=True)
    cell_font = get_font(24)

    # Heading
    draw.text((120, 80), slide_data["heading"], fill=ACCENT_COLOR, font=heading_font)
    bbox = draw.textbbox((120, 80), slide_data["heading"], font=heading_font)
    draw.rectangle([120, bbox[3] + 10, bbox[2], bbox[3] + 13], fill=GOLD_COLOR)

    # Table
    table = slide_data["table_data"]
    col_widths = [340, 300, 280, 380]
    x_start = 120
    y_start = 240

    # Header row
    x = x_start
    draw.rectangle([x_start, y_start, x_start + sum(col_widths), y_start + 55], fill=(40, 40, 40))
    for i, header in enumerate(table["headers"]):
        draw.text((x + 20, y_start + 14), header, fill=GOLD_COLOR, font=header_font)
        x += col_widths[i]

    # Data rows
    y = y_start + 55
    for row_idx, row in enumerate(table["rows"]):
        is_tangred = row[0] == "TANGRED"
        row_bg = (30, 15, 15) if is_tangred else (20, 20, 20) if row_idx % 2 == 0 else BG_COLOR
        row_height = 55

        draw.rectangle([x_start, y, x_start + sum(col_widths), y + row_height], fill=row_bg)

        if is_tangred:
            draw.rectangle([x_start, y, x_start + 4, y + row_height], fill=ACCENT_COLOR)

        x = x_start
        for i, cell in enumerate(row):
            color = ACCENT_COLOR if is_tangred and i == 0 else WHITE if is_tangred else LIGHT_GRAY
            if cell.startswith("Yes"):
                color = (46, 204, 113)
            elif cell == "No":
                color = (150, 80, 80)
            draw.text((x + 20, y + 15), cell, fill=color, font=cell_font)
            x += col_widths[i]

        # Row separator
        draw.line([x_start, y + row_height, x_start + sum(col_widths), y + row_height], fill=(50, 50, 50))
        y += row_height

    return img


def generate_narration(text, output_path):
    """Generate TTS audio for narration."""
    tts = gTTS(text=text, lang="en", slow=False)
    tts.save(output_path)
    return output_path


def create_video():
    """Main function: create slides, narration, and combine into video."""
    print("=" * 60)
    print("  TANGRED — Arch Grant Pitch Video Generator")
    print("=" * 60)

    slide_clips = []

    for i, slide_data in enumerate(SLIDES):
        slide_id = slide_data["id"]
        print(f"\n[{i+1}/{len(SLIDES)}] Creating slide: {slide_id}")

        # Create slide image
        if slide_id in ("title", "closing"):
            img = create_title_slide(slide_data)
        elif "table_data" in slide_data:
            img = create_table_slide(slide_data)
        else:
            img = create_bullet_slide(slide_data)

        img_path = os.path.join(OUTPUT_DIR, f"slide_{i}_{slide_id}.png")
        img.save(img_path, quality=95)
        print(f"  ✓ Slide image saved: {img_path}")

        # Generate narration
        audio_path = os.path.join(OUTPUT_DIR, f"narration_{i}_{slide_id}.mp3")
        generate_narration(slide_data["narration"], audio_path)
        print(f"  ✓ Narration audio saved: {audio_path}")

        # Create video clip from image + audio
        audio_clip = AudioFileClip(audio_path)
        duration = audio_clip.duration + 1.5  # 1.5s padding after narration

        image_clip = (
            ImageClip(img_path)
            .with_duration(duration)
            .with_audio(audio_clip)
        )

        slide_clips.append(image_clip)
        print(f"  ✓ Clip duration: {duration:.1f}s")

    # Concatenate all slides
    print("\n" + "=" * 60)
    print("Combining slides into final video...")
    final = concatenate_videoclips(slide_clips, method="compose")
    print(f"Total duration: {final.duration:.1f}s ({final.duration/60:.1f} min)")

    output_path = os.path.join(OUTPUT_DIR, "tangred_arch_grant_pitch.mp4")
    final.write_videofile(
        output_path,
        fps=24,
        codec="libx264",
        audio_codec="aac",
        bitrate="5000k",
        preset="medium",
        logger="bar",
    )

    print(f"\n{'=' * 60}")
    print(f"  ✅ VIDEO CREATED: {output_path}")
    print(f"  Duration: {final.duration:.1f}s ({final.duration/60:.1f} min)")
    print(f"{'=' * 60}")

    # Cleanup clips
    for clip in slide_clips:
        clip.close()
    final.close()

    return output_path


if __name__ == "__main__":
    create_video()
