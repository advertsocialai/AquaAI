from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, Text, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class AgentSession(Base):
    __tablename__ = "agent_sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=True)          # auto-generated from first message
    farm_id = Column(Integer, nullable=True)
    batch_id = Column(Integer, nullable=True)
    messages = Column(JSON, default=list)          # list of {role, content, tool_calls, timestamp}
    tool_calls_log = Column(JSON, default=list)    # all tool invocations with results
    final_risk_level = Column(String, nullable=True)
    final_recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class AgentFeedback(Base):
    __tablename__ = "agent_feedback"

    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("agent_sessions.id"), nullable=False)
    user_id = Column(Integer, nullable=False)
    rating = Column(Integer, nullable=True)        # 1-5
    helpful = Column(Boolean, nullable=True)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
