import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PricingModule } from "@/components/dashboard/PricingModule";

describe("<PricingModule />", () => {
  it("renders the three species category tabs", () => {
    render(<PricingModule />);
    expect(screen.getByText(/Prawn & Shrimp/i)).toBeInTheDocument();
    expect(screen.getByText(/Freshwater Fish/i)).toBeInTheDocument();
    expect(screen.getByText(/Brackish \/ Marine/i)).toBeInTheDocument();
  });

  it("shows the price history chart by default", () => {
    render(<PricingModule />);
    // The chart shows the species selector buttons (Vannamei 40-ct etc.) at top.
    expect(screen.getByText(/Vannamei 40-ct/)).toBeInTheDocument();
  });

  it("search filters the price table", () => {
    render(<PricingModule />);
    const input = screen.getByPlaceholderText(/Search species/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "vannamei" } });
    // At least one row should still be present (vannamei matches several).
    expect(screen.getAllByText(/L\. vannamei/).length).toBeGreaterThan(0);
  });
});
