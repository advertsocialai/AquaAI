#!/bin/bash
# Start the 3T-Tech AquaAI Backend locally
cd "$(dirname "$0")"
echo "Starting 3T-Tech AquaAI Backend..."
venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
