"""Logistics & transport stubs — vehicles, load matching, GPS tracking, e-way bills."""
from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/logistics", tags=["logistics"])


class Vehicle(BaseModel):
    type: str
    capacity: str
    use: str
    rate_low: int
    rate_high: int
    cold: bool
    live: bool


class Route(BaseModel):
    origin: str
    destination: str
    state: str
    kind: str


class Shipment(BaseModel):
    id: str
    cargo: str
    vehicle: str
    route: str
    temp_c: float
    eta_hours: float
    status: str


VEHICLES = [
    Vehicle(type="Insulated mini-truck (Tata Ace)", capacity="500-800 kg",     use="Local PL seed delivery",    rate_low=8,  rate_high=15,  cold=True,  live=False),
    Vehicle(type="Insulated pickup (1 t)",          capacity="1,000 kg",       use="Inter-district PL/harvest", rate_low=15, rate_high=25,  cold=True,  live=False),
    Vehicle(type="Refrigerated truck (small)",      capacity="3 tonnes",       use="Harvest → processing",      rate_low=25, rate_high=40,  cold=True,  live=False),
    Vehicle(type="Refrigerated truck (medium)",     capacity="9 tonnes",       use="Processor → port/airport",  rate_low=40, rate_high=60,  cold=True,  live=False),
    Vehicle(type="Live haul tanker (oxygenated)",   capacity="2-5 tonnes live",use="Live shrimp / fingerlings", rate_low=50, rate_high=80,  cold=False, live=True),
    Vehicle(type="Reefer container truck",          capacity="20-25 tonnes",   use="Export consignments",       rate_low=80, rate_high=120, cold=True,  live=False),
]


ROUTES = [
    Route(origin="Bhimavaram",  destination="Visakhapatnam Port", state="AP", kind="Export hub"),
    Route(origin="Nellore",     destination="Chennai Airport",    state="AP", kind="Live air-freight"),
    Route(origin="Krishna",     destination="Hyderabad / Blr",    state="AP", kind="Domestic mass market"),
    Route(origin="East Godavari",destination="Kakinada Port",     state="AP", kind="Export"),
    Route(origin="Surat",       destination="Pipavav Port",       state="GJ", kind="Export corridor"),
    Route(origin="Bhubaneswar", destination="Paradip Port",       state="OD", kind="Export"),
    Route(origin="Kolkata",     destination="Haldia Port",        state="WB", kind="Export"),
]


SHIPMENTS = [
    Shipment(id="AQ-2451", cargo="12 t Vannamei",      vehicle="Reefer 20 ft", route="Bhimavaram → Vizag",  temp_c=-2,  eta_hours=2.25, status="on_route"),
    Shipment(id="AQ-2452", cargo="3 lakh PL",          vehicle="Mini-truck",   route="Hatchery → Pond 17",  temp_c=24,  eta_hours=0.63, status="on_route"),
    Shipment(id="AQ-2453", cargo="900 kg live scampi", vehicle="O₂ tanker",    route="Krishna → Hyd",       temp_c=26,  eta_hours=4.03, status="o2_low"),
    Shipment(id="AQ-2454", cargo="8 t Rohu (ice)",     vehicle="Refer 9 t",    route="EG → Kakinada",       temp_c=0,   eta_hours=1.33, status="delayed"),
]


@router.get("/vehicles", response_model=list[Vehicle])
def list_vehicles():
    return VEHICLES


@router.get("/routes", response_model=list[Route])
def list_routes():
    return ROUTES


@router.get("/shipments", response_model=list[Shipment])
def list_shipments():
    return SHIPMENTS


@router.get("/shipments/{shipment_id}/track")
def track_shipment(shipment_id: str):
    return {
        "shipment_id": shipment_id,
        "lat": 16.5417,
        "lng": 81.5219,
        "speed_kmh": 42,
        "last_update": "2026-05-24T08:14:00+05:30",
        "checkpoints_passed": 3,
        "next_checkpoint": "Eluru toll plaza",
    }


@router.post("/load-match")
def post_load(payload: dict):
    return {"ok": True, "match_id": "match_stub_001", "bids_expected": "2-3 hours"}


@router.post("/eway-bill")
def generate_eway(payload: dict):
    return {"ok": True, "eway_bill_no": "EWB-2026-00012451", "valid_until": "2026-05-26"}
