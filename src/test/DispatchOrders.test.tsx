import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DispatchOrders } from "@/components/dashboard/DispatchOrders";

describe("<DispatchOrders />", () => {
  it("renders the dispatch summary cards", () => {
    render(<DispatchOrders />);
    // Labels may appear in both the summary tile and status pills — accept ≥ 1.
    expect(screen.getAllByText(/All dispatches/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/On route \/ loading/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Scheduled/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cold-chain alerts/i).length).toBeGreaterThan(0);
  });

  it("shows the default selected dispatch", () => {
    render(<DispatchOrders />);
    expect(screen.getAllByText(/DSP-2026-1124/).length).toBeGreaterThan(0);
  });

  it("can switch to a different dispatch by clicking the row", () => {
    render(<DispatchOrders />);
    const target = screen.getAllByText(/DSP-2026-1127/);
    fireEvent.click(target[0]);
    // After click the right-side panel should show the delivered banner.
    expect(screen.getAllByText(/Delivered/i).length).toBeGreaterThan(0);
  });
});
