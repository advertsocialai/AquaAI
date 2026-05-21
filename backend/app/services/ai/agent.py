"""
AquaAI Diagnostic Agent — tool-use agentic loop with Claude Opus 4.
Falls back to a rule-based engine when ANTHROPIC_API_KEY is not configured.
"""
import json
import os
import logging
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)

from app.services.ai.disease_detector import (
    run_ehp_classification, run_spore_detection,
    run_multi_disease_screening, determine_risk_level,
    determine_hard_fail, compute_multi_signal_fusion,
)
from app.services.ai.seed_counter import run_seed_counter_inference
from app.services.ai.quality_grader import (
    run_visual_health_assessment, run_stage_identification,
    run_activity_assessment, compute_composite_score,
    get_stocking_recommendation, compute_disease_score,
    compute_size_uniformity_score,
)

SYSTEM_PROMPT = """You are AquaAI, an expert AI diagnostician for shrimp seed (post-larvae) farming.
You assist farmers, VLEs (Village-Level Entrepreneurs), and hatchery managers in:
- Counting shrimp seeds (PL stages) accurately
- Detecting diseases: EHP, WSSV, AHPND, BGD, HPV, Gregarines, WFS
- Grading seed quality (composite score 0-100)
- Identifying disease risk levels (green/yellow/red/hard-fail)
- Recommending stocking decisions and biosecurity actions

You have access to AI tools that run real inference on shrimp images. Always:
1. Use the appropriate tool when the farmer provides images or asks for analysis
2. Interpret results clearly in plain language (avoid jargon)
3. Give actionable recommendations with urgency level
4. Mention if results need PCR confirmation for hard-fail cases
5. Be concise but thorough — farmers need fast, clear answers in the field

Languages: respond in English by default; if the user writes in Telugu or Tamil, respond in that language.
"""

TOOLS = [
    {
        "name": "count_seeds",
        "description": "Count shrimp seeds (post-larvae) in microscopy images using YOLOv8. Returns live count, dead count, debris count, and extrapolated total.",
        "input_schema": {
            "type": "object",
            "properties": {
                "image_paths": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of image file paths to analyse"
                },
                "led_brightness": {
                    "type": "integer",
                    "description": "LED brightness level 1-5 (default 3)",
                    "default": 3
                }
            },
            "required": ["image_paths"]
        }
    },
    {
        "name": "detect_disease",
        "description": "Detect EHP disease and screen for WSSV, AHPND, BGD, HPV using EfficientNetB0 + YOLOv8. Returns risk level (green/yellow/red) and hard-fail status.",
        "input_schema": {
            "type": "object",
            "properties": {
                "image_paths": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of HP smear or body image paths"
                },
                "camera_mode": {
                    "type": "string",
                    "enum": ["software_mono", "hardware_mono", "colour"],
                    "description": "Camera capture mode"
                }
            },
            "required": ["image_paths"]
        }
    },
    {
        "name": "grade_quality",
        "description": "Grade shrimp seed quality using composite score (visual health 30%, disease 25%, size 20%, stage 15%, activity 10%). Returns grade A/B/C/D and stocking recommendation.",
        "input_schema": {
            "type": "object",
            "properties": {
                "image_paths": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of shrimp seed images"
                },
                "ordered_stage": {
                    "type": "string",
                    "description": "Expected PL stage (optional, e.g. 'PL10')"
                },
                "planned_density": {
                    "type": "number",
                    "description": "Planned stocking density per m² (optional)"
                }
            },
            "required": ["image_paths"]
        }
    },
    {
        "name": "get_farm_context",
        "description": "Retrieve a farm's recent disease diagnosis history and computed risk score (last 30 days).",
        "input_schema": {
            "type": "object",
            "properties": {
                "farm_id": {"type": "integer", "description": "Farm database ID"}
            },
            "required": ["farm_id"]
        }
    },
    {
        "name": "get_water_quality",
        "description": "Retrieve the latest water quality readings for a farm (temperature, salinity, pH, DO, ammonia, nitrite) with safe-range checks.",
        "input_schema": {
            "type": "object",
            "properties": {
                "farm_id": {"type": "integer", "description": "Farm database ID"}
            },
            "required": ["farm_id"]
        }
    },
    {
        "name": "get_outbreak_alerts",
        "description": "Retrieve recent regional disease outbreak alerts near a farm's district.",
        "input_schema": {
            "type": "object",
            "properties": {
                "farm_id": {"type": "integer", "description": "Farm database ID"}
            },
            "required": ["farm_id"]
        }
    },
    {
        "name": "get_batch_info",
        "description": "Retrieve details of a seed batch — ordered PL stage, quantities, hatchery, stocking status, diagnosis count.",
        "input_schema": {
            "type": "object",
            "properties": {
                "batch_id": {"type": "integer", "description": "Batch database ID"}
            },
            "required": ["batch_id"]
        }
    },
    {
        "name": "interpret_results",
        "description": "Given disease probabilities and quality scores, produce a structured recommendation with urgency, action steps, and biosecurity advice.",
        "input_schema": {
            "type": "object",
            "properties": {
                "ehp_prob": {"type": "number", "description": "EHP positive probability 0-1"},
                "wssv_positive": {"type": "boolean", "description": "WSSV detected"},
                "composite_score": {"type": "number", "description": "Quality score 0-100"},
                "grade": {"type": "string", "description": "A/B/C/D grade"},
                "risk_level": {"type": "string", "description": "green/yellow/red/hard_fail"},
                "seed_count": {"type": "integer", "description": "Counted live seeds (optional)"}
            },
            "required": ["risk_level"]
        }
    }
]


def _execute_tool(tool_name: str, tool_input: dict, db_context: Optional[dict] = None) -> dict:
    """Execute a tool call and return its result."""
    try:
        if tool_name == "count_seeds":
            image_paths = tool_input.get("image_paths", [])
            led = tool_input.get("led_brightness", 3)
            result = run_seed_counter_inference(image_paths, led_brightness=led)
            return {
                "live_count": result.get("live_count", 0),
                "dead_count": result.get("dead_count", 0),
                "debris_count": result.get("debris_count", 0),
                "survival_rate_pct": result.get("survival_rate_pct", 0),
                "model_used": result.get("model_used", "stub"),
                "frames_analysed": result.get("frames_analysed", 0),
            }

        elif tool_name == "detect_disease":
            image_paths = tool_input.get("image_paths", [])
            camera_mode = tool_input.get("camera_mode", "software_mono")
            ehp = run_ehp_classification(image_paths, camera_mode)
            spore = run_spore_detection(image_paths, ehp["ehp_positive_prob"])
            multi = run_multi_disease_screening(image_paths)
            is_hard_fail, hard_fail_disease = determine_hard_fail(
                ehp["ehp_positive_prob"], multi["wssv_positive"]
            )
            risk_level, risk_action = determine_risk_level(
                ehp["ehp_positive_prob"], multi["wssv_positive"]
            )
            fusion = compute_multi_signal_fusion(
                ehp_prob=ehp["ehp_positive_prob"],
                spore_count=spore.get("spore_count", 0),
            )
            return {
                "ehp_positive_prob": round(ehp["ehp_positive_prob"], 3),
                "ehp_healthy_prob": round(ehp["ehp_healthy_prob"], 3),
                "spore_detected": spore["spore_detected"],
                "spore_count": spore["spore_count"],
                "spore_severity": spore["spore_severity"],
                "wssv_positive": multi["wssv_positive"],
                "wssv_confidence": round(multi["wssv_confidence"], 3),
                "ahpnd_prob": round(multi["ahpnd_prob"], 3),
                "is_hard_fail": is_hard_fail,
                "hard_fail_disease": hard_fail_disease,
                "risk_level": risk_level,
                "risk_action": risk_action,
                "fused_risk_score": round(fusion["fused_risk_score"], 3),
                "model_used": ehp.get("model_used", "stub"),
            }

        elif tool_name == "grade_quality":
            image_paths = tool_input.get("image_paths", [])
            ordered_stage = tool_input.get("ordered_stage")
            planned_density = tool_input.get("planned_density")
            visual = run_visual_health_assessment(image_paths)
            stage = run_stage_identification(image_paths, ordered_stage)
            activity = run_activity_assessment(image_paths)
            # Neutral disease score (no disease run here)
            size_cv = visual.get("size_cv_pct", 10.0)
            composite = compute_composite_score(
                visual_health=visual["visual_health_score"],
                disease=0.0,
                size_uniformity=max(0, 100 - size_cv * 4),
                stage=stage["stage_score"],
                activity=activity,
            )
            recommendation = get_stocking_recommendation(
                composite["composite_score"], composite["grade"], planned_density
            )
            return {
                "composite_score": round(composite["composite_score"], 1),
                "grade": composite["grade"],
                "visual_health_score": round(visual["visual_health_score"], 1),
                "dominant_stage": stage["dominant_stage"],
                "stage_score": round(stage["stage_score"], 1),
                "activity_score": round(activity, 1),
                "stocking_recommendation": recommendation["recommendation"],
                "density_advice": recommendation.get("density_advice"),
                "model_used": visual.get("model_used", "stub"),
            }

        elif tool_name == "get_farm_context":
            farm_id = tool_input.get("farm_id")
            if db_context and db_context.get("farm_history"):
                return db_context["farm_history"]
            return {
                "farm_id": farm_id,
                "note": "No farm history available — provide a farm_id in the chat request.",
                "recent_sessions": [],
                "risk_score": None,
            }

        elif tool_name == "get_water_quality":
            farm_id = tool_input.get("farm_id")
            if db_context and db_context.get("water_quality"):
                return db_context["water_quality"]
            return {"farm_id": farm_id, "available": False,
                    "note": "No water quality data — provide a farm_id in the chat request."}

        elif tool_name == "get_outbreak_alerts":
            farm_id = tool_input.get("farm_id")
            if db_context and db_context.get("outbreak_alerts"):
                return db_context["outbreak_alerts"]
            return {"farm_id": farm_id, "alert_count": 0, "alerts": [],
                    "note": "No outbreak data — provide a farm_id in the chat request."}

        elif tool_name == "get_batch_info":
            batch_id = tool_input.get("batch_id")
            if db_context and db_context.get("batch_info"):
                return db_context["batch_info"]
            return {"batch_id": batch_id,
                    "note": "No batch data — provide a batch_id in the chat request."}

        elif tool_name == "interpret_results":
            ehp_prob = tool_input.get("ehp_prob", 0.0)
            wssv = tool_input.get("wssv_positive", False)
            score = tool_input.get("composite_score", 0)
            grade = tool_input.get("grade", "C")
            risk = tool_input.get("risk_level", "green")
            seed_count = tool_input.get("seed_count")

            urgency = "LOW"
            actions = []
            biosecurity = []

            if risk == "hard_fail":
                urgency = "CRITICAL"
                actions = [
                    "Do NOT stock these seeds — immediate rejection required",
                    "Quarantine all seed batches from this source",
                    "Notify hatchery supplier and state fisheries department",
                    "Send samples for mandatory PCR confirmation",
                ]
                biosecurity = [
                    "Disinfect all equipment with 200 ppm chlorine",
                    "Do not share water or equipment with other ponds",
                    "Report to district VLE coordinator",
                ]
            elif risk == "red":
                urgency = "HIGH"
                actions = [
                    "Reject this batch — disease risk too high for stocking",
                    "Request PCR confirmation test (EHP/WSSV)",
                    "Negotiate replacement batch with hatchery",
                ]
                biosecurity = [
                    "Sanitise sampling equipment before reuse",
                    "Monitor adjacent ponds for symptoms",
                ]
            elif risk == "yellow":
                urgency = "MEDIUM"
                actions = [
                    "Conditional stocking — reduce planned density by 30%",
                    "Increase monitoring frequency to daily",
                    "Consider PCR test before final stocking decision",
                ]
                biosecurity = [
                    "Keep batch isolated during acclimation",
                    "Monitor feed consumption and behaviour closely for 7 days",
                ]
            else:  # green
                urgency = "LOW"
                actions = [
                    "Seeds appear healthy — safe to stock at planned density",
                    "Follow standard acclimation protocol (≥1 hr, ≤2°C Δ/10 min)",
                ]
                biosecurity = ["Continue routine biosecurity monitoring"]

            return {
                "urgency": urgency,
                "summary": f"Risk: {risk.upper()} | Grade: {grade} | Score: {score}/100",
                "action_steps": actions,
                "biosecurity_actions": biosecurity,
                "pcr_required": risk in ("hard_fail", "red"),
                "seed_count_note": f"Counted {seed_count} live seeds" if seed_count else None,
            }

        else:
            return {"error": f"Unknown tool: {tool_name}"}

    except Exception as e:
        return {"error": str(e), "tool": tool_name}


def _rule_based_response(messages: list, context: dict) -> str:
    """Fallback rule-based responses when no API key is set."""
    last_user = next(
        (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
    )
    lower = last_user.lower()

    # Disease keywords first — most specific (a question can mention "seeds" too)
    if any(w in lower for w in ["ehp", "disease", "sick", "wssv", "white spot",
                                 "ahpnd", "infection", "spore", "diagnos"]):
        return (
            "Disease detection requires HP (hepatopancreas) smear images. "
            "Key alert thresholds: EHP >0.55 probability → yellow risk, >0.85 → hard fail. "
            "WSSV detection always triggers a hard fail. "
            "Share microscopy images and I'll run the AI disease screen "
            "(EHP, WSSV, AHPND, BGD, HPV, Gregarines, WFS)."
        )
    elif any(w in lower for w in ["count", "seed", "pl ", "post-larva", "survival",
                                   "mortality", "extrapolat"]):
        return (
            "To count seeds, I need microscopy images of the counting tray. "
            "I'll run the AI seed counter and report live/dead/debris counts. "
            "Typical healthy batches show ≥85% survival with PL10-PL15 stage dominance."
        )
    elif any(w in lower for w in ["grade", "quality", "stock", "composite", "density"]):
        return (
            "Quality grading uses a composite score: "
            "Visual health 30% + Disease 25% + Size uniformity 20% + Stage 15% + Activity 10%. "
            "Grade A (≥80): Safe to stock at full density. "
            "Grade B (60-79): Stock with 20% density reduction. "
            "Grade C (<60): Consider rejection."
        )
    elif any(w in lower for w in ["hello", "hi", "help", "start"]):
        return (
            "Hello! I'm AquaAI, your shrimp seed diagnostics assistant. I can help you:\n"
            "1. **Count seeds** — YOLOv8 AI seed counter\n"
            "2. **Detect diseases** — EHP, WSSV, AHPND and more\n"
            "3. **Grade quality** — composite score 0-100\n\n"
            "Share microscopy images and ask me to analyse them. "
            "To enable full AI chat, set your ANTHROPIC_API_KEY in the backend .env file."
        )
    else:
        return (
            "I'm AquaAI, specialising in shrimp seed diagnostics. "
            "I can analyse images for seed count, disease detection, and quality grading. "
            "Please describe what you need or share images for analysis. "
            "For full conversational AI, set ANTHROPIC_API_KEY in .env."
        )


def run_agent(
    messages: list[dict],
    context: Optional[dict] = None,
    api_key: Optional[str] = None,
    max_iterations: int = 5,
) -> dict:
    """
    Run the agentic loop.

    messages: list of {role: user|assistant, content: str}
    context: optional dict with farm_id, batch_id, image_paths, farm_history
    api_key: Anthropic API key (reads from ANTHROPIC_API_KEY env if not provided)
    Returns: {reply: str, tool_calls: list, usage: dict}
    """
    key = api_key or os.environ.get("ANTHROPIC_API_KEY", "")
    context = context or {}

    if not key:
        reply = _rule_based_response(messages, context)
        return {"reply": reply, "tool_calls": [], "usage": {}, "mode": "rule_based"}

    try:
        import anthropic
    except ImportError:
        reply = _rule_based_response(messages, context)
        return {"reply": reply, "tool_calls": [], "usage": {}, "mode": "rule_based"}

    client = anthropic.Anthropic(api_key=key)
    all_tool_calls = []

    # Build system message with injected live-data context
    system = SYSTEM_PROMPT
    ctx_lines = []
    if context.get("farm_id"):
        ctx_lines.append(f"farm_id={context['farm_id']}")
    if context.get("batch_id"):
        ctx_lines.append(f"batch_id={context['batch_id']}")
    if ctx_lines:
        system += f"\n\nCurrent session context: {', '.join(ctx_lines)}"

    available = []
    if context.get("farm_history"):
        available.append("get_farm_context (recent diagnosis history + risk score)")
    if context.get("water_quality"):
        available.append("get_water_quality (latest pond readings)")
    if context.get("outbreak_alerts"):
        available.append("get_outbreak_alerts (regional disease alerts)")
    if context.get("batch_info"):
        available.append("get_batch_info (batch order details)")
    if available:
        system += ("\nLive database tools available for this session: "
                   + "; ".join(available)
                   + ". Call them when the farmer's question relates to their farm history, "
                     "water conditions, or seed batch.")
    if context.get("image_paths"):
        paths_str = ", ".join(context["image_paths"])
        system += f"\nImage paths available for AI analysis: {paths_str}"

    # Convert messages to Anthropic format
    api_messages = []
    for m in messages:
        if m["role"] in ("user", "assistant"):
            api_messages.append({"role": m["role"], "content": m["content"]})

    total_input_tokens = 0
    total_output_tokens = 0

    try:
        for _ in range(max_iterations):
            response = client.messages.create(
                model="claude-opus-4-7",
                max_tokens=2048,
                system=system,
                tools=TOOLS,
                messages=api_messages,
            )
            total_input_tokens += response.usage.input_tokens
            total_output_tokens += response.usage.output_tokens

            if response.stop_reason == "end_turn":
                reply_text = " ".join(
                    block.text for block in response.content if hasattr(block, "text")
                )
                return {
                    "reply": reply_text,
                    "tool_calls": all_tool_calls,
                    "usage": {
                        "input_tokens": total_input_tokens,
                        "output_tokens": total_output_tokens,
                    },
                    "mode": "claude",
                }

            if response.stop_reason == "tool_use":
                tool_results = []
                assistant_content = response.content

                for block in response.content:
                    if block.type == "tool_use":
                        tool_result = _execute_tool(block.name, block.input, context)
                        all_tool_calls.append({
                            "tool": block.name,
                            "input": block.input,
                            "result": tool_result,
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        })
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": json.dumps(tool_result),
                        })

                api_messages.append({"role": "assistant", "content": assistant_content})
                api_messages.append({"role": "user", "content": tool_results})
            else:
                break
    except Exception as e:
        # API failure (no credits, rate limit, network) — degrade gracefully.
        logger.warning(f"Claude API call failed, falling back to rule-based: {e}")
        return {
            "reply": _rule_based_response(messages, context),
            "tool_calls": all_tool_calls,
            "usage": {"input_tokens": total_input_tokens, "output_tokens": total_output_tokens},
            "mode": "rule_based_fallback",
            "error": str(e),
        }

    # Fallback if we exhausted iterations
    reply_text = "I've gathered the diagnostic data. Please review the tool results above for full analysis."
    return {
        "reply": reply_text,
        "tool_calls": all_tool_calls,
        "usage": {"input_tokens": total_input_tokens, "output_tokens": total_output_tokens},
        "mode": "claude",
    }


# ── Structured diagnosis (deterministic — works fully offline) ─────────────────

def run_structured_diagnosis(
    image_paths: list[str],
    camera_mode: str = "software_mono",
    run_disease: bool = True,
    run_quality: bool = True,
    run_seed_count: bool = False,
) -> dict:
    """
    Run a complete structured diagnosis directly through the ML services.
    Independent of Claude — always works, online or offline.
    Returns {seed_count?, disease?, quality?} with full results.
    """
    results: dict = {}
    seed_cv: Optional[float] = None
    ehp_prob: Optional[float] = None
    wssv_positive = False
    ahpnd_prob: Optional[float] = None
    is_hard_fail = False

    # ── Seed count ───────────────────────────────────────────────────────────
    if run_seed_count:
        seed = run_seed_counter_inference(image_paths)
        seed_cv = seed.get("cv_pct")
        results["seed_count"] = {
            "live_count":        seed.get("live_count"),
            "dead_count":        seed.get("dead_count"),
            "total_count":       seed.get("total_count"),
            "survival_rate_pct": seed.get("survival_rate_pct"),
            "mortality_pct":     seed.get("mortality_pct"),
            "mortality_alert":   seed.get("mortality_alert"),
            "cv_pct":            seed.get("cv_pct"),
            "cv_flag":           seed.get("cv_flag"),
            "mean_length_mm":    seed.get("mean_length_mm"),
            "model_used":        seed.get("model_used"),
        }

    # ── Disease detection ────────────────────────────────────────────────────
    if run_disease:
        ehp   = run_ehp_classification(image_paths, camera_mode)
        ehp_prob = ehp["ehp_positive_prob"]
        spore = run_spore_detection(image_paths, ehp_prob)
        multi = run_multi_disease_screening(image_paths)
        wssv_positive = multi["wssv_positive"]
        ahpnd_prob = multi.get("ahpnd_prob")
        is_hard_fail, hard_fail_disease = determine_hard_fail(ehp_prob, wssv_positive)
        risk_level, risk_action = determine_risk_level(ehp_prob, wssv_positive)
        fusion = compute_multi_signal_fusion(ehp_prob, spore.get("spore_count", 0), seed_cv)
        results["disease"] = {
            "ehp_healthy_prob":   ehp.get("ehp_healthy_prob"),
            "ehp_suspected_prob": ehp.get("ehp_suspected_prob"),
            "ehp_positive_prob":  ehp_prob,
            "spore_detected":     spore.get("spore_detected"),
            "spore_count":        spore.get("spore_count"),
            "spore_severity":     spore.get("spore_severity"),
            "wssv_positive":      wssv_positive,
            "wssv_confidence":    multi.get("wssv_confidence"),
            "ahpnd_prob":         ahpnd_prob,
            "is_hard_fail":       is_hard_fail,
            "hard_fail_disease":  hard_fail_disease,
            "risk_level":         risk_level,
            "risk_action":        risk_action,
            "fused_risk_score":   fusion["fused_risk_score"],
            "model_used":         ehp.get("model_used"),
        }

    # ── Quality grading ──────────────────────────────────────────────────────
    if run_quality:
        vh       = run_visual_health_assessment(image_paths)
        stage    = run_stage_identification(image_paths)
        activity = run_activity_assessment(image_paths)
        disease_score = compute_disease_score(ehp_prob, wssv_positive, ahpnd_prob)
        size_score    = compute_size_uniformity_score(seed_cv)

        if is_hard_fail:
            composite = {"composite_score": 0.0, "composite_grade": "REJECT", "grade": "REJECT"}
        else:
            composite = compute_composite_score(
                vh["visual_health_score"], disease_score, size_score,
                stage["stage_score"], activity,
            )
        grade = composite.get("grade") or composite.get("composite_grade")
        rec = get_stocking_recommendation(composite["composite_score"], grade)
        results["quality"] = {
            "visual_health_score":   vh.get("visual_health_score"),
            "disease_score":         disease_score,
            "size_uniformity_score": size_score,
            "stage_score":           stage.get("stage_score"),
            "activity_score":        activity,
            "composite_score":       composite["composite_score"],
            "grade":                 grade,
            "detected_pl_stage":     stage.get("detected_pl_stage"),
            "stocking_recommendation": rec["stocking_recommendation"],
            "model_used":            vh.get("model_used"),
        }

    return results


def summarize_diagnosis(results: dict) -> str:
    """Build a plain-language diagnosis summary (used when Claude is unavailable)."""
    lines = []

    if "disease" in results:
        d = results["disease"]
        risk = (d.get("risk_level") or "unknown").upper()
        lines.append(
            f"Disease screen: {risk} risk — EHP positive probability "
            f"{d.get('ehp_positive_prob', 0):.0%}."
        )
        if d.get("is_hard_fail"):
            lines.append(
                f"HARD FAIL — {d.get('hard_fail_disease')} detected. "
                f"Reject this batch and send samples for PCR confirmation."
            )
        elif d.get("wssv_positive"):
            lines.append("WSSV detected — do not stock.")
        if d.get("spore_detected"):
            lines.append(f"Spore detection: {d.get('spore_count')} spores ({d.get('spore_severity')} severity).")

    if "seed_count" in results:
        s = results["seed_count"]
        lines.append(
            f"Seed count: {s.get('live_count')} live, {s.get('dead_count')} dead "
            f"({s.get('survival_rate_pct')}% survival, mortality alert "
            f"{s.get('mortality_alert')})."
        )

    if "quality" in results:
        q = results["quality"]
        lines.append(
            f"Quality: composite score {q.get('composite_score')}/100 — "
            f"grade {q.get('grade')}. Stage {q.get('detected_pl_stage')}."
        )
        lines.append(f"Recommendation: {q.get('stocking_recommendation')}")

    if not lines:
        return "No analysis was run. Enable at least one of disease/quality/seed count."
    return " ".join(lines)
