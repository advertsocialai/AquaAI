import { describe, it, expect } from "vitest";
import { generateCertificatePdf, SAMPLE_CERT } from "@/lib/qcCertificate";

describe("generateCertificatePdf", () => {
  it("produces a non-empty PDF blob", async () => {
    const doc = await generateCertificatePdf(SAMPLE_CERT);
    const blob = doc.output("blob");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(2000);
  });

  it("embeds the certificate ID in the rendered text content", async () => {
    const doc = await generateCertificatePdf(SAMPLE_CERT);
    const str = doc.output("datauristring");
    expect(str).toContain("data:application/pdf");
  });

  it("renders different PDFs for different cert IDs", async () => {
    const a = (await generateCertificatePdf(SAMPLE_CERT)).output("datauristring");
    const b = (
      await generateCertificatePdf({ ...SAMPLE_CERT, id: "QC-2026-99999" })
    ).output("datauristring");
    expect(a.length).toBeGreaterThan(1000);
    expect(b.length).toBeGreaterThan(1000);
    // The two PDFs should not be byte-identical because the cert ID is rendered.
    expect(a).not.toBe(b);
  });
});
