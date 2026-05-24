"""Knowledge hub stubs — articles, videos, courses, papers, diseases, species."""
from __future__ import annotations
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


class Article(BaseModel):
    id: str
    kind: str
    title: str
    meta: str
    tag: str | None = None
    lang: list[str] = []


ITEMS: list[Article] = [
    Article(id="art-001", kind="article", title="Pond preparation before stocking: 7-step checklist", meta="6 min · ICAR-CIBA", tag="Pond Prep",     lang=["en","te"]),
    Article(id="art-002", kind="article", title="Reading water quality reports for shrimp farmers",   meta="4 min",            tag="Water Quality", lang=["en","te","ta"]),
    Article(id="art-003", kind="article", title="Probiotic dosing schedule for vannamei",             meta="5 min",            tag="Feed",         lang=["en","te"]),
    Article(id="art-004", kind="article", title="Cyclone season SOP: protecting your pond",           meta="8 min · IMD",      tag="Weather",      lang=["en","te","od"]),
    Article(id="vid-001", kind="video",   title="How to count PLs on a tray — IntensLight technique", meta="3:42",             tag="Diagnostics",  lang=["te","en"]),
    Article(id="vid-002", kind="video",   title="Spotting EHP under a USB microscope",                meta="5:18 · ICAR-CIBA", tag="Disease ID",   lang=["te","en"]),
    Article(id="cou-001", kind="course",  title="AquaI Foundations — new farmers",                    meta="12 lessons · 3h",  tag="Beginner",     lang=["te","ta","en"]),
    Article(id="cou-002", kind="course",  title="VLE Certification — diagnostic services",            meta="24 lessons · 9h",  tag="Certification",lang=["en","te"]),
    Article(id="pap-001", kind="paper",   title="EHP global review (2024)",                            meta="Tang et al.",      tag="EHP"),
    Article(id="pap-002", kind="paper",   title="WSSV PCR detection in AP hatcheries",                 meta="NBFGR · 2023",     tag="WSSV"),
    Article(id="dis-001", kind="disease", title="EHP — Enterocytozoon hepatopenaei",                   meta="Hard-fail",        tag="Critical"),
    Article(id="dis-002", kind="disease", title="WSSV — White Spot Syndrome Virus",                    meta="Hard-fail",        tag="Critical"),
    Article(id="dis-003", kind="disease", title="AHPND / EMS",                                         meta="Toxin",            tag="Critical"),
    Article(id="spe-001", kind="species", title="Litopenaeus vannamei",                                meta="Whiteleg shrimp",  tag="Prawn"),
    Article(id="spe-002", kind="species", title="Penaeus monodon",                                    meta="Black tiger",      tag="Prawn"),
    Article(id="spe-003", kind="species", title="Lates calcarifer",                                    meta="Asian seabass",    tag="Fish"),
]


@router.get("/items", response_model=list[Article])
def list_items(kind: str | None = Query(None), q: str | None = Query(None)):
    rows = ITEMS
    if kind:
        rows = [r for r in rows if r.kind == kind]
    if q:
        ql = q.lower()
        rows = [r for r in rows if ql in r.title.lower() or (r.tag and ql in r.tag.lower())]
    return rows


@router.get("/items/{item_id}", response_model=Article)
def get_item(item_id: str):
    for r in ITEMS:
        if r.id == item_id:
            return r
    return Article(id=item_id, kind="unknown", title="Not found", meta="")
