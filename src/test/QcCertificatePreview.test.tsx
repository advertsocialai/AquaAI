import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QcCertificatePreview } from "@/components/dashboard/QcCertificatePreview";
import { SAMPLE_CERT } from "@/lib/qcCertificate";

describe("<QcCertificatePreview />", () => {
  it("shows the certificate ID and grade", () => {
    render(<QcCertificatePreview />);
    expect(screen.getAllByText(SAMPLE_CERT.id).length).toBeGreaterThan(0);
    // The grade is rendered with CSS uppercase, so the DOM text is still mixed case.
    expect(screen.getByText(SAMPLE_CERT.grade)).toBeInTheDocument();
  });

  it("renders Download and Open-in-tab actions", () => {
    render(<QcCertificatePreview />);
    expect(screen.getByRole("button", { name: /Download PDF/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open in new tab/i })).toBeInTheDocument();
  });

  it("highlights the MPEDA-aligned footer", () => {
    render(<QcCertificatePreview />);
    expect(screen.getByText(/MPEDA-aligned format/i)).toBeInTheDocument();
  });
});
