import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KnowledgeHubModule } from "@/components/dashboard/KnowledgeHubModule";

describe("<KnowledgeHubModule />", () => {
  it("renders all six knowledge tabs", () => {
    render(<KnowledgeHubModule />);
    for (const label of ["Articles", "Videos", "Courses", "Research", "Diseases", "Species"]) {
      expect(screen.getByText(new RegExp(label))).toBeInTheDocument();
    }
  });

  it("filters items by search query", () => {
    render(<KnowledgeHubModule />);
    const input = screen.getByPlaceholderText(/Search knowledge hub/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "cyclone" } });
    expect(screen.getByText(/Cyclone season SOP/i)).toBeInTheDocument();
  });

  it("switches to the Diseases tab", () => {
    render(<KnowledgeHubModule />);
    fireEvent.click(screen.getByText(/Diseases/));
    expect(screen.getByText(/EHP — Enterocytozoon hepatopenaei/i)).toBeInTheDocument();
  });
});
