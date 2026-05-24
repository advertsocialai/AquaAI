"""Community & forums stubs — district forums, hatchery leaderboard, success stories, VLE directory."""
from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/community", tags=["community"])


class Forum(BaseModel):
    name: str
    state: str
    members: int
    threads: int
    hot: str


class Hatchery(BaseModel):
    rank: int
    name: str
    district: str
    avg_qs: int
    batches: int
    rating: float
    mpeda_tier: str


class Story(BaseModel):
    farmer: str
    district: str
    yield_per_acre: str
    cycle_profit: str
    story: str


class VLE(BaseModel):
    name: str
    district: str
    farms: int
    rating: float
    since: str


FORUMS = [
    Forum(name="West Godavari", state="AP", members=4128, threads=312, hot="EHP outbreak update — 14 affected"),
    Forum(name="East Godavari", state="AP", members=3411, threads=247, hot="Best CP feed price this week?"),
    Forum(name="Krishna",       state="AP", members=2876, threads=198, hot="Vannamei 40-ct ₹12 jump — sell or hold?"),
    Forum(name="Nellore",       state="AP", members=2103, threads=167, hot="Cyclone Aakash pond prep checklist"),
    Forum(name="Surat",         state="GJ", members=987,  threads=71,  hot="Reefer to Pipavav — current rates"),
    Forum(name="Bhubaneswar",   state="OD", members=654,  threads=48,  hot="Scampi vs vannamei for sandy ponds"),
    Forum(name="Kakdwip",       state="WB", members=489,  threads=34,  hot="BGD in monodon — treatment options"),
]

HATCHERIES = [
    Hatchery(rank=1, name="Aquaprime Hatcheries",  district="Bhimavaram", avg_qs=94, batches=142, rating=4.9, mpeda_tier="A++"),
    Hatchery(rank=2, name="BlueFin SPF Labs",      district="Nellore",    avg_qs=92, batches=98,  rating=4.8, mpeda_tier="A+"),
    Hatchery(rank=3, name="CoastalLine Hatchery",  district="Vizag",      avg_qs=90, batches=76,  rating=4.7, mpeda_tier="A+"),
    Hatchery(rank=4, name="AndhraMarine PLs",      district="Krishna",    avg_qs=88, batches=64,  rating=4.6, mpeda_tier="A"),
    Hatchery(rank=5, name="Sagar Seed Co.",        district="Surat",      avg_qs=85, batches=41,  rating=4.4, mpeda_tier="A"),
]

STORIES = [
    Story(farmer="V. Ramana",    district="Bhimavaram", yield_per_acre="5.8 t/acre", cycle_profit="₹4.2 L", story="Switched to MPEDA-A++ PLs + AquaI QC. Crop loss dropped from 18% to 4%."),
    Story(farmer="K. Srinivasan",district="Nellore",    yield_per_acre="4.6 t/acre", cycle_profit="₹3.1 L", story="Caught EHP at DOC-28 via app. Restocked clean batch. Saved entire crop."),
    Story(farmer="A. Mohanty",   district="Paradip",    yield_per_acre="3.9 t/acre", cycle_profit="₹2.4 L", story="Reverse-auction sold to Bangalore buyer at ₹18/kg premium."),
]

VLES = [
    VLE(name="S. Naidu",   district="West Godavari", farms=22, rating=4.9, since="Apr 2024"),
    VLE(name="R. Kumar",   district="Krishna",       farms=18, rating=4.8, since="Jun 2024"),
    VLE(name="M. Lakshmi", district="East Godavari", farms=16, rating=4.7, since="Mar 2024"),
    VLE(name="B. Reddy",   district="Nellore",       farms=14, rating=4.6, since="Aug 2024"),
]


@router.get("/forums", response_model=list[Forum])
def list_forums():
    return FORUMS


@router.get("/hatchery-leaderboard", response_model=list[Hatchery])
def hatchery_leaderboard():
    return HATCHERIES


@router.get("/stories", response_model=list[Story])
def stories():
    return STORIES


@router.get("/vle-directory", response_model=list[VLE])
def vle_directory():
    return VLES


@router.post("/threads")
def create_thread(payload: dict):
    return {"ok": True, "thread_id": "thread_stub_001"}
