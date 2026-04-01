"""
Tangred Arch Grant Pitch Video v2 — Enhanced
- Natural voice (edge-tts Andrew)
- Real product screenshots embedded
- Smooth fade transitions
- Professional slide design with imagery
"""

import asyncio
import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from moviepy import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
    CompositeVideoClip,
    vfx,
)

sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

# ── Paths ──────────────────────────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "pitch_video")
os.makedirs(OUT, exist_ok=True)

# Real screenshots
IMG_HERO = os.path.join(ROOT, "tangred-new-project-hero.png")
IMG_HOMEPAGE = os.path.join(ROOT, "tangred-homepage.png")
IMG_TANLERIDA = os.path.join(ROOT, "tangred-tan-lerida-page.png")
IMG_FOOTER = os.path.join(ROOT, "tangred-hero.png")

# ── Design tokens ──────────────────────────────────────────────────
W, H = 1920, 1080
BG = (18, 18, 18)
RED = (200, 60, 45)
GOLD = (200, 170, 130)
WHITE = (255, 255, 255)
LGRAY = (200, 200, 200)
DGRAY = (45, 45, 45)
MGRAY = (130, 130, 130)

VOICE = "en-US-AndrewMultilingualNeural"
VOICE_RATE = "-3%"
VOICE_PITCH = "-1Hz"


def font(size, bold=False):
    paths = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def wrap(text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if fnt.getbbox(test)[2] <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def load_screenshot(path, target_w, target_h):
    """Load, resize, and add rounded corners + shadow to a screenshot."""
    img = Image.open(path).convert("RGBA")
    # Scale to fit target
    ratio = min(target_w / img.width, target_h / img.height)
    new_w, new_h = int(img.width * ratio), int(img.height * ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Add rounded corners
    mask = Image.new("L", (new_w, new_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, new_w, new_h], radius=16, fill=255)
    img.putalpha(mask)

    # Create container with subtle border
    container = Image.new("RGBA", (new_w + 4, new_h + 4), (0, 0, 0, 0))
    border = Image.new("RGBA", (new_w + 4, new_h + 4), (0, 0, 0, 0))
    bd = ImageDraw.Draw(border)
    bd.rounded_rectangle([0, 0, new_w + 3, new_h + 3], radius=18, outline=(*GOLD, 120), width=2)
    container = Image.alpha_composite(container, border)
    container.paste(img, (2, 2), img)

    return container


def draw_bars(draw):
    draw.rectangle([0, 0, W, 5], fill=RED)
    draw.rectangle([0, H - 3, W, H], fill=GOLD)


def add_gradient_overlay(img, direction="bottom", intensity=0.7):
    """Add a gradient overlay for text readability over images."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for y in range(img.size[1]):
        if direction == "bottom":
            alpha = int(255 * intensity * (y / img.size[1]))
        else:
            alpha = int(255 * intensity * (1 - y / img.size[1]))
        draw.line([(0, y), (img.size[0], y)], fill=(9, 9, 9, alpha))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


# ── Slide Builders ─────────────────────────────────────────────────

def slide_title():
    """Slide 1: Title with hero screenshot."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_bars(draw)

    # Left side: text
    f_heading = font(82, bold=True)
    f_tag = font(30)
    f_sub = font(24)

    draw.text((100, 200), "TANGRED", fill=RED, font=f_heading)

    # Gold separator
    draw.rectangle([100, 310, 340, 313], fill=GOLD)

    draw.text((100, 340), "Born in India. Built for Ambition.", fill=GOLD, font=f_tag)

    y = 420
    lines = [
        "Premium Handcrafted Leather",
        "AI-Powered Personal Styling",
        "Direct to Consumer",
    ]
    for line in lines:
        draw.ellipse([110, y + 8, 120, y + 18], fill=RED)
        draw.text((135, y), line, fill=LGRAY, font=f_sub)
        y += 42

    # Right side: hero screenshot
    try:
        ss = load_screenshot(IMG_HERO, 850, 550)
        img.paste(ss, (980, 220), ss)
    except Exception as e:
        print(f"  Warning: couldn't load hero image: {e}")

    # Bottom tagline
    f_small = font(18)
    draw.text((100, H - 60), "Arch Grant 2026 Application  •  Tangred by GO4GARAGE", fill=MGRAY, font=f_small)

    return img


def slide_problem():
    """Slide 2: The Problem."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_bars(draw)

    f_head = font(56, bold=True)
    f_sub = font(22)
    f_bullet = font(26)
    f_label = font(18, bold=True)

    draw.text((100, 70), "THE PROBLEM", fill=RED, font=f_head)
    bbox = draw.textbbox((100, 70), "THE PROBLEM", font=f_head)
    draw.rectangle([100, bbox[3] + 8, bbox[2], bbox[3] + 11], fill=GOLD)

    draw.text((100, bbox[3] + 30), "India's premium leather market is broken", fill=GOLD, font=f_sub)

    # Problem cards with icons
    cards = [
        ("OVERPRICED", "Imported brands charge 2-3x\ndue to duties & retail markup", RED),
        ("NO CRAFT", "Domestic brands compete\non price, not quality", (180, 120, 40)),
        ("IMPERSONAL", "Online leather shopping has\nzero personalization", (120, 80, 160)),
    ]

    card_w, card_h = 520, 200
    x_start = 100
    y_start = 250

    for i, (label, desc, color) in enumerate(cards):
        cx = x_start + i * (card_w + 40)
        # Card background
        draw.rounded_rectangle([cx, y_start, cx + card_w, y_start + card_h], radius=12, fill=DGRAY, outline=(*color, 80))
        # Color accent bar at top
        draw.rectangle([cx, y_start, cx + card_w, y_start + 4], fill=color)
        # Label
        draw.text((cx + 25, y_start + 25), label, fill=color, font=f_label)
        # Description
        for j, line in enumerate(desc.split("\n")):
            draw.text((cx + 25, y_start + 60 + j * 34), line, fill=LGRAY, font=f_sub)

    # Bottom stat bar
    y_stat = 510
    draw.rounded_rectangle([100, y_stat, W - 100, y_stat + 100], radius=12, fill=(20, 20, 20))

    stats = [
        ("₹500 - ₹2,000", "Mass Market"),
        ("WIDE GAP", "No Premium Indian DTC"),
        ("₹30,000+", "Imported Luxury"),
    ]
    for i, (val, label) in enumerate(stats):
        sx = 200 + i * 560
        f_stat = font(32, bold=True)
        f_slabel = font(18)
        color = GOLD if i == 1 else WHITE
        draw.text((sx, y_stat + 18), val, fill=color, font=f_stat)
        draw.text((sx, y_stat + 60), label, fill=MGRAY, font=f_slabel)

    # Arrow between stats
    for ax in [490, 1050]:
        draw.text((ax, y_stat + 25), "→", fill=RED, font=font(28, bold=True))

    # Target customer
    y_target = 660
    draw.text((100, y_target), "TARGET CUSTOMER", fill=RED, font=f_label)
    draw.text((100, y_target + 35), "Founders, executives, consultants in Tier-1 Indian metros (Delhi, Mumbai, Bengaluru)", fill=LGRAY, font=f_sub)
    draw.text((100, y_target + 70), "Age 25-55  •  Household income above ₹15 lakh  •  Value craftsmanship over logos", fill=MGRAY, font=f_sub)

    return img


def slide_solution():
    """Slide 3: The Solution with product screenshot."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_bars(draw)

    f_head = font(56, bold=True)
    f_sub = font(24)
    f_bullet = font(22)
    f_label = font(18, bold=True)
    f_price = font(20)

    draw.text((100, 70), "THE SOLUTION", fill=RED, font=f_head)
    bbox = draw.textbbox((100, 70), "THE SOLUTION", font=f_head)
    draw.rectangle([100, bbox[3] + 8, bbox[2], bbox[3] + 11], fill=GOLD)

    # Left column: Products
    y = 190
    draw.text((100, y), "HANDCRAFTED LEATHER GOODS", fill=GOLD, font=f_label)
    y += 40

    products = [
        "Office Bags & Briefcases — ₹8,299 to ₹14,999",
        "Leather Jackets — ₹24,999",
        "Belts & Wallets — ₹2,499 to ₹3,499",
        "Accessories — from ₹1,299",
    ]
    for p in products:
        draw.ellipse([115, y + 8, 125, y + 18], fill=RED)
        draw.text((140, y), p, fill=WHITE, font=f_bullet)
        y += 38

    y += 15
    draw.text((100, y), "DIRECT TO CONSUMER", fill=GOLD, font=f_label)
    y += 35
    draw.text((140, y), "No middlemen  •  60-70% gross margins", fill=LGRAY, font=f_bullet)

    # Right column: Tan Lerida AI with screenshot
    right_x = 980
    draw.text((right_x, 190), "TAN LERIDA™ AI STYLIST", fill=GOLD, font=f_label)

    # Screenshot of Tan Lerida page
    try:
        ss = load_screenshot(IMG_TANLERIDA, 780, 340)
        img.paste(ss, (right_x, 230), ss)
    except Exception as e:
        print(f"  Warning: {e}")

    # AI flow steps below screenshot
    y_flow = 600
    draw.text((100, y_flow), "HOW TAN LERIDA WORKS", fill=RED, font=f_label)
    y_flow += 45

    steps = [
        ("1", "UPLOAD", "Customer shares their photos"),
        ("2", "ANALYZE", "AI reads body type, skin tone, style"),
        ("3", "MATCH", "Algorithm finds the perfect piece"),
        ("4", "RECOMMEND", "Personalized narrative + outfit visual"),
    ]

    for i, (num, title, desc) in enumerate(steps):
        sx = 100 + i * 440
        # Circle with number
        draw.ellipse([sx, y_flow, sx + 40, y_flow + 40], fill=RED)
        draw.text((sx + 13, y_flow + 6), num, fill=WHITE, font=font(22, bold=True))
        # Step title
        draw.text((sx + 55, y_flow + 2), title, fill=WHITE, font=font(20, bold=True))
        # Step description
        draw.text((sx + 55, y_flow + 28), desc, fill=MGRAY, font=font(17))

        # Arrow between steps
        if i < 3:
            ax = sx + 380
            draw.text((ax, y_flow + 5), "→", fill=GOLD, font=font(24))

    # Price callout
    y_price = y_flow + 90
    draw.rounded_rectangle([100, y_price, 500, y_price + 50], radius=8, fill=(50, 20, 20))
    draw.text((120, y_price + 12), "₹99 per consultation  •  Paid lead magnet", fill=WHITE, font=f_price)

    return img


def slide_market():
    """Slide 4: Market Opportunity."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_bars(draw)

    f_head = font(56, bold=True)
    f_sub = font(24)
    f_label = font(18, bold=True)
    f_big = font(44, bold=True)

    draw.text((100, 70), "MARKET OPPORTUNITY", fill=RED, font=f_head)
    bbox = draw.textbbox((100, 70), "MARKET OPPORTUNITY", font=f_head)
    draw.rectangle([100, bbox[3] + 8, bbox[2], bbox[3] + 11], fill=GOLD)

    # Key stats in large cards
    stats_cards = [
        ("$8B+", "India's luxury\ngoods market", "One of the fastest\ngrowing globally"),
        ("₹2K–₹30K", "The underserved\nprice gap", "Premium but accessible\nIndian leather"),
        ("3 Cities", "Launch markets\nDelhi, Mumbai, BLR", "Then national\n& international"),
    ]

    for i, (big, title, desc) in enumerate(stats_cards):
        cx = 100 + i * 590
        cy = 210
        cw, ch = 550, 250

        draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=14, fill=DGRAY)
        draw.rectangle([cx, cy, cx + 5, cy + ch], fill=RED)

        draw.text((cx + 30, cy + 25), big, fill=RED, font=f_big)
        y_t = cy + 90
        for line in title.split("\n"):
            draw.text((cx + 30, y_t), line, fill=WHITE, font=f_sub)
            y_t += 30
        y_t += 10
        for line in desc.split("\n"):
            draw.text((cx + 30, y_t), line, fill=MGRAY, font=font(18))
            y_t += 24

    # Go-to-market phases
    y_gtm = 520
    draw.text((100, y_gtm), "GO-TO-MARKET STRATEGY", fill=RED, font=f_label)
    y_gtm += 45

    phases = [
        ("PHASE 1: LAUNCH", "Target professionals in 3 metros via\nLinkedIn & Instagram ads. Tan Lerida\nconsultations as premium lead magnet.", RED),
        ("PHASE 2: GROW", "Content engine, referral programs,\nloyalty system. Tan Lerida becomes\nrecurring engagement tool.", GOLD),
        ("PHASE 3: SCALE", "Expand categories based on AI data.\nDiaspora markets: US, UK, Middle East.\nZero retail overhead.", (46, 204, 113)),
    ]

    for i, (title, desc, color) in enumerate(phases):
        px = 100 + i * 590
        pw, ph = 550, 180

        draw.rounded_rectangle([px, y_gtm, px + pw, y_gtm + ph], radius=12, fill=(20, 20, 20), outline=(*color, 60))
        draw.rectangle([px, y_gtm, px + pw, y_gtm + 4], fill=color)

        draw.text((px + 20, y_gtm + 18), title, fill=color, font=font(19, bold=True))
        y_d = y_gtm + 50
        for line in desc.split("\n"):
            draw.text((px + 20, y_d), line, fill=LGRAY, font=font(18))
            y_d += 26

    # Key metric
    y_km = y_gtm + 210
    draw.rounded_rectangle([100, y_km, W - 100, y_km + 55], radius=8, fill=(30, 15, 15))
    draw.text((130, y_km + 14), "KEY METRIC:  Tan Lerida consultation → purchase conversion rate = our growth flywheel", fill=WHITE, font=font(20))

    return img


def slide_competition():
    """Slide 5: Competitive Landscape."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_bars(draw)

    f_head = font(56, bold=True)
    f_label = font(18, bold=True)
    f_cell = font(22)
    f_hdr = font(22, bold=True)

    draw.text((100, 70), "COMPETITIVE LANDSCAPE", fill=RED, font=f_head)
    bbox = draw.textbbox((100, 70), "COMPETITIVE LANDSCAPE", font=f_head)
    draw.rectangle([100, bbox[3] + 8, bbox[2], bbox[3] + 11], fill=GOLD)

    # Comparison table
    headers = ["Brand", "Craftsmanship", "DTC Model", "AI Styling", "Price Range"]
    col_w = [300, 300, 260, 280, 300]
    x0, y0 = 100, 210
    row_h = 60

    # Header row
    x = x0
    draw.rounded_rectangle([x0, y0, x0 + sum(col_w), y0 + row_h], radius=8, fill=(40, 40, 40))
    for i, h in enumerate(headers):
        draw.text((x + 18, y0 + 17), h, fill=GOLD, font=f_hdr)
        x += col_w[i]

    rows = [
        ["Hidesign", "Mass-produced", "No — Retail", "No", "₹3K - ₹15K"],
        ["Nappa Dori", "Artisanal", "Limited", "No", "₹5K - ₹25K"],
        ["Da Milano", "Premium", "No — Malls", "No", "₹4K - ₹20K"],
        ["Coach / Imported", "Varies", "No", "No", "₹15K - ₹60K+"],
        ["TANGRED", "Handcrafted ✓", "100% DTC ✓", "Tan Lerida ✓", "₹1.3K - ₹25K"],
    ]

    y = y0 + row_h
    for ri, row in enumerate(rows):
        is_t = row[0] == "TANGRED"
        bg = (35, 15, 15) if is_t else (22, 22, 22) if ri % 2 == 0 else BG
        draw.rectangle([x0, y, x0 + sum(col_w), y + row_h], fill=bg)
        if is_t:
            draw.rectangle([x0, y, x0 + 4, y + row_h], fill=RED)

        x = x0
        for ci, cell in enumerate(row):
            if is_t:
                color = RED if ci == 0 else (46, 204, 113) if "✓" in cell else WHITE
            elif "No" in cell:
                color = (150, 80, 80)
            else:
                color = LGRAY
            draw.text((x + 18, y + 17), cell, fill=color, font=f_cell)
            x += col_w[ci]
        draw.line([x0, y + row_h, x0 + sum(col_w), y + row_h], fill=(50, 50, 50))
        y += row_h

    # Unique value prop section
    y_uvp = y + 50
    draw.text((100, y_uvp), "OUR MOAT", fill=RED, font=f_label)
    y_uvp += 40

    moats = [
        ("AI-Powered Styling", "First-mover in Indian leather DTC — computer vision + LLM recommendations"),
        ("Data Flywheel", "Every consultation captures demand signals — what to build next"),
        ("DTC Pricing Power", "60-70% gross margins — no retail intermediaries"),
    ]
    for i, (title, desc) in enumerate(moats):
        mx = 100 + i * 580
        draw.rounded_rectangle([mx, y_uvp, mx + 550, y_uvp + 90], radius=10, fill=DGRAY)
        draw.ellipse([mx + 15, y_uvp + 15, mx + 25, y_uvp + 25], fill=RED)
        draw.text((mx + 35, y_uvp + 10), title, fill=WHITE, font=font(20, bold=True))
        draw.text((mx + 35, y_uvp + 40), desc, fill=MGRAY, font=font(16))

    return img


def slide_closing():
    """Slide 6: Closing with homepage screenshot."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_bars(draw)

    f_brand = font(80, bold=True)
    f_tag = font(34)
    f_sub = font(24)
    f_small = font(20)

    # Left: Brand and CTA
    draw.text((100, 180), "TANGRED", fill=RED, font=f_brand)
    draw.rectangle([100, 290, 380, 293], fill=GOLD)
    draw.text((100, 320), "Crafted for Those Who", fill=WHITE, font=f_tag)
    draw.text((100, 365), "Command Respect", fill=GOLD, font=f_tag)

    y = 440
    highlights = [
        "✓  Production-ready platform — live and functional",
        "✓  AI technology moat — no competitor can replicate",
        "✓  Clear path to scale — DTC, zero retail overhead",
        "✓  Ready for St. Louis and global expansion",
    ]
    for h in highlights:
        draw.text((100, y), h, fill=LGRAY, font=f_sub)
        y += 40

    # Right: Homepage screenshot
    try:
        ss = load_screenshot(IMG_HOMEPAGE, 750, 450)
        img.paste(ss, (1050, 180), ss)
    except Exception as e:
        print(f"  Warning: {e}")

    # Contact bar
    y_contact = H - 130
    draw.rounded_rectangle([100, y_contact, W - 100, y_contact + 80], radius=12, fill=DGRAY)
    draw.text((140, y_contact + 10), "vivek@go4garage.in", fill=WHITE, font=f_small)
    draw.text((140, y_contact + 40), "github.com/G4G-EKA-Ai/TANLERIDA", fill=MGRAY, font=font(18))
    draw.text((W - 500, y_contact + 20), "Arch Grant 2026  •  Thank You", fill=GOLD, font=f_sub)

    return img


# ── Narration (confident, explanatory) ─────────────────────────────

NARRATION = [
    # Title
    (
        "Hi, I'm Vivek, the founder of Tangred. "
        "We are building India's first AI-powered premium leather brand, "
        "selling handcrafted goods direct to consumers. "
        "Let me walk you through why this opportunity is massive."
    ),
    # Problem
    (
        "Here's the problem. India's luxury market is booming, "
        "but professionals looking for premium leather goods face three broken options. "
        "First, imported brands like Coach charge two to three times more "
        "due to import duties and retail margins. "
        "Second, domestic brands compete on price, not craftsmanship. "
        "And third, buying leather online is completely impersonal. "
        "There is a massive gap between mass-market leather under two thousand rupees, "
        "and imported luxury at thirty thousand plus. "
        "That gap is where Tangred lives."
    ),
    # Solution
    (
        "Our solution has two parts. "
        "First, handcrafted premium leather goods — "
        "bags, briefcases, belts, jackets, and accessories — "
        "made by Indian artisans from full-grain leather, "
        "priced from thirteen hundred to twenty-five thousand rupees. "
        "Direct to consumer, no middlemen, sixty to seventy percent gross margins. "
        "Second, our real differentiator: Tan Lerida, an AI styling assistant. "
        "For ninety-nine rupees, customers upload photos and share their style needs. "
        "Our AI analyzes their look and recommends the exact Tangred piece that suits them. "
        "A personal leather tailor on your phone. No one else offers this."
    ),
    # Market
    (
        "The market opportunity is clear. "
        "India's personal luxury market is one of the fastest growing globally. "
        "We're targeting the underserved sweet spot between mass-market and imported luxury. "
        "Our launch strategy starts in three Tier 1 cities, Delhi, Mumbai, and Bengaluru, "
        "targeting professionals through LinkedIn and Instagram. "
        "Tan Lerida consultations serve as a paid lead magnet that drives higher conversion. "
        "Then we scale nationally, and into diaspora markets in the US, UK, and Middle East, "
        "all through our DTC platform with zero physical retail overhead."
    ),
    # Competition
    (
        "Looking at the competitive landscape. "
        "Hidesign is mass-produced with retail markup. "
        "Nappa Dori is artisanal but has no technology. "
        "Da Milano is stuck in malls. "
        "And imported brands are overpriced. "
        "Tangred is the only brand combining all three: "
        "handcrafted quality, direct-to-consumer pricing, and AI-powered personal styling. "
        "Our AI creates a data flywheel. "
        "Every consultation captures real demand signals that tell us exactly what to build next. "
        "That's a moat that competitors cannot easily replicate."
    ),
    # Closing
    (
        "To close. Tangred is production-ready. Our platform is live and fully functional. "
        "We have a technology moat that no competitor can easily match. "
        "And we have a clear path to scale from Saint Louis to global markets. "
        "We're excited about the opportunity to build this with the Arch Grant community. "
        "Thank you for your time."
    ),
]


async def generate_audio(text, path):
    """Generate natural-sounding TTS with edge-tts."""
    import edge_tts
    comm = edge_tts.Communicate(text, VOICE, rate=VOICE_RATE, pitch=VOICE_PITCH)
    await comm.save(path)


def create_video():
    print("=" * 60)
    print("  TANGRED — Arch Grant Pitch Video v2 (Enhanced)")
    print("=" * 60)

    slide_builders = [
        slide_title,
        slide_problem,
        slide_solution,
        slide_market,
        slide_competition,
        slide_closing,
    ]

    slide_names = ["title", "problem", "solution", "market", "competition", "closing"]
    clips = []

    for i, (builder, name) in enumerate(zip(slide_builders, slide_names)):
        print(f"\n[{i + 1}/6] Building slide: {name}")

        # Generate slide image
        img = builder()
        img_path = os.path.join(OUT, f"v2_slide_{i}_{name}.png")
        img.save(img_path, quality=95)
        print(f"  ✓ Slide saved: {img_path}")

        # Generate narration
        audio_path = os.path.join(OUT, f"v2_narration_{i}_{name}.mp3")
        asyncio.run(generate_audio(NARRATION[i], audio_path))
        print(f"  ✓ Narration saved: {audio_path}")

        # Build clip
        audio = AudioFileClip(audio_path)
        duration = audio.duration + 1.2  # breathing room

        clip = (
            ImageClip(img_path)
            .with_duration(duration)
            .with_audio(audio)
        )

        # Add fade in/out for smooth transitions
        clip = clip.with_effects([
            vfx.FadeIn(0.5),
            vfx.FadeOut(0.4),
        ])

        clips.append(clip)
        print(f"  ✓ Duration: {duration:.1f}s")

    # Combine
    print("\n" + "=" * 60)
    print("Combining into final video...")
    final = concatenate_videoclips(clips, method="compose")
    total_min = int(final.duration // 60)
    total_sec = int(final.duration % 60)
    print(f"Total duration: {total_min}:{total_sec:02d}")

    output = os.path.join(OUT, "tangred_arch_grant_pitch_v2.mp4")
    
    # Remove old file first
    if os.path.exists(output):
        os.remove(output)
    
    final.write_videofile(
        output,
        fps=24,
        codec="libx264",
        audio_codec="aac",
        bitrate="12000k",
        preset="slow",
        ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
        logger="bar",
    )

    print(f"\n{'=' * 60}")
    print(f"  ✅ VIDEO CREATED: {output}")
    print(f"  Duration: {total_min}:{total_sec:02d}")
    sz = os.path.getsize(output) / (1024 * 1024)
    print(f"  Size: {sz:.1f} MB")
    print(f"{'=' * 60}")

    for c in clips:
        c.close()
    final.close()


if __name__ == "__main__":
    create_video()
