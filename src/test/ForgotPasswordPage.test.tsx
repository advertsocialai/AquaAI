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
  it("starts on the email step", () => {
    renderPage();
    expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
  });

  it("disables Send reset link until a valid email is entered", () => {
    renderPage();
    const btn = screen.getByRole("button", { name: /Send reset link/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/), { target: { value: "farmer@example.com" } });
    expect(btn.disabled).toBe(false);
  });
});
