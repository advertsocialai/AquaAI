import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommunityModule } from "@/components/dashboard/CommunityModule";

describe("<CommunityModule />", () => {
  it("renders the four section tabs", () => {
    render(<CommunityModule />);
    expect(screen.getByText(/District Forums/)).toBeInTheDocument();
    expect(screen.getByText(/Hatchery Leaderboard/)).toBeInTheDocument();
    expect(screen.getByText(/Success Stories/)).toBeInTheDocument();
    expect(screen.getByText(/VLE Directory/)).toBeInTheDocument();
  });

  it("filters districts by search", () => {
    render(<CommunityModule />);
    const input = screen.getByPlaceholderText(/Search districts/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Krishna" } });
    expect(screen.getByText(/Krishna/i)).toBeInTheDocument();
  });

  it("shows the hatchery leaderboard when clicked", () => {
    render(<CommunityModule />);
    fireEvent.click(screen.getByText(/Hatchery Leaderboard/));
    expect(screen.getByText(/Aquaprime Hatcheries/)).toBeInTheDocument();
  });
});
