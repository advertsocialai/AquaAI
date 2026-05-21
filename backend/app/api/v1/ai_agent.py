"""
AquaAI Diagnostic Agent API — conversational AI for shrimp farming.
Endpoints:
  POST /ai-agent/chat             → send a message, get AI reply (creates session if needed)
  POST /ai-agent/quick-diagnose   → single-turn structured diagnosis with images
  GET  /ai-agent/sessions         → list user's sessions
  GET  /ai-agent/sessions/{id}    → get full session with tool call log
  DELETE /ai-agent/sessions/{id}  → delete session
  POST /ai-agent/sessions/{id}/feedback → rate the AI response
"""
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.agent_session import AgentSession, AgentFeedback
from app.models.user import User
from app.core.deps import get_current_user
from app.services.ai.agent import run_agent, run_structured_diagnosis, summarize_diagnosis
from app.services.ai.agent_context import build_agent_context

router = APIRouter(prefix="/ai-agent", tags=["AquaAI Diagnostic Agent"])


# ── Schemas ──────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None      # continue existing session
    farm_id: Optional[int] = None
    batch_id: Optional[int] = None
    image_paths: Optional[List[str]] = None


class PublicChatRequest(BaseModel):
    """Stateless public chat — client sends the full message history each turn."""
    messages: List[ChatMessage]


class QuickDiagnoseRequest(BaseModel):
    image_paths: List[str]
    camera_mode: str = "software_mono"
    farm_id: Optional[int] = None
    batch_id: Optional[int] = None
    run_disease: bool = True
    run_quality: bool = True
    run_seed_count: bool = False


class FeedbackRequest(BaseModel):
    rating: Optional[int] = None           # 1-5
    helpful: Optional[bool] = None
    comment: Optional[str] = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _auto_title(message: str) -> str:
    words = message.strip().split()
    return " ".join(words[:6]) + ("…" if len(words) > 6 else "")


def _messages_to_list(session: AgentSession) -> list:
    return session.messages or []


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/chat")
async def chat(
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Send a message to the AquaAI agent. Creates a new session if session_id is None.
    Continues an existing session if session_id is provided.
    The agent can call tools (count_seeds, detect_disease, grade_quality) autonomously.
    """
    # Load or create session
    if payload.session_id:
        session = await db.get(AgentSession, payload.session_id)
        if not session or session.user_id != current_user.id:
            raise HTTPException(404, "Session not found")
    else:
        session = AgentSession(
            user_id=current_user.id,
            farm_id=payload.farm_id,
            batch_id=payload.batch_id,
            messages=[],
            tool_calls_log=[],
            title=_auto_title(payload.message),
        )
        db.add(session)
        await db.flush()  # get session.id

    # Append new user message to history
    messages: list = list(session.messages or [])
    messages.append({
        "role": "user",
        "content": payload.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # Pre-fetch live database context (farm history, water quality, outbreaks, batch)
    context = await build_agent_context(
        db,
        farm_id=payload.farm_id or session.farm_id,
        batch_id=payload.batch_id or session.batch_id,
        image_paths=payload.image_paths or [],
    )

    # Run the agentic loop
    result = run_agent(messages=messages, context=context)

    # Append assistant reply
    messages.append({
        "role": "assistant",
        "content": result["reply"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # Persist to DB
    tool_log = list(session.tool_calls_log or [])
    tool_log.extend(result["tool_calls"])
    session.messages = messages
    session.tool_calls_log = tool_log
    session.updated_at = datetime.now(timezone.utc)

    # Extract final risk from last tool call if available
    for tc in reversed(result["tool_calls"]):
        if tc["tool"] in ("detect_disease", "interpret_results"):
            r = tc.get("result", {})
            if "risk_level" in r:
                session.final_risk_level = r["risk_level"]
            if "stocking_recommendation" in r:
                session.final_recommendation = r["stocking_recommendation"]
            break

    await db.commit()
    await db.refresh(session)

    return {
        "session_id": session.id,
        "reply": result["reply"],
        "tool_calls": result["tool_calls"],
        "mode": result.get("mode", "unknown"),
        "usage": result.get("usage", {}),
        "final_risk_level": session.final_risk_level,
    }


@router.post("/quick-diagnose")
async def quick_diagnose(
    payload: QuickDiagnoseRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Single-turn structured diagnosis — sends images and gets a complete analysis.
    Runs the real ML/vision pipeline directly (works online and offline).
    Claude Opus, when configured, adds a natural-language summary.
    """
    if not payload.image_paths:
        raise HTTPException(400, "image_paths is required")

    # ── Run the real diagnosis pipeline (always works) ───────────────────────
    results = run_structured_diagnosis(
        image_paths=payload.image_paths,
        camera_mode=payload.camera_mode,
        run_disease=payload.run_disease,
        run_quality=payload.run_quality,
        run_seed_count=payload.run_seed_count,
    )

    # ── Summary: Claude Opus when available, deterministic otherwise ──────────
    import os
    if os.environ.get("ANTHROPIC_API_KEY"):
        prompt = (
            "Here are AI diagnostic results for a shrimp seed batch. Write a clear, "
            "concise summary for a farmer with a definitive stocking recommendation:\n"
            f"{results}"
        )
        agent_out = run_agent(messages=[{"role": "user", "content": prompt}], context={})
        analysis = agent_out["reply"]
        mode = agent_out.get("mode", "claude")
    else:
        analysis = summarize_diagnosis(results)
        mode = "offline_ml"

    # ── Persist as a session for audit trail ─────────────────────────────────
    final_risk = results.get("disease", {}).get("risk_level")
    session = AgentSession(
        user_id=current_user.id,
        farm_id=payload.farm_id,
        batch_id=payload.batch_id,
        messages=[
            {"role": "user", "content": f"Quick diagnosis: {payload.image_paths}"},
            {"role": "assistant", "content": analysis},
        ],
        tool_calls_log=[{"tool": k, "result": v} for k, v in results.items()],
        title="Quick Diagnosis",
        final_risk_level=final_risk,
        final_recommendation=results.get("quality", {}).get("stocking_recommendation"),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    return {
        "session_id": session.id,
        "analysis": analysis,
        "results": results,
        "final_risk_level": final_risk,
        "mode": mode,
        "image_paths": payload.image_paths,
    }


@router.get("/sessions")
async def list_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all AI agent sessions for the current user."""
    q = select(AgentSession).where(
        AgentSession.user_id == current_user.id
    ).order_by(AgentSession.updated_at.desc()).limit(50)
    result = await db.execute(q)
    sessions = result.scalars().all()
    return [
        {
            "id": s.id,
            "title": s.title,
            "farm_id": s.farm_id,
            "batch_id": s.batch_id,
            "message_count": len(s.messages or []),
            "final_risk_level": s.final_risk_level,
            "created_at": s.created_at,
            "updated_at": s.updated_at,
        }
        for s in sessions
    ]


@router.get("/sessions/{session_id}")
async def get_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full session including message history and tool call log."""
    session = await db.get(AgentSession, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(404, "Session not found")
    return {
        "id": session.id,
        "title": session.title,
        "farm_id": session.farm_id,
        "batch_id": session.batch_id,
        "messages": session.messages,
        "tool_calls_log": session.tool_calls_log,
        "final_risk_level": session.final_risk_level,
        "final_recommendation": session.final_recommendation,
        "created_at": session.created_at,
        "updated_at": session.updated_at,
    }


@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an AI agent session and any feedback attached to it."""
    session = await db.get(AgentSession, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(404, "Session not found")

    # Remove dependent feedback rows first (FK constraint)
    from sqlalchemy import delete as sa_delete
    await db.execute(
        sa_delete(AgentFeedback).where(AgentFeedback.session_id == session_id)
    )
    await db.delete(session)
    await db.commit()


@router.post("/sessions/{session_id}/feedback", status_code=201)
async def submit_feedback(
    session_id: int,
    payload: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Rate an AI agent session (1-5 stars, helpful flag, comment)."""
    session = await db.get(AgentSession, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(404, "Session not found")

    feedback = AgentFeedback(
        session_id=session_id,
        user_id=current_user.id,
        rating=payload.rating,
        helpful=payload.helpful,
        comment=payload.comment,
    )
    db.add(feedback)
    await db.commit()
    return {"recorded": True, "session_id": session_id}


@router.post("/public-chat")
async def public_chat(payload: PublicChatRequest):
    """
    Stateless public chat with the AquaAI agent — no auth, nothing persisted.
    The client sends the full conversation each turn. Powers the web chat widget.
    """
    messages = [{"role": m.role, "content": m.content} for m in payload.messages]
    if not messages or messages[-1]["role"] != "user":
        raise HTTPException(400, "Last message must be from the user")
    result = run_agent(messages=messages, context={})
    return {
        "reply": result["reply"],
        "mode": result.get("mode", "unknown"),
        "tool_calls": result.get("tool_calls", []),
    }


@router.get("/status")
async def agent_status():
    """Report AI engine status — Claude Opus chat agent + vision inference. Public."""
    import os
    has_key = bool(os.environ.get("ANTHROPIC_API_KEY", ""))
    return {
        "mode": "claude_opus" if has_key else "offline_ml",
        "model": "claude-opus-4-7" if has_key else None,
        "chat_agent": {
            "enabled": has_key,
            "model": "claude-opus-4-7" if has_key else None,
            "tools_available": ["count_seeds", "detect_disease", "grade_quality",
                                "get_farm_context", "interpret_results"],
        },
        "vision_inference": {
            "enabled": has_key,
            "model": "claude-opus-4-7" if has_key else None,
            "analyses": ["ehp_disease", "seed_count", "quality_grading", "multi_disease"],
            "offline_fallback": "sklearn GradientBoosting + OpenCV blob detection",
        },
        "api_key_configured": has_key,
        "message": (
            "Claude Opus 4 powering both the chat agent and all image diagnostics."
            if has_key else
            "Running on offline ML (sklearn + OpenCV). "
            "Set ANTHROPIC_API_KEY in .env to enable Claude Opus 4 vision + chat."
        ),
    }
