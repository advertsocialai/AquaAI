import { describe, it, expect } from "vitest";
import {
  getPrices,
  getOutbreaks,
  getFarmRiskBook,
  getWeather,
  askAssistant,
  requestOtp,
  verifyOtp,
} from "@/services/api";

describe("services/api stubs", () => {
  it("returns prawn prices with the expected shape", async () => {
    const rows = await getPrices("prawn");
    expect(rows.length).toBeGreaterThan(0);
    const first = rows[0];
    expect(first).toHaveProperty("species");
    expect(first).toHaveProperty("size");
    expect(first).toHaveProperty("low");
    expect(first).toHaveProperty("high");
    expect(["up", "down", "flat"]).toContain(first.trend);
    expect(first.low).toBeLessThanOrEqual(first.high);
  });

  it("returns outbreaks with severity bands", async () => {
    const outbreaks = await getOutbreaks();
    expect(outbreaks.length).toBeGreaterThan(0);
    for (const o of outbreaks) {
      expect(["high", "medium", "low"]).toContain(o.severity);
      expect(o.farms).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns farm risk book with recommended ≤ requested", async () => {
    const book = await getFarmRiskBook();
    expect(book.length).toBeGreaterThan(0);
    for (const f of book) {
      expect(["A", "B", "C", "D"]).toContain(f.band);
      expect(f.recommended).toBeLessThanOrEqual(f.loanReq);
    }
  });

  it("returns weather with the requested district", async () => {
    const w = await getWeather("Bhimavaram");
    expect(w.district).toBe("Bhimavaram");
    expect(typeof w.tempC).toBe("number");
  });

  it("askAssistant returns price-aware replies", async () => {
    const r = await askAssistant("What is the vannamei price today?");
    expect(r.toLowerCase()).toContain("vannamei");
  });

  it("OTP flow: 6-digit OTP verifies, short OTP rejects", async () => {
    const requested = await requestOtp("9876543210");
    expect(requested.ok).toBe(true);
    const ok = await verifyOtp("9876543210", "123456");
    expect(ok.ok).toBe(true);
    expect(ok.token).toBeDefined();
    const bad = await verifyOtp("9876543210", "123");
    expect(bad.ok).toBe(false);
  });
});
