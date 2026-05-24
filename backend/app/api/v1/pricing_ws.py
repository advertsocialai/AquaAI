"""WebSocket pricing ticker.

Pushes a price tick every 60s (or `interval` query param) for the
species listed in PRAWN/FRESHWATER/MARINE. Replace the random-walk
generator with a real mandi feed adapter when live data is available.
"""
from __future__ import annotations
import asyncio
import json
import random
from typing import Iterator
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

router = APIRouter(prefix="/pricing-ws", tags=["pricing"])

# Anchor prices — matches PRAWN_PRICES in pricing.py
ANCHORS: dict[str, int] = {
    "vannamei-30":  515,
    "vannamei-40":  415,
    "vannamei-50":  350,
    "vannamei-60":  305,
    "vannamei-70":  265,
    "vannamei-80":  235,
    "vannamei-100": 200,
    "monodon-20":   825,
    "monodon-30":   660,
    "scampi-8":     625,
    "rohu":         160,
    "seabass":      400,
}


def random_tick(prices: dict[str, int]) -> Iterator[dict[str, int]]:
    while True:
        for sku in list(prices.keys()):
            anchor = ANCHORS[sku]
            drift = random.randint(-6, 6)
            prices[sku] = max(int(anchor * 0.8), min(int(anchor * 1.15), prices[sku] + drift))
        yield prices.copy()


@router.websocket("/ticker")
async def ticker(websocket: WebSocket, interval: float = Query(60.0, ge=1.0, le=600.0)):
    await websocket.accept()
    prices = {k: v for k, v in ANCHORS.items()}
    gen = random_tick(prices)
    try:
        while True:
            tick = next(gen)
            await websocket.send_text(json.dumps({"type": "tick", "prices": tick}))
            await asyncio.sleep(interval)
    except WebSocketDisconnect:
        return
