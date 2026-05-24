import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RoleSelector, ROLES } from "@/components/dashboard/RoleSelector";

describe("<RoleSelector />", () => {
  it("renders every role from the registry", () => {
    render(<RoleSelector role="farmer" onChange={() => {}} />);
    for (const r of ROLES) {
      expect(screen.getByText(r.label)).toBeInTheDocument();
    }
  });

  it("calls onChange with the selected role id", () => {
    const onChange = vi.fn();
    render(<RoleSelector role="farmer" onChange={onChange} />);
    fireEvent.click(screen.getByText("Hatchery"));
    expect(onChange).toHaveBeenCalledWith("hatchery");
  });
});
