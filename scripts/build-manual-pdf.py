from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
    PageBreak,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

root = Path(__file__).resolve().parents[1]
manual_dir = root / "docs" / "manual"
screens_dir = manual_dir / "screens"
pdf_path = manual_dir / "Manual_VenBraX_Denise.pdf"

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleLight",
        parent=styles["Title"],
        textColor=colors.HexColor("#0E1116"),
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyLight",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1d2733"),
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionLight",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=colors.HexColor("#2E5E8C"),
        spaceBefore=8,
        spaceAfter=6,
    )
)

story = []

story.append(Paragraph("Manual VenBraX Denise", styles["TitleLight"]))
story.append(Paragraph("Guía simple, clara y en español venezolano para usar la app sin ayuda técnica.", styles["BodyLight"]))
story.append(Spacer(1, 8 * mm))

sections = [
    ("1. Bienvenida", "Toca <b>Comenzar</b> para activar tu cuenta.", "welcome.png"),
    ("2. Tus datos", "Escribe tu nombre, correo y teléfono.", "profile.png"),
    ("3. Tu clave", "Crea una contraseña y repítela para confirmar.", "credentials.png"),
    ("4. Huella o FaceID", "Activa tu huella o FaceID si tu teléfono lo permite.", "biometric.png"),
    ("5. Panel principal", "Mira el estado general, las métricas del día y las últimas actividades.", "dashboard.png"),
    ("6. Asistente", "Toca el botón de chat para pedir ayuda en español sencillo.", "assistant.png"),
]

for title, text, image_name in sections:
    story.append(Paragraph(title, styles["SectionLight"]))
    story.append(Paragraph(text, styles["BodyLight"]))
    img_path = screens_dir / image_name
    if img_path.exists():
      story.append(Image(str(img_path), width=170 * mm, height=96 * mm))
    story.append(Spacer(1, 5 * mm))

story.append(PageBreak())
story.append(Paragraph("¿Qué hago si algo no funciona?", styles["SectionLight"]))
story.append(Paragraph("- Si ves una falla, espera un momento.", styles["BodyLight"]))
story.append(Paragraph("- Si la app dice que se está recuperando sola, no hagas nada.", styles["BodyLight"]))
story.append(Paragraph("- Si te pide una acción, toca exactamente el botón que te indique.", styles["BodyLight"]))

doc = SimpleDocTemplate(
    str(pdf_path),
    pagesize=A4,
    leftMargin=16 * mm,
    rightMargin=16 * mm,
    topMargin=16 * mm,
    bottomMargin=16 * mm,
)

doc.build(story)
print(f"PDF generated at {pdf_path}")
