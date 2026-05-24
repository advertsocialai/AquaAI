import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoanApplication } from "@/components/dashboard/LoanApplication";

describe("<LoanApplication />", () => {
  it("starts on the farm-details step", () => {
    render(<LoanApplication />);
    expect(screen.getByText(/Farmer name/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg QS/i)).toBeInTheDocument();
  });

  it("Back button moves to the previous step", () => {
    render(<LoanApplication />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByText(/Farmer name/i)).toBeInTheDocument();
  });

  it("renders all five step labels in the progress indicator", () => {
    render(<LoanApplication />);
    for (const label of ["Farm details", "Loan amount", "Collateral", "Review", "AI decision"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
