"""Marketplace stubs — catalogues for seed/feed, aeration, ice, diagnostic kits, infra."""
from __future__ import annotations
from typing import Literal
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/marketplace", tags=["marketplace"])


class Item(BaseModel):
    sku: str
    name: str
    spec: str
    low: float
    high: float
    unit: str | None = None


class Category(BaseModel):
    id: str
    label: str
    items: list[Item]


CATEGORIES = [
    Category(id="seed-feed", label="Seed, Feed & Inputs", items=[
        Item(sku="SF-001", name="PL Seed (MPEDA)",      spec="L. vannamei, AI-QC linked",  low=0.30, high=0.55, unit="₹/PL"),
        Item(sku="SF-002", name="Starter Feed CP",       spec="40% protein, crumble",       low=95,   high=130,  unit="₹/kg"),
        Item(sku="SF-003", name="Grower Feed",           spec="36-38% protein, pellet",     low=80,   high=110,  unit="₹/kg"),
        Item(sku="SF-004", name="Probiotic",             spec="water + gut blend",          low=350,  high=800,  unit="₹/kg"),
        Item(sku="SF-005", name="Test Kits — full set",  spec="pH, DO, NH3, NO2, salinity", low=1200, high=3500, unit="₹/set"),
        Item(sku="SF-006", name="Quicklime (CaO)",       spec="EHP eradication grade",      low=8,    high=14,   unit="₹/kg"),
    ]),
    Category(id="aeration", label="Aeration & Oxygen", items=[
        Item(sku="AE-001", name="Paddle wheel aerator", spec="1 HP · 0.5 acre",   low=18000,  high=28000),
        Item(sku="AE-002", name="Paddle wheel aerator", spec="2 HP · 1 acre",     low=32000,  high=45000),
        Item(sku="AE-003", name="Aspirator aerator",    spec="submersible / HP",  low=12000,  high=25000),
        Item(sku="AE-004", name="Liquid O₂ tank 250L",  spec="",                  low=35000,  high=55000),
        Item(sku="AE-005", name="PSA O₂ generator",     spec="10 LPM",            low=180000, high=280000),
        Item(sku="AE-006", name="Emergency O₂ kit",     spec="transport · 1-2 hr",low=4500,   high=8000),
    ]),
    Category(id="cold-chain", label="Ice & Cold Chain", items=[
        Item(sku="CC-001", name="Block Ice",          spec="delivered, bulk",         low=3,        high=6,        unit="₹/kg"),
        Item(sku="CC-002", name="Flake Ice",          spec="hatchery grade",          low=5,        high=9,        unit="₹/kg"),
        Item(sku="CC-003", name="Insulated Fish Box", spec="200 L",                   low=4500,     high=8000),
        Item(sku="CC-004", name="Reefer (20 ft)",     spec="rental per day",          low=2500,     high=4500,     unit="₹/day"),
        Item(sku="CC-005", name="Cold Storage",       spec="per kg / day",            low=1.5,      high=4,        unit="₹/kg-day"),
    ]),
    Category(id="diagnostic", label="Diagnostic Hardware", items=[
        Item(sku="DG-001", name="USB Pen Microscope",  spec="400-1000x · LED",        low=1500, high=5000),
        Item(sku="DG-002", name="IntensLight LED ring",spec="5 brightness levels",    low=500,  high=1500),
        Item(sku="DG-003", name="Counting Tray",       spec="20 × 20 cm acrylic",     low=200,  high=500),
        Item(sku="DG-004", name="Phone Stand Clip",    spec="20-25 cm height",        low=150,  high=400),
        Item(sku="DG-005", name="Macro Lens",          spec="20-40× magnification",   low=500,  high=1500),
        Item(sku="DG-006", name="VLE Bundle Kit",      spec="complete diagnostic",    low=3000, high=9150),
    ]),
    Category(id="infra", label="Pond & Infrastructure", items=[
        Item(sku="IN-001", name="HDPE Pond Liner",  spec="per sqm",            low=45,    high=120,   unit="₹/sqm"),
        Item(sku="IN-002", name="Sluice Gate",       spec="standard pond",      low=8000,  high=25000),
        Item(sku="IN-003", name="Bird Net",          spec="per acre",           low=12000, high=30000),
        Item(sku="IN-004", name="Genset",            spec="5-25 kVA",           low=35000, high=250000),
        Item(sku="IN-005", name="Solar Pump",        spec="off-grid pond",      low=65000, high=220000),
        Item(sku="IN-006", name="IoT Sensor Pack",   spec="pH/DO/Temp/Salin.",  low=12000, high=45000),
    ]),
]


@router.get("/categories", response_model=list[Category])
def list_categories():
    return CATEGORIES


@router.get("/items/{sku}", response_model=Item)
def get_item(sku: str):
    for c in CATEGORIES:
        for it in c.items:
            if it.sku == sku:
                return it
    return Item(sku=sku, name="Unknown", spec="—", low=0, high=0)


@router.post("/rfq")
def post_rfq(payload: dict):
    return {"ok": True, "rfq_id": "rfq_stub_001", "expected_quotes_by": "24h"}


@router.post("/cart/checkout")
def checkout(payload: dict):
    return {
        "ok": True,
        "order_id": "ord_stub_001",
        "payment_provider": "razorpay",
        "next_action": "redirect_to_payment",
    }
