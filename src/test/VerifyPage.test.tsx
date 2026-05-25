import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import VerifyPage from "@/pages/VerifyPage";
import { SAMPLE_CERT } from "@/lib/qcCertificate";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/verify/:certId" element={<VerifyPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("<VerifyPage />", () => {
  it("shows a verified state for a known cert id", async () => {
    renderAt(`/verify/${SAMPLE_CERT.id}`);
    await waitFor(() => {
      expect(screen.getByText(/Signature matches/i)).toBeInTheDocument();
    });
    expect(screen.getByText(SAMPLE_CERT.hatcheryName)).toBeInTheDocument();
  });

  it("shows an invalid state for an unknown cert id", async () => {
    renderAt("/verify/QC-DOES-NOT-EXIST");
    await waitFor(() => {
      expect(screen.getByText(/Signature does not match/i)).toBeInTheDocument();
    });
  });
});
