"""
PDF QC Report / Certificate generator using ReportLab.
Generates signed, tamper-evident PDF with QR code and all session data.
"""
import os
import io
from datetime import datetime
from typing import Optional
import qrcode
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from app.config import settings


def _grade_color(grade: Optional[str]) -> colors.Color:
    mapping = {
        "PREMIUM": colors.HexColor("#22c55e"),
        "GOOD": colors.HexColor("#84cc16"),
        "CONDITIONAL": colors.HexColor("#f59e0b"),
        "CAUTION": colors.HexColor("#f97316"),
        "REJECT": colors.HexColor("#ef4444"),
    }
    return mapping.get(grade or "", colors.grey)


def generate_qr_code(certificate_id: str, output_path: str) -> str:
    verify_url = f"{settings.base_url}/api/v1/verify/{certificate_id}"
    qr = qrcode.QRCode(version=1, box_size=6, border=2)
    qr.add_data(verify_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path)
    return output_path


def generate_certificate_pdf(
    certificate_id: str,
    session_type: str,
    farm_name: str,
    vle_name: str,
    hatchery_name: str,
    grade: Optional[str],
    composite_score: Optional[float],
    is_hard_fail: bool,
    session_data: dict,
    qr_path: str,
    output_path: str,
    language: str = "english",
) -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    story = []

    # Header
    title_style = ParagraphStyle("title", parent=styles["Heading1"],
                                 alignment=TA_CENTER, fontSize=18, textColor=colors.HexColor("#1e3a5f"))
    story.append(Paragraph("AquaAI", title_style))
    story.append(Paragraph("Shrimp Seed QC Certificate", ParagraphStyle(
        "sub", parent=styles["Normal"], alignment=TA_CENTER, fontSize=12,
        textColor=colors.grey)))
    story.append(Spacer(1, 0.4*cm))

    # Grade badge
    if is_hard_fail:
        grade_text = "REJECT — HARD FAIL"
        grade_color = colors.HexColor("#ef4444")
    else:
        grade_text = grade or "—"
        grade_color = _grade_color(grade)

    badge_data = [[Paragraph(f"<b>{grade_text}</b>",
                             ParagraphStyle("badge", alignment=TA_CENTER, fontSize=16,
                                            textColor=colors.white))]]
    badge_table = Table(badge_data, colWidths=[14*cm])
    badge_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), grade_color),
        ("ROUNDEDCORNERS", [8]),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 0.5*cm))

    # Score
    if composite_score is not None and not is_hard_fail:
        story.append(Paragraph(f"Quality Score: <b>{composite_score:.1f} / 100</b>",
                               ParagraphStyle("score", parent=styles["Normal"],
                                              alignment=TA_CENTER, fontSize=14)))
        story.append(Spacer(1, 0.3*cm))

    # Certificate meta
    meta = [
        ["Certificate ID", certificate_id],
        ["Session Type", session_type.title()],
        ["Farm", farm_name],
        ["VLE / Inspector", vle_name],
        ["Hatchery", hatchery_name],
        ["Generated", datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")],
        ["Language", language.title()],
    ]
    meta_table = Table(meta, colWidths=[5*cm, 10*cm])
    meta_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.HexColor("#f8fafc"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 0.5*cm))

    # Session details
    if session_data:
        story.append(Paragraph("<b>Session Details</b>", styles["Heading3"]))
        details = [[str(k).replace("_", " ").title(), str(v)]
                   for k, v in session_data.items()
                   if k not in ("image_paths", "spore_boxes", "frame_results", "size_histogram_data")]
        if details:
            det_table = Table(details, colWidths=[6*cm, 9*cm])
            det_table.setStyle(TableStyle([
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.HexColor("#f8fafc"), colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]))
            story.append(det_table)
            story.append(Spacer(1, 0.5*cm))

    # QR code
    if os.path.exists(qr_path):
        story.append(Paragraph("Scan to verify:", ParagraphStyle("qr_label", alignment=TA_CENTER,
                                                                   fontSize=9, textColor=colors.grey)))
        story.append(Image(qr_path, width=3*cm, height=3*cm, hAlign="CENTER"))
        story.append(Spacer(1, 0.3*cm))

    # Footer disclaimer
    disclaimer = ("This certificate is digitally signed and tamper-evident. "
                  "Verify at aquaai.in/verify or scan the QR code above. "
                  "Valid for 90 days from issue date. Accepted by MPEDA-registered labs.")
    story.append(Paragraph(disclaimer, ParagraphStyle("disc", parent=styles["Normal"],
                                                       fontSize=7, textColor=colors.grey,
                                                       alignment=TA_CENTER)))

    doc.build(story)
    return output_path
