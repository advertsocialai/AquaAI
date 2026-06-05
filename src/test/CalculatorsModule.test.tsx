import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CalculatorsModule } from "@/components/dashboard/CalculatorsModule";

describe("<CalculatorsModule />", () => {
  it("shows all calculator entries", () => {
    render(<CalculatorsModule />);
    // Each label may appear in the sidebar AND the active card header — accept ≥ 1.
    for (const label of [
      "Survival Calculator",
      "Feed Calculator",
      "Shrimp Count",
      "Aeration HP",
      "Liming Requirement",
      "Pond Volume",
      "Profit / Loss",
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("switches to the Pond Volume calculator when clicked", () => {
    render(<CalculatorsModule />);
    fireEvent.click(screen.getByText("Pond Volume"));
    // After switching, the calc shows length/width/depth labels not present elsewhere.
    expect(screen.getByText(/Length/)).toBeInTheDocument();
    expect(screen.getByText(/Width/)).toBeInTheDocument();
    expect(screen.getByText(/Avg depth/)).toBeInTheDocument();
  });
});
