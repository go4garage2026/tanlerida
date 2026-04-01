"""Render the Beautiful AI HTML deck to PDF via Playwright."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
HTML_PATH = ROOT / "pitch_video" / "Tangred_Arch_Grant_2026_BeautifulAI.html"
PDF_PATH  = ROOT / "pitch_video" / "Tangred_Arch_Grant_2026_BeautifulAI.pdf"

print("📄 Rendering PDF via Playwright Chromium...")

file_url = "file:///" + str(HTML_PATH).replace("\\", "/")

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 720})
    page.goto(file_url)
    page.wait_for_load_state("networkidle")

    page.pdf(
        path=str(PDF_PATH),
        width="1280px",
        height="720px",
        print_background=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
    )
    browser.close()

size_kb = PDF_PATH.stat().st_size / 1024
print(f"  ✓ PDF saved: {PDF_PATH} ({size_kb:.0f} KB)")
print("🎉 Done!")
