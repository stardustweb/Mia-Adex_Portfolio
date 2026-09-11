#!/usr/bin/env python3
"""
Generates an ATS-friendly, single-column resume PDF for Mia Adex.
- Standard base14 font (Helvetica) -> guaranteed real, selectable text layer.
- No tables, columns, text boxes, icons or images -> parses cleanly in ATS.
- Clear, conventional section headings recruiters' systems look for.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

INK        = HexColor("#1A1A1A")
MUTED      = HexColor("#4B4B4B")
ACCENT     = HexColor("#5B4B8A")   # printable dark violet, echoes the site's lavender accent
RULE_COLOR = HexColor("#D8D5CE")

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=25, leading=28, textColor=INK, spaceAfter=2, alignment=TA_LEFT,
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"], fontName="Helvetica",
    fontSize=12.5, leading=16, textColor=ACCENT, spaceAfter=6,
)
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=13, textColor=MUTED, spaceAfter=0,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=10.5, leading=13, textColor=INK, spaceBefore=10, spaceAfter=4,
    letterSpacing=1.1,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.7, leading=13.5, textColor=INK, spaceAfter=3,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.7, leading=13, textColor=INK,
)
bullet_bold_lead_style = ParagraphStyle(
    "BulletBoldLead", parent=bullet_style,
)
job_title_style = ParagraphStyle(
    "JobTitle", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=10, leading=13, textColor=INK, spaceBefore=4, spaceAfter=1,
)
job_meta_style = ParagraphStyle(
    "JobMeta", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=9, leading=12, textColor=MUTED, spaceAfter=2,
)

def rule():
    return HRFlowable(width="100%", thickness=0.75, color=RULE_COLOR, spaceBefore=3, spaceAfter=6)

def section(title):
    return Paragraph(title.upper(), section_style)

def bullets(items, style=bullet_style):
    return ListFlowable(
        [ListItem(Paragraph(i, style), spaceBefore=2, bulletColor=INK) for i in items],
        bulletType="bullet", start="•", leftIndent=14, bulletFontSize=8,
    )

doc = SimpleDocTemplate(
    "/home/claude/mia-adex-cv/mia-adex-cv.pdf",
    pagesize=A4,
    topMargin=15 * mm, bottomMargin=14 * mm,
    leftMargin=20 * mm, rightMargin=20 * mm,
    title="Mia Adex — CV",
    author="Mia Adex",
    subject="AI UGC & Video Ads Creator — Resume",
)

story = []

# ---------- Header ----------
story.append(Paragraph("MIA ADEX", name_style))
story.append(Paragraph("AI UGC &amp; Video Ads Creator", role_style))
story.append(Paragraph(
    "Lagos, Nigeria &nbsp;|&nbsp; miaadex108@gmail.com &nbsp;|&nbsp; "
    "+234 907 131 9328 &nbsp;|&nbsp; linkedin.com/in/mia-adex-993610430 &nbsp;|&nbsp; "
    "Available for Remote Projects",
    contact_style
))
story.append(rule())

# ---------- Professional Summary ----------
story.append(section("Professional Summary"))
story.append(Paragraph(
    "AI UGC &amp; Video Ads Creator based in Lagos, Nigeria, specializing in realistic, "
    "social-first video advertising for brands. Skilled at combining AI-generated visuals, "
    "storytelling and short-form platform strategy to turn products into scroll-stopping "
    "content across TikTok, Instagram Reels and Facebook. Comfortable working directly with "
    "clients end-to-end, from concept and script through to a finished, publish-ready video.",
    body_style
))

# ---------- Core Skills ----------
story.append(section("Core Skills"))
story.append(bullets([
    "AI UGC Video Ads &amp; AI Spokesperson Videos",
    "AI Product Advertisements &amp; Product Demonstration Videos",
    "Unboxing Videos &amp; Lifestyle Advertisements",
    "TikTok / Instagram Reels &amp; Short-Form Promotional Video",
    "Cinematic Product Commercials",
    "Video Ad Concepts, Scripts &amp; Hooks",
    "Social-First Storytelling &amp; Content Strategy",
    "Client Communication &amp; Brief Interpretation",
]))

# ---------- Portfolio Highlights ----------
story.append(section("Portfolio Highlights"))
story.append(Paragraph(
    "Selected AI UGC and product-ad concepts produced as part of an ongoing personal "
    "portfolio of social-first video advertising work:", body_style
))
projects = [
    ("Product Story", "AI UGC concept project built around a clear, product-first hook."),
    ("Everyday Ritual", "AI UGC product ad set inside a natural, everyday routine."),
    ("A Better Routine", "Lifestyle concept project placing a product inside an aspirational moment."),
    ("Open Air", "Cinematic concept project with elevated lighting and composition."),
    ("Modern Beauty", "AI UGC product ad for a beauty / skincare-style product."),
]
for title, desc in projects:
    story.append(Paragraph(f"<b>{title}</b> — {desc}", bullet_style))
    story.append(Spacer(1, 1))
story.append(Paragraph("Full video portfolio available on request or via portfolio website.", job_meta_style))

# ---------- Experience ----------
story.append(section("Experience"))
story.append(Paragraph("Independent AI UGC &amp; Video Ads Creator", job_title_style))
story.append(Paragraph("Freelance / Remote — Lagos, Nigeria", job_meta_style))
story.append(bullets([
    "Plan, script and produce short-form AI UGC and product-ad videos for social platforms.",
    "Work directly with clients to translate a product brief into a visual hook, narrative and finished cut.",
    "Build varied creative across UGC, product demo, lifestyle, unboxing and spokesperson formats to match different brand needs.",
]))

# ---------- Education ----------
story.append(section("Education"))
story.append(Paragraph("<b>Bachelor's Degree — Mass Communication</b>", job_title_style))
story.append(Paragraph("Olabisi Onabanjo University (OOU), Nigeria", job_meta_style))

# ---------- Additional Information ----------
story.append(section("Additional Information"))
story.append(bullets([
    "Location: Lagos, Nigeria",
    "Availability: Open to remote projects, worldwide clients",
    "Languages: English",
]))

doc.build(story)
print("PDF generated.")
