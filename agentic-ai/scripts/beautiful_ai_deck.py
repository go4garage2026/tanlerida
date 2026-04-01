"""
Tangred Arch Grant 2026 — Beautiful AI Smart-Template Pitch Deck
Applies Beautiful.ai-style smart design: gradient accents, grid alignment,
professional typography, visual hierarchy, and polished card layouts.
Renders to PDF via Playwright headless Chromium.
"""

import os, sys, base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "pitch_video"
OUT.mkdir(exist_ok=True)
HTML_PATH = OUT / "Tangred_Arch_Grant_2026_BeautifulAI.html"
PDF_PATH  = OUT / "Tangred_Arch_Grant_2026_BeautifulAI.pdf"

# Encode product screenshots as base64 for embedding
def img_to_b64(path):
    if path.exists():
        data = path.read_bytes()
        return f"data:image/png;base64,{base64.b64encode(data).decode()}"
    return ""

IMG_HERO = img_to_b64(ROOT / "tangred-new-project-hero.png")
IMG_HOME = img_to_b64(ROOT / "tangred-homepage.png")
IMG_TL   = img_to_b64(ROOT / "tangred-tan-lerida-page.png")
IMG_FOOT = img_to_b64(ROOT / "tangred-hero.png")

print("🎨 Building Beautiful AI smart-template deck...")

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TANGRED — Arch Grant 2026</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

:root {{
  --bg: #0A0A0A;
  --surface: #141414;
  --card: #1B1B1B;
  --elevated: #222222;
  --red: #C0392B;
  --red-light: #E74C3C;
  --red-glow: rgba(192,57,43,0.15);
  --gold: #BFA07A;
  --gold-light: #D4BC96;
  --gold-glow: rgba(191,160,122,0.12);
  --green: #27AE60;
  --green-light: #2ECC71;
  --blue: #2980B9;
  --blue-light: #3498DB;
  --white: #FFFFFF;
  --t1: #F0F0F0;
  --t2: #AAAAAA;
  --t3: #777777;
  --t4: #444444;
  --radius: 16px;
  --radius-sm: 10px;
}}

* {{ margin:0; padding:0; box-sizing:border-box; }}

body {{
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #000;
  color: var(--white);
  -webkit-font-smoothing: antialiased;
}}

/* ── Slide Container ────────────────────────────── */
.slide {{
  width: 1280px;
  height: 720px;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  page-break-after: always;
  margin: 0 auto;
}}

/* Smart gradient mesh backgrounds */
.slide::before {{
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, var(--red-glow) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}}
.slide::after {{
  content: '';
  position: absolute;
  bottom: -40%;
  left: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--gold-glow) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}}

.slide-inner {{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 48px 56px;
  display: flex;
  flex-direction: column;
}}

/* Top accent bar with gradient */
.top-bar {{
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--red) 0%, var(--red-light) 40%, var(--gold) 100%);
  z-index: 2;
}}

/* Bottom subtle bar */
.bottom-bar {{
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--gold) 0%, rgba(191,160,122,0.3) 100%);
  z-index: 2;
}}

/* Slide number */
.slide-num {{
  position: absolute;
  bottom: 14px;
  right: 24px;
  font-size: 11px;
  color: var(--t4);
  font-weight: 500;
  letter-spacing: 1px;
  z-index: 2;
}}

/* ── Typography ─────────────────────────────────── */
.brand {{
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-weight: 900;
  color: var(--red);
  letter-spacing: 8px;
}}
.brand-sm {{
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--t4);
  letter-spacing: 4px;
  text-transform: uppercase;
}}

h2 {{
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: 1px;
  margin-bottom: 4px;
}}
h2 .accent {{ color: var(--red); }}

.subtitle {{
  font-size: 15px;
  font-weight: 400;
  color: var(--gold);
  letter-spacing: 0.5px;
  margin-bottom: 24px;
}}

.gold-line {{
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  margin: 12px 0 16px;
}}

/* ── Cards (Smart Layout) ───────────────────────── */
.grid {{ display: grid; gap: 16px; }}
.g2 {{ grid-template-columns: 1fr 1fr; }}
.g3 {{ grid-template-columns: 1fr 1fr 1fr; }}
.g4 {{ grid-template-columns: 1fr 1fr 1fr 1fr; }}

.card {{
  background: var(--card);
  border-radius: var(--radius);
  padding: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.04);
}}
.card::before {{
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--red);
}}
.card.gold::before {{ background: var(--gold); }}
.card.green::before {{ background: var(--green); }}
.card.blue::before {{ background: var(--blue); }}
.card.orange::before {{ background: #D4851F; }}

.card .icon {{ font-size: 22px; margin-bottom: 10px; }}
.card h3 {{
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
}}
.card p {{ font-size: 12px; color: var(--t2); line-height: 1.65; }}
.card .big-num {{
  font-size: 38px;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 4px;
}}
.card .mid-num {{
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 2px;
}}
.card .badge {{
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(46,204,113,0.15);
  color: var(--green-light);
}}
.card .badge.planned {{
  background: rgba(255,255,255,0.05);
  color: var(--t3);
}}

/* ── Stat Bar ───────────────────────────────────── */
.stat-bar {{
  background: var(--surface);
  border-radius: var(--radius-sm);
  padding: 16px 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}}
.stat {{ text-align: center; }}
.stat .val {{ font-size: 22px; font-weight: 800; color: var(--white); }}
.stat .val.gold {{ color: var(--gold); }}
.stat .val.green {{ color: var(--green-light); }}
.stat .val.red {{ color: var(--red); }}
.stat .lbl {{ font-size: 10px; color: var(--t3); margin-top: 3px; letter-spacing: 0.5px; }}

/* ── Table ──────────────────────────────────────── */
table {{ width: 100%; border-collapse: separate; border-spacing: 0 4px; }}
th {{
  background: var(--surface);
  color: var(--gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 10px 14px;
  text-align: left;
}}
th:first-child {{ border-radius: 8px 0 0 8px; }}
th:last-child {{ border-radius: 0 8px 8px 0; }}
td {{
  background: var(--card);
  font-size: 12px;
  color: var(--t2);
  padding: 10px 14px;
}}
td:first-child {{ border-radius: 8px 0 0 8px; }}
td:last-child {{ border-radius: 0 8px 8px 0; }}
tr.hl td {{
  background: linear-gradient(135deg, rgba(192,57,43,0.12), rgba(191,160,122,0.08));
  color: var(--white);
  font-weight: 600;
  border-top: 1px solid var(--red);
  border-bottom: 1px solid var(--red);
}}
tr.hl td:first-child {{ border-left: 1px solid var(--red); }}
tr.hl td:last-child {{ border-right: 1px solid var(--red); }}
.chk {{ color: var(--green-light); font-weight: 700; }}
.xmark {{ color: #664444; }}

/* ── Moat / Callout Box ─────────────────────────── */
.callout {{
  background: var(--surface);
  border: 1px solid rgba(191,160,122,0.25);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
}}
.callout h4 {{ font-size: 13px; color: var(--gold); letter-spacing: 1px; margin-bottom: 6px; }}
.callout p {{ font-size: 12px; color: var(--t2); line-height: 1.6; }}

/* ── Flow / Funnel ──────────────────────────────── */
.funnel {{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}}
.funnel .step {{ text-align: center; }}
.funnel .step .val {{ font-size: 22px; font-weight: 800; }}
.funnel .step .lbl {{ font-size: 9px; color: var(--t3); margin-top: 2px; }}
.funnel .arrow {{ color: var(--t4); font-size: 16px; }}

/* ── Two Column ─────────────────────────────────── */
.two-col {{ display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }}
.col h3 {{ font-size: 15px; font-weight: 700; margin-bottom: 12px; }}
.col li {{
  font-size: 12px; color: var(--t2); padding: 4px 0;
  list-style: none; line-height: 1.6;
}}
.col li::before {{ content: '▸ '; color: var(--gold); font-weight: 700; }}

/* ── Commitment Bar ─────────────────────────────── */
.commit {{
  background: var(--surface);
  border: 1px solid rgba(191,160,122,0.2);
  border-radius: var(--radius-sm);
  padding: 14px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}}
.commit span {{ font-size: 11px; color: var(--t2); }}

/* ── Contact Card ───────────────────────────────── */
.contact {{
  background: linear-gradient(135deg, var(--card), var(--surface));
  border: 1px solid rgba(191,160,122,0.3);
  border-radius: var(--radius);
  padding: 28px 40px;
  text-align: center;
  max-width: 420px;
  margin: 0 auto;
}}
.contact h3 {{
  font-size: 12px; color: var(--gold); letter-spacing: 3px;
  text-transform: uppercase; margin-bottom: 14px;
}}
.contact .name {{ font-size: 15px; font-weight: 600; }}
.contact .info {{ font-size: 12px; color: var(--t2); margin-top: 4px; }}

/* ── Delivered list ─────────────────────────────── */
.delivered {{
  display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px;
}}
.delivered span {{
  font-size: 11px; color: var(--t2); padding: 2px 0;
}}
.delivered span::before {{ content: '▸ '; color: var(--green-light); }}

/* ── Screenshot ─────────────────────────────────── */
.screenshot {{
  border-radius: 12px;
  border: 1px solid rgba(191,160,122,0.15);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  object-fit: cover;
}}

/* ── Misc ───────────────────────────────────────── */
.meta {{ font-size: 11px; color: var(--t4); }}
.flex-center {{ display:flex; align-items:center; justify-content:center; }}
.text-center {{ text-align: center; }}
.mt-auto {{ margin-top: auto; }}
.mb-8 {{ margin-bottom: 8px; }}
.mb-12 {{ margin-bottom: 12px; }}
.mb-16 {{ margin-bottom: 16px; }}
.mb-20 {{ margin-bottom: 20px; }}
.mb-24 {{ margin-bottom: 24px; }}
.mt-12 {{ margin-top: 12px; }}
.mt-16 {{ margin-top: 16px; }}
.mt-20 {{ margin-top: 20px; }}
.grow {{ flex: 1; }}

/* Table value styling */
.kv {{ display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }}
.kv .k {{ font-size: 11px; color: var(--t3); }}
.kv .v {{ font-size: 12px; font-weight: 600; }}
.kv .v.green {{ color: var(--green-light); }}

@media print {{
  body {{ margin: 0; }}
  .slide {{ page-break-after: always; margin: 0; }}
}}
</style>
</head>
<body>

<!-- ═══════════════ SLIDE 1 — TITLE ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner" style="justify-content:center;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;">
      <div>
        <div class="brand-sm mb-8">Arch Grant 2026</div>
        <div class="brand mb-8">TANGRED</div>
        <div class="gold-line"></div>
        <div style="font-family:'Playfair Display',serif;font-size:22px;color:var(--gold);font-weight:400;margin-bottom:28px;">
          Born in India. Built for Ambition.
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:6px;height:6px;background:var(--red);border-radius:50%;"></div>
            <span style="font-size:14px;color:var(--t2);">Premium Handcrafted Indian Leather</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:6px;height:6px;background:var(--gold);border-radius:50%;"></div>
            <span style="font-size:14px;color:var(--t2);">AI-Powered Personal Styling — Tan Lerida™</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:6px;height:6px;background:var(--green);border-radius:50%;"></div>
            <span style="font-size:14px;color:var(--t2);">Direct-to-Consumer — Live & Production-Ready</span>
          </div>
        </div>
        <div style="margin-top:32px;">
          <div style="font-size:13px;color:var(--t2);font-weight:500;">Jayti Pargal &nbsp;·&nbsp; Founder & CEO</div>
          <div style="font-size:12px;color:var(--t4);margin-top:3px;">vivek@go4garage.in</div>
        </div>
      </div>
      <div>
        {"<img src='" + IMG_HERO + "' class='screenshot' style='width:100%;max-height:460px;' />" if IMG_HERO else "<div style='width:100%;height:400px;background:var(--card);border-radius:12px;'></div>"}
      </div>
    </div>
  </div>
  <span class="slide-num">01 / 12</span>
</div>

<!-- ═══════════════ SLIDE 2 — PROBLEM ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">The</span> Problem</h2>
    <div class="subtitle">India's premium leather market is broken — here's why</div>

    <div class="grid g3 mb-20">
      <div class="card">
        <div class="icon">💰</div>
        <h3 style="color:var(--red)">Overpriced Imports</h3>
        <p>Luxury brands like Coach & Fossil charge 2–3× in India due to import duties, middlemen, and retail markup. A $200 bag costs $500+.</p>
      </div>
      <div class="card orange">
        <div class="icon">🏭</div>
        <h3 style="color:#D4851F">No Craft in Domestic</h3>
        <p>Indian brands compete on price, not craftsmanship. Mass-produced goods flood the market, eroding consumer trust in local quality.</p>
      </div>
      <div class="card" style="--accent:#7850A0">
        <div class="icon">🤷</div>
        <h3 style="color:#9B6FD0">Zero Personalization</h3>
        <p>Buying premium leather online is a guessing game. No sizing guidance, no style advice, no way to visualize fit before purchasing.</p>
      </div>
    </div>

    <div class="stat-bar mb-16">
      <div class="stat"><div class="val">₹500 – ₹2K</div><div class="lbl">Mass Market</div></div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="font-size:13px;color:var(--gold);font-weight:700;letter-spacing:2px;">◀─── WIDE OPEN GAP ───▶</div>
        <div style="font-size:10px;color:var(--t3);margin-top:3px;">No Premium Indian DTC Brand</div>
      </div>
      <div class="stat"><div class="val">₹30,000+</div><div class="lbl">Imported Luxury</div></div>
    </div>

    <div style="font-size:12px;color:var(--t2);">
      <span style="color:var(--red);font-weight:700;">TARGET</span>&nbsp;&nbsp;
      Founders, executives, consultants in Delhi, Mumbai, Bengaluru &nbsp;·&nbsp;
      Age 25–55 &nbsp;·&nbsp; Income ₹15L+ &nbsp;·&nbsp; Value craftsmanship over logos
    </div>
  </div>
  <span class="slide-num">02 / 12</span>
</div>

<!-- ═══════════════ SLIDE 3 — SOLUTION ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">The</span> Solution</h2>
    <div class="subtitle">Tangred + Tan Lerida™ AI Styling Assistant</div>

    <div class="grid g2 mb-16" style="flex:1;">
      <div>
        <div style="font-size:15px;font-weight:700;margin-bottom:14px;">🏷️&nbsp; TANGRED — Premium Leather, Direct to You</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ Handcrafted bags, briefcases, belts, jackets & accessories</div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ Full-grain & vegetable-tanned leather, artisan production</div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ ₹1,299 – ₹24,999 — luxury quality at honest prices</div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ Direct-to-consumer: no middlemen, <strong style="color:var(--green-light)">60–70% gross margins</strong></div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ Made-to-order model minimizes inventory risk</div>
        </div>
        {"<img src='" + IMG_HOME + "' class='screenshot' style='width:100%;max-height:200px;' />" if IMG_HOME else ""}
      </div>
      <div>
        <div style="font-size:15px;font-weight:700;color:var(--gold);margin-bottom:14px;">🧠&nbsp; TAN LERIDA™ — Your AI Master Tailor</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ ₹99 paid consultation — AI-powered styling session</div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ Upload photos → AI analyzes body profile & style identity</div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ Share preferences → budget, occasion, specific need</div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ Get personalized product recommendations with rationale</div>
          <div style="font-size:12px;color:var(--t2);line-height:1.5;">▸ <strong style="color:var(--gold-light)">See AI-generated visualization of you in Tangred</strong></div>
        </div>
        {"<img src='" + IMG_TL + "' class='screenshot' style='width:100%;max-height:200px;' />" if IMG_TL else ""}
      </div>
    </div>
  </div>
  <span class="slide-num">03 / 12</span>
</div>

<!-- ═══════════════ SLIDE 4 — HOW IT WORKS ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">How</span> Tan Lerida™ Works</h2>
    <div class="subtitle">4-Step AI Consultation — Like a Personal Leather Tailor on Your Phone</div>

    <div class="grid g4 mb-20">
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:28px;font-weight:900;color:var(--red);line-height:1;">01</span>
          <span style="font-size:20px;">📸</span>
        </div>
        <h3 style="color:var(--white)">Upload Photos</h3>
        <p>Upload casual, formal, and full-body photos. Our AI reads your silhouette, drape, and personal presence.</p>
      </div>
      <div class="card orange">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:28px;font-weight:900;color:#D4851F;line-height:1;">02</span>
          <span style="font-size:20px;">👤</span>
        </div>
        <h3 style="color:var(--white)">Share Profile</h3>
        <p>Tell us your body build, skin tone, style archetype, and budget range. We understand your identity.</p>
      </div>
      <div class="card green">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:28px;font-weight:900;color:var(--green);line-height:1;">03</span>
          <span style="font-size:20px;">🧠</span>
        </div>
        <h3 style="color:var(--white)">AI Analysis</h3>
        <p>Google Gemini analyzes your photos. Anthropic Claude generates personalized recommendations matched to you.</p>
      </div>
      <div class="card gold">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:28px;font-weight:900;color:var(--gold);line-height:1;">04</span>
          <span style="font-size:20px;">✨</span>
        </div>
        <h3 style="color:var(--white)">See Yourself</h3>
        <p>Get your curated product shortlist with AI-generated visualization showing you in Tangred leather.</p>
      </div>
    </div>

    <div class="stat-bar">
      <div class="stat"><div class="val" style="font-size:13px;font-weight:600;">Google Gemini 1.5 Pro</div><div class="lbl">Vision Analysis</div></div>
      <div class="stat"><div class="val" style="font-size:13px;font-weight:600;">Anthropic Claude 3.5</div><div class="lbl">Recommendations</div></div>
      <div class="stat"><div class="val" style="font-size:13px;font-weight:600;">Pinecone Vector DB</div><div class="lbl">Semantic Search</div></div>
      <div class="stat"><div class="val" style="font-size:13px;font-weight:600;">Replicate / SDXL</div><div class="lbl">Outfit Visualization</div></div>
    </div>
  </div>
  <span class="slide-num">04 / 12</span>
</div>

<!-- ═══════════════ SLIDE 5 — MARKET ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">Market</span> Opportunity</h2>
    <div class="subtitle">Massive, Growing, and Wide Open</div>

    <div class="grid g3 mb-20">
      <div class="card" style="text-align:center;padding:28px;">
        <div style="font-size:11px;color:var(--red);font-weight:700;letter-spacing:2px;margin-bottom:8px;">TAM</div>
        <div class="big-num" style="color:var(--white);">$8.2B</div>
        <p>India Personal Luxury<br>Goods Market (2026)</p>
      </div>
      <div class="card orange" style="text-align:center;padding:28px;">
        <div style="font-size:11px;color:#D4851F;font-weight:700;letter-spacing:2px;margin-bottom:8px;">SAM</div>
        <div class="big-num" style="color:var(--white);">$1.4B</div>
        <p>Premium Leather Goods<br>Online Addressable</p>
      </div>
      <div class="card gold" style="text-align:center;padding:28px;">
        <div style="font-size:11px;color:var(--gold);font-weight:700;letter-spacing:2px;margin-bottom:8px;">SOM</div>
        <div class="big-num" style="color:var(--white);">$12M</div>
        <p>Year 3 Target<br>DTC + AI Styling</p>
      </div>
    </div>

    <div class="grid g4">
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <span style="font-size:18px;">🚀</span>
        <div><div style="font-size:13px;font-weight:700;">Fastest Growing</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">India luxury at 12–15% CAGR</div></div>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <span style="font-size:18px;">🎯</span>
        <div><div style="font-size:13px;font-weight:700;">Underserved Gap</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">₹2K–₹30K: no Indian DTC player</div></div>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <span style="font-size:18px;">🌏</span>
        <div><div style="font-size:13px;font-weight:700;">Diaspora Play</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">US, UK, ME demand for Indian craft</div></div>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <span style="font-size:18px;">📱</span>
        <div><div style="font-size:13px;font-weight:700;">Digital Native</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">60%+ luxury discovery online</div></div>
      </div>
    </div>
  </div>
  <span class="slide-num">05 / 12</span>
</div>

<!-- ═══════════════ SLIDE 6 — BUSINESS MODEL ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">Business</span> Model</h2>
    <div class="subtitle">Two Revenue Engines — Products + AI Consultations</div>

    <div class="grid g2 mb-16">
      <div class="card">
        <h3 style="color:var(--red);margin-bottom:12px;">💼&nbsp; Primary — Product Sales</h3>
        <div class="kv"><span class="k">Price Range</span><span class="v">₹1,299 – ₹24,999</span></div>
        <div class="kv"><span class="k">Average Order</span><span class="v">₹8,999 (~$108)</span></div>
        <div class="kv"><span class="k">Gross Margin</span><span class="v green">60–70%</span></div>
        <div class="kv"><span class="k">Model</span><span class="v" style="color:var(--t2)">Made-to-order (low risk)</span></div>
        <div class="kv"><span class="k">Categories</span><span class="v" style="color:var(--t2)">Bags, Briefcases, Belts, Jackets</span></div>
        <div class="kv" style="border:none"><span class="k">Distribution</span><span class="v" style="color:var(--t2)">100% DTC — zero retail overhead</span></div>
      </div>
      <div class="card gold">
        <h3 style="color:var(--gold);margin-bottom:12px;">🧠&nbsp; Secondary — Tan Lerida™ Consultations</h3>
        <div class="kv"><span class="k">Price</span><span class="v">₹99 + GST per session</span></div>
        <div class="kv"><span class="k">Net Revenue</span><span class="v">~₹80/session</span></div>
        <div class="kv"><span class="k">Conversion</span><span class="v green">Est. 10–15% to purchase</span></div>
        <div class="kv"><span class="k">Purpose</span><span class="v" style="color:var(--t2)">Acquisition + engagement funnel</span></div>
        <div class="kv"><span class="k">Data Moat</span><span class="v" style="color:var(--t2)">Body profiles + style preferences</span></div>
        <div class="kv" style="border:none"><span class="k">Repeat</span><span class="v" style="color:var(--t2)">Unlimited sessions per user</span></div>
      </div>
    </div>

    <div class="funnel">
      <div class="step"><div class="val" style="color:var(--gold);">₹99</div><div class="lbl">Entry Price</div></div>
      <div class="arrow">→</div>
      <div class="step"><div class="val">₹8,999</div><div class="lbl">Avg. Order</div></div>
      <div class="arrow">→</div>
      <div class="step"><div class="val green">60–70%</div><div class="lbl">Gross Margin</div></div>
      <div class="arrow">→</div>
      <div class="step"><div class="val red" style="color:var(--red);">91×</div><div class="lbl">Upsell Multiplier</div></div>
    </div>
  </div>
  <span class="slide-num">06 / 12</span>
</div>

<!-- ═══════════════ SLIDE 7 — COMPETITION ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">Competitive</span> Landscape</h2>
    <div class="subtitle">No One Combines Craft + DTC + AI</div>

    <table class="mb-16">
      <thead><tr><th>Brand</th><th>Craft Quality</th><th>DTC / Online</th><th>AI Styling</th><th>Price Range</th></tr></thead>
      <tbody>
        <tr><td>Hidesign</td><td>Mass-produced</td><td>Retail-first</td><td class="xmark">✗ None</td><td>₹2K–₹15K</td></tr>
        <tr><td>Nappa Dori</td><td>Artisanal</td><td>Limited online</td><td class="xmark">✗ None</td><td>₹5K–₹30K</td></tr>
        <tr><td>Da Milano</td><td>Premium</td><td>Mall retail</td><td class="xmark">✗ None</td><td>₹5K–₹25K</td></tr>
        <tr><td>Coach / Fossil</td><td>Varies</td><td>No India DTC</td><td class="xmark">✗ None</td><td>₹15K–₹80K</td></tr>
        <tr class="hl"><td><strong>TANGRED</strong></td><td class="chk">Handcrafted ✓</td><td class="chk">100% DTC ✓</td><td class="chk">✓ Tan Lerida™</td><td>₹1.3K–₹25K</td></tr>
      </tbody>
    </table>

    <div class="callout">
      <h4>🏰&nbsp; Our Moat</h4>
      <p>Every Tan Lerida consultation captures body profiles, style preferences, and purchase intent — proprietary demand data that tells us exactly what to build next. This data flywheel compounds with every user.</p>
    </div>
  </div>
  <span class="slide-num">07 / 12</span>
</div>

<!-- ═══════════════ SLIDE 8 — TECHNOLOGY ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">Technology</span> & Product</h2>
    <div class="subtitle">Production-Ready Full-Stack Platform — Live Today</div>

    <div class="grid g4 mb-16">
      <div class="card">
        <h3 style="color:var(--red)">Frontend</h3>
        <p>▸ Next.js 16 + React 19<br>▸ TypeScript 5 + Tailwind 4<br>▸ Framer Motion<br>▸ Zustand State Mgmt</p>
      </div>
      <div class="card green">
        <h3 style="color:var(--green)">Backend & Data</h3>
        <p>▸ 25+ API Routes<br>▸ Prisma ORM + PostgreSQL<br>▸ NextAuth.js v5 (OAuth)<br>▸ Razorpay Payments</p>
      </div>
      <div class="card gold">
        <h3 style="color:var(--gold)">AI / ML Pipeline</h3>
        <p>▸ Gemini 1.5 Pro (Vision)<br>▸ Claude 3.5 (Recs)<br>▸ Pinecone Vector Search<br>▸ Replicate Image Gen</p>
      </div>
      <div class="card blue">
        <h3 style="color:var(--blue-light)">Infra & Ops</h3>
        <p>▸ Railway.app Deploy<br>▸ Docker Containers<br>▸ Cloudinary CDN<br>▸ Resend Email</p>
      </div>
    </div>

    <div class="stat-bar">
      <div class="stat"><div class="val">200+</div><div class="lbl">Files</div></div>
      <div class="stat"><div class="val">15,000+</div><div class="lbl">Lines of Code</div></div>
      <div class="stat"><div class="val">50+</div><div class="lbl">Components</div></div>
      <div class="stat"><div class="val">25+</div><div class="lbl">API Routes</div></div>
      <div class="stat"><div class="val">15+</div><div class="lbl">DB Models</div></div>
      <div class="stat"><div class="val green">v1.0</div><div class="lbl">Production Ready</div></div>
    </div>
  </div>
  <span class="slide-num">08 / 12</span>
</div>

<!-- ═══════════════ SLIDE 9 — TRACTION ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">Traction</span> & Milestones</h2>
    <div class="subtitle">Built, Shipped, and Ready to Scale</div>

    <div class="grid g4 mb-16">
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;color:var(--red);font-weight:700;">Q1 2026</span>
          <span class="badge">✓ DONE</span>
        </div>
        <h3 style="color:var(--white);font-size:14px;">Platform Built</h3>
        <p>Full-stack e-commerce + Tan Lerida AI pipeline — production ready and deployed.</p>
      </div>
      <div class="card gold">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;color:var(--gold);font-weight:700;">Q2 2026</span>
          <span class="badge planned">PLANNED</span>
        </div>
        <h3 style="color:var(--white);font-size:14px;">Arch Grant</h3>
        <p>Relocate to St. Louis, launch beta to early adopters and gather feedback.</p>
      </div>
      <div class="card green">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;color:var(--green);font-weight:700;">Q3 2026</span>
          <span class="badge planned">PLANNED</span>
        </div>
        <h3 style="color:var(--white);font-size:14px;">First Revenue</h3>
        <p>Onboard artisan partners, acquire first 100 paying customers.</p>
      </div>
      <div class="card blue">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;color:var(--blue-light);font-weight:700;">Q4 2026</span>
          <span class="badge planned">PLANNED</span>
        </div>
        <h3 style="color:var(--white);font-size:14px;">Scale</h3>
        <p>1,000+ users, expand catalog, begin mobile app development.</p>
      </div>
    </div>

    <div style="font-size:13px;color:var(--green-light);font-weight:700;margin-bottom:8px;">✅ Already Delivered</div>
    <div class="delivered">
      <span>Full e-commerce: catalog, cart, checkout, orders, wishlist</span>
      <span>Payments: Razorpay integration (products + consultations)</span>
      <span>Tan Lerida AI: vision analysis, recommendations, visualization</span>
      <span>Database: 15+ PostgreSQL models with Prisma ORM</span>
      <span>Auth: Email + Google OAuth with email verification</span>
      <span>Deployed: Railway.app with Docker containerization</span>
    </div>
  </div>
  <span class="slide-num">09 / 12</span>
</div>

<!-- ═══════════════ SLIDE 10 — WHY STL ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">Why</span> St. Louis</h2>
    <div class="subtitle">Tangred's U.S. Headquarters — Committed to the STL Ecosystem</div>

    <div class="grid g3 mb-20">
      <div class="card">
        <div class="icon">🏢</div>
        <h3 style="color:var(--red)">Gateway to the U.S.</h3>
        <p>St. Louis is the ideal launchpad. Lower cost of living means our $75K grant stretches further. Central location for nationwide shipping and logistics.</p>
      </div>
      <div class="card gold">
        <div class="icon">🤝</div>
        <h3 style="color:var(--gold)">Ecosystem Fit</h3>
        <p>Arch Grant mentors, Cortex innovation district, and Wash U connections provide exactly the support an international founder needs to establish U.S. operations.</p>
      </div>
      <div class="card green">
        <div class="icon">🌍</div>
        <h3 style="color:var(--green)">Diaspora Bridge</h3>
        <p>Growing South Asian community and strong global ties make St. Louis ideal for bridging Indian craftsmanship to American consumers — the cultural crossroads.</p>
      </div>
    </div>

    <div class="commit">
      <span>✓&nbsp; Full-time founder relocation for 12+ months</span>
      <span>✓&nbsp; Hire local talent for operations & marketing</span>
      <span>✓&nbsp; Engage STL artisan community for U.S. production</span>
      <span>✓&nbsp; Contribute actively to Arch Grant alumni network</span>
    </div>
  </div>
  <span class="slide-num">10 / 12</span>
</div>

<!-- ═══════════════ SLIDE 11 — THE ASK ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner">
    <h2><span class="accent">The</span> Ask</h2>
    <div class="subtitle">$75,000 Equity-Free Grant — Here's How We'll Use It</div>

    <div class="grid g4 mb-16">
      <div class="card" style="text-align:center;">
        <div class="big-num" style="color:var(--red);">40%</div>
        <div class="mid-num">$30,000</div>
        <h3 style="color:var(--red);margin-top:4px;">Product & Inventory</h3>
        <p>Scale artisan production, source premium leather, build initial U.S. inventory.</p>
      </div>
      <div class="card gold" style="text-align:center;">
        <div class="big-num" style="color:var(--gold);">25%</div>
        <div class="mid-num">$18,750</div>
        <h3 style="color:var(--gold);margin-top:4px;">Technology & AI</h3>
        <p>Cloud infra, AI API costs, mobile app dev, vector DB scaling.</p>
      </div>
      <div class="card green" style="text-align:center;">
        <div class="big-num" style="color:var(--green);">20%</div>
        <div class="mid-num">$15,000</div>
        <h3 style="color:var(--green);margin-top:4px;">Marketing & Growth</h3>
        <p>Digital marketing, influencer partnerships, SEO for U.S. entry.</p>
      </div>
      <div class="card blue" style="text-align:center;">
        <div class="big-num" style="color:var(--blue-light);">15%</div>
        <div class="mid-num">$11,250</div>
        <h3 style="color:var(--blue-light);margin-top:4px;">Operations & Legal</h3>
        <p>U.S. entity, compliance, STL office, shipping logistics.</p>
      </div>
    </div>

    <div style="font-size:10px;color:var(--t3);text-align:center;letter-spacing:2px;font-weight:600;margin-bottom:6px;">12-MONTH TARGETS</div>
    <div class="stat-bar">
      <div class="stat"><div class="val">1,000+</div><div class="lbl">Active Users</div></div>
      <div class="stat"><div class="val green">$150K+</div><div class="lbl">Revenue</div></div>
      <div class="stat"><div class="val">3–5</div><div class="lbl">Jobs Created in STL</div></div>
      <div class="stat"><div class="val gold">50+</div><div class="lbl">Artisan Partners</div></div>
    </div>
  </div>
  <span class="slide-num">11 / 12</span>
</div>

<!-- ═══════════════ SLIDE 12 — CLOSING ═══════════════ -->
<div class="slide">
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="slide-inner" style="justify-content:center;align-items:center;text-align:center;">
    <div class="brand" style="font-size:80px;margin-bottom:8px;">TANGRED</div>
    <div class="gold-line" style="margin:12px auto 16px;"></div>
    <div style="font-family:'Playfair Display',serif;font-size:22px;color:var(--gold);font-weight:400;margin-bottom:24px;">
      Crafted for Those Who Command Respect
    </div>
    <div style="font-size:14px;color:var(--t2);margin-bottom:6px;">
      Premium Indian Leather &nbsp;·&nbsp; AI-Powered Styling &nbsp;·&nbsp; Direct to Consumer
    </div>
    <div style="font-size:14px;color:var(--t2);margin-bottom:32px;">
      Production-Ready Platform &nbsp;·&nbsp; Proven Technology &nbsp;·&nbsp; Ready to Scale from St. Louis
    </div>
    <div class="contact">
      <h3>Let's Build Together</h3>
      <div class="name">Jayti Pargal &nbsp;·&nbsp; Founder & CEO</div>
      <div class="info">vivek@go4garage.in</div>
    </div>
    <div style="margin-top:28px;font-size:12px;color:var(--t4);">
      Thank you for your time and consideration. &nbsp;·&nbsp; Arch Grant 2026
    </div>
  </div>
  <span class="slide-num">12 / 12</span>
</div>

</body>
</html>"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(HTML)
print(f"  ✓ HTML written: {{HTML_PATH}}")

# ── Render to PDF ──────────────────────────────────
print("\\n📄 Rendering PDF via Playwright Chromium...")

from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={{"width": 1280, "height": 720}})
    page.goto(f"file:///{{str(HTML_PATH).replace(chr(92), '/')}}")
    page.wait_for_load_state("networkidle")

    page.pdf(
        path=str(PDF_PATH),
        width="1280px",
        height="720px",
        print_background=True,
        margin={{"top": "0", "right": "0", "bottom": "0", "left": "0"}},
    )
    browser.close()

size_kb = PDF_PATH.stat().st_size / 1024
print(f"  ✓ PDF saved: {{PDF_PATH}} ({{size_kb:.0f}} KB)")
print("\\n🎉 Beautiful AI smart-template deck complete!")
