import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>,
  );
}

describe("<ForgotPasswordPage />", () => {
  it("starts on the mobile step", () => {
    renderPage();
    expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile number/i)).toBeInTheDocument();
  });

  it("disables Send code until a 10-digit number is entered", () => {
    renderPage();
    const btn = screen.getByRole("button", { name: /Send code/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.change(screen.getByPlaceholderText(/98765/), { target: { value: "9876543210" } });
    expect(btn.disabled).toBe(false);
  });
});
