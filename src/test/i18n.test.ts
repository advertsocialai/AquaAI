import { describe, it, expect } from "vitest";
import i18n, { LANGUAGES } from "@/lib/i18n";

describe("i18n", () => {
  it("exposes five supported languages", () => {
    expect(LANGUAGES.length).toBe(5);
    expect(LANGUAGES.map((l) => l.code).sort()).toEqual([
      "bn", "en", "hi", "od", "te",
    ]);
  });

  it("falls back to English when key missing", () => {
    expect(i18n.t("common.signIn")).toBeTruthy();
  });

  it("loads Telugu role labels", async () => {
    await i18n.changeLanguage("te");
    expect(i18n.t("roles.farmer")).toBe("రైతు");
  });

  it("loads Hindi tab labels", async () => {
    await i18n.changeLanguage("hi");
    expect(i18n.t("tabs.pricing")).toBe("मूल्य निर्धारण");
  });
});
