"""
Claude Opus 4 vision-based diagnostic engine.
Primary inference path for all AquaAI image analysis — disease, seed count, quality.
Uses claude-opus-4-7 vision with forced-tool structured output.

Falls back to None when ANTHROPIC_API_KEY is absent or the call fails,
so each service can use its local sklearn/OpenCV model offline.
"""
import os
import io
import base64
import logging
from typing import Optional

logger = logging.getLogger(__name__)

OPUS_MODEL = "claude-opus-4-7"


# ── Client + image encoding ─────────────────────────────────────────────────

def is_available() -> bool:
    """True when an Anthropic API key is configured."""
    return bool(os.environ.get("ANTHROPIC_API_KEY", ""))


def _get_client():
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        return None
    try:
        import anthropic
        return anthropic.Anthropic(api_key=key)
    except ImportError:
        return None


def _encode_image(image_bytes: bytes) -> Optional[dict]:
    """
    Encode image bytes to a Claude vision content block.
    Normalises to JPEG ≤1568px (Opus vision optimal) to control token cost.
    """
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        # Downscale large images — Opus vision caps useful resolution ~1568px
        max_dim = 1024
        if max(img.size) > max_dim:
            scale = max_dim / max(img.size)
            img = img.resize((int(img.width * scale), int(img.height * scale)),
                             Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=88)
        b64 = base64.standard_b64encode(buf.getvalue()).decode("utf-8")
        return {
            "type": "image",
            "source": {"type": "base64", "media_type": "image/jpeg", "data": b64},
        }
    except Exception as e:
        logger.warning(f"Image encode failed: {e}")
        return None


def _run_vision_tool(image_blocks: list, prompt: str, tool: dict) -> Optional[dict]:
    """
    Run a single Opus vision call with a forced tool to guarantee structured output.
    Returns the tool input dict, or None on any failure.
    """
    client = _get_client()
    if client is None:
        return None
    try:
        content = list(image_blocks) + [{"type": "text", "text": prompt}]
        response = client.messages.create(
            model=OPUS_MODEL,
            max_tokens=1500,
            tools=[tool],
            tool_choice={"type": "tool", "name": tool["name"]},
            messages=[{"role": "user", "content": content}],
        )
        for block in response.content:
            if getattr(block, "type", None) == "tool_use":
                return dict(block.input)
        return None
    except Exception as e:
        logger.warning(f"Opus vision call failed ({tool['name']}): {e}")
        return None


# ── Tool schemas ─────────────────────────────────────────────────────────────

_EHP_TOOL = {
    "name": "report_ehp_diagnosis",
    "description": "Report EHP (Enterocytozoon hepatopenaei) diagnosis from an HP smear image.",
    "input_schema": {
        "type": "object",
        "properties": {
            "ehp_healthy_prob":   {"type": "number", "description": "Probability tissue is healthy (0-1)"},
            "ehp_suspected_prob": {"type": "number", "description": "Probability of suspected EHP (0-1)"},
            "ehp_positive_prob":  {"type": "number", "description": "Probability of confirmed EHP infection (0-1)"},
            "spore_count_estimate": {"type": "integer", "description": "Estimated visible EHP spore granules"},
            "image_quality": {"type": "string", "enum": ["good", "fair", "poor"]},
            "reasoning": {"type": "string", "description": "Brief visual reasoning (1-2 sentences)"},
        },
        "required": ["ehp_healthy_prob", "ehp_suspected_prob", "ehp_positive_prob",
                     "spore_count_estimate", "reasoning"],
    },
}

_SEED_TOOL = {
    "name": "report_seed_count",
    "description": "Report shrimp post-larvae (PL) count from a counting-tray image.",
    "input_schema": {
        "type": "object",
        "properties": {
            "live":   {"type": "integer", "description": "Count of live PL (translucent, elongated, curved)"},
            "dead":   {"type": "integer", "description": "Count of dead PL (opaque/white, rigid, straight)"},
            "debris": {"type": "integer", "description": "Count of debris / non-PL objects"},
            "mean_length_mm": {"type": "number", "description": "Estimated mean PL body length in mm"},
            "size_uniformity": {"type": "string", "enum": ["uniform", "moderate", "variable"]},
            "reasoning": {"type": "string", "description": "Brief visual reasoning (1-2 sentences)"},
        },
        "required": ["live", "dead", "debris", "mean_length_mm", "reasoning"],
    },
}

_QUALITY_TOOL = {
    "name": "report_quality_assessment",
    "description": "Report shrimp PL quality assessment from a microscopy image.",
    "input_schema": {
        "type": "object",
        "properties": {
            "body_colour_score":   {"type": "number", "description": "Body colour quality 0-7"},
            "gut_visibility_score":{"type": "number", "description": "Gut fullness/visibility 0-5"},
            "tail_muscle_score":   {"type": "number", "description": "Tail muscle development 0-6"},
            "appendage_score":     {"type": "number", "description": "Appendage completeness 0-4"},
            "posture_score":       {"type": "number", "description": "Body posture/shape 0-4"},
            "activity_score_visual":{"type": "number", "description": "Apparent vigour 0-4"},
            "detected_pl_stage":   {"type": "string", "enum": ["PL5", "PL8", "PL10", "PL12", "PL15+"]},
            "stage_confidence":    {"type": "number", "description": "Stage confidence 0-1"},
            "reasoning": {"type": "string", "description": "Brief visual reasoning (1-2 sentences)"},
        },
        "required": ["body_colour_score", "gut_visibility_score", "tail_muscle_score",
                     "appendage_score", "posture_score", "activity_score_visual",
                     "detected_pl_stage", "stage_confidence", "reasoning"],
    },
}

_MULTI_DISEASE_TOOL = {
    "name": "report_disease_screen",
    "description": "Multi-disease screening of a shrimp image.",
    "input_schema": {
        "type": "object",
        "properties": {
            "wssv_prob":       {"type": "number", "description": "White Spot Syndrome Virus probability 0-1"},
            "ahpnd_prob":      {"type": "number", "description": "Acute Hepatopancreatic Necrosis Disease probability 0-1"},
            "bgd_prob":        {"type": "number", "description": "Black Gill Disease probability 0-1"},
            "hpv_prob":        {"type": "number", "description": "Hepatopancreatic Parvovirus probability 0-1"},
            "gregarines_prob": {"type": "number", "description": "Gregarine parasite probability 0-1"},
            "wfs_prob":        {"type": "number", "description": "White Feces Syndrome probability 0-1"},
            "reasoning": {"type": "string", "description": "Brief visual reasoning (1-2 sentences)"},
        },
        "required": ["wssv_prob", "ahpnd_prob", "bgd_prob", "hpv_prob",
                     "gregarines_prob", "wfs_prob", "reasoning"],
    },
}


# ── Public analysis API ──────────────────────────────────────────────────────

def analyze_ehp_disease(image_bytes_list: list) -> Optional[dict]:
    """
    EHP primary diagnosis via Claude Opus vision.
    Accepts up to 3 frames for multi-frame context.
    """
    if not is_available():
        return None
    blocks = []
    for ib in image_bytes_list[:3]:
        blk = _encode_image(ib)
        if blk:
            blocks.append(blk)
    if not blocks:
        return None

    prompt = (
        "These are hepatopancreas (HP) smear microscopy images of shrimp post-larvae. "
        "Assess for EHP (Enterocytozoon hepatopenaei) infection. EHP presents as small dark "
        "spore granules (1-3 microns) clustered within HP tubule epithelial cells, often with "
        "tissue degradation and abnormal staining. Healthy HP shows intact tubules, clear lumens "
        "and uniform staining. Consider all frames together for a consensus assessment. "
        "Report calibrated probabilities that sum to ~1.0 across healthy/suspected/positive."
    )
    result = _run_vision_tool(blocks, prompt, _EHP_TOOL)
    if result is None:
        return None

    h = float(result.get("ehp_healthy_prob", 0.0))
    s = float(result.get("ehp_suspected_prob", 0.0))
    p = float(result.get("ehp_positive_prob", 0.0))
    total = h + s + p or 1.0
    return {
        "ehp_healthy_prob":   round(h / total, 4),
        "ehp_suspected_prob": round(s / total, 4),
        "ehp_positive_prob":  round(p / total, 4),
        "ehp_prob":           round(p / total, 4),
        "spore_count_estimate": int(result.get("spore_count_estimate", 0)),
        "reasoning":          result.get("reasoning", ""),
        "model_used":         OPUS_MODEL,
    }


def analyze_seed_count(image_bytes: bytes) -> Optional[dict]:
    """Seed/PL count via Claude Opus vision."""
    if not is_available():
        return None
    blk = _encode_image(image_bytes)
    if blk is None:
        return None

    prompt = (
        "This is a microscopy/tray image of shrimp post-larvae (PL) for counting. "
        "Count live PL (translucent, elongated, gently curved bodies with visible appendages), "
        "dead PL (opaque or whitish, rigid, often straight or fragmented), and debris "
        "(non-PL particles, moult shells, organic matter). Estimate mean body length in mm "
        "(typical range PL5≈4mm to PL15≈12mm). Be precise — count every distinct organism."
    )
    result = _run_vision_tool([blk], prompt, _SEED_TOOL)
    if result is None:
        return None

    live = max(0, int(result.get("live", 0)))
    dead = max(0, int(result.get("dead", 0)))
    debris = max(0, int(result.get("debris", 0)))
    mean_mm = float(result.get("mean_length_mm", 10.0))
    uniformity = result.get("size_uniformity", "moderate")
    std_mm = {"uniform": 0.6, "moderate": 1.4, "variable": 2.6}.get(uniformity, 1.4)

    return {
        "live": live, "dead": dead, "debris": debris,
        "mean_length_mm": round(mean_mm, 2),
        "std_length_mm": round(std_mm, 2),
        "cv_pct": round((std_mm / (mean_mm + 1e-9)) * 100, 2),
        "bounding_boxes": [],
        "_lengths": [],
        "detection_method": "claude_opus_vision",
        "reasoning": result.get("reasoning", ""),
        "model_used": OPUS_MODEL,
    }


def analyze_quality(image_bytes_list: list) -> Optional[dict]:
    """PL quality + stage assessment via Claude Opus vision."""
    if not is_available():
        return None
    blocks = []
    for ib in image_bytes_list[:3]:
        blk = _encode_image(ib)
        if blk:
            blocks.append(blk)
    if not blocks:
        return None

    prompt = (
        "These are microscopy images of shrimp post-larvae (PL) for quality grading. "
        "Score each visual health component on its scale: body colour (0-7, healthy = "
        "translucent grey-brown, even pigment), gut visibility (0-5, full dark gut line = good), "
        "tail muscle (0-6, opaque well-developed muscle = good), appendages (0-4, all intact), "
        "posture (0-4, naturally curved active stance), activity/vigour (0-4). "
        "Also identify the PL developmental stage (PL5/PL8/PL10/PL12/PL15+) from body size, "
        "rostral spine count and appendage development."
    )
    result = _run_vision_tool(blocks, prompt, _QUALITY_TOOL)
    if result is None:
        return None

    comps = {
        "body_colour_score":     min(7.0, max(0.0, float(result.get("body_colour_score", 0)))),
        "gut_visibility_score":  min(5.0, max(0.0, float(result.get("gut_visibility_score", 0)))),
        "tail_muscle_score":     min(6.0, max(0.0, float(result.get("tail_muscle_score", 0)))),
        "appendage_score":       min(4.0, max(0.0, float(result.get("appendage_score", 0)))),
        "posture_score":         min(4.0, max(0.0, float(result.get("posture_score", 0)))),
        "activity_score_visual": min(4.0, max(0.0, float(result.get("activity_score_visual", 0)))),
    }
    return {
        **{k: round(v, 2) for k, v in comps.items()},
        "visual_health_score": round(min(sum(comps.values()), 30.0), 2),
        "detected_pl_stage":   result.get("detected_pl_stage", "PL10"),
        "stage_confidence":    round(float(result.get("stage_confidence", 0.8)), 4),
        "reasoning":           result.get("reasoning", ""),
        "model_used":          OPUS_MODEL,
    }


def analyze_multi_disease(image_bytes: bytes) -> Optional[dict]:
    """6-disease screening via Claude Opus vision."""
    if not is_available():
        return None
    blk = _encode_image(image_bytes)
    if blk is None:
        return None

    prompt = (
        "Screen this shrimp post-larvae image for the following diseases and report a "
        "probability (0-1) for each:\n"
        "- WSSV (White Spot Syndrome Virus): whitish 0.5-2mm spots embedded in carapace/cuticle.\n"
        "- AHPND/EMS: pale, atrophied or empty hepatopancreas; sloughed HP tubule cells.\n"
        "- BGD (Black Gill Disease): darkened/melanised gill filaments.\n"
        "- HPV (Hepatopancreatic Parvovirus): intranuclear inclusion bodies, stunted growth.\n"
        "- Gregarines: elongated parasites in the gut tract.\n"
        "- WFS (White Feces Syndrome): white/yellow gut strands, white faecal matter.\n"
        "Report low probabilities (<0.1) when no clear signs are visible."
    )
    result = _run_vision_tool([blk], prompt, _MULTI_DISEASE_TOOL)
    if result is None:
        return None

    def _p(k):
        return round(min(1.0, max(0.0, float(result.get(k, 0.0)))), 4)

    wssv = _p("wssv_prob")
    return {
        "wssv_positive":   wssv > 0.5,
        "wssv_confidence": wssv,
        "ahpnd_prob":      _p("ahpnd_prob"),
        "bgd_prob":        _p("bgd_prob"),
        "hpv_prob":        _p("hpv_prob"),
        "gregarines_prob": _p("gregarines_prob"),
        "wfs_prob":        _p("wfs_prob"),
        "reasoning":       result.get("reasoning", ""),
        "model_used":      OPUS_MODEL,
    }
