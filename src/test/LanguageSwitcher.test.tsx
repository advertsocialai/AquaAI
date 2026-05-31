import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import i18n from "@/lib/i18n";

describe("<LanguageSwitcher />", () => {
  it("opens the dropdown and lists all five languages", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /change language/i }));
    // Native names are unique per language; pick those.
    expect(screen.getByText("తెలుగు")).toBeInTheDocument();
    expect(screen.getByText("हिन्दी")).toBeInTheDocument();
    expect(screen.getByText("ଓଡ଼ିଆ")).toBeInTheDocument();
    expect(screen.getByText("বাংলা")).toBeInTheDocument();
    // "English" appears twice in the row (native + name) — getAllByText is fine.
    expect(screen.getAllByText("English").length).toBeGreaterThan(0);
  });

  it("switches the active language when an option is clicked", async () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /change language/i }));
    fireEvent.click(screen.getByText("తెలుగు"));
    expect(i18n.resolvedLanguage).toBe("te");
  });
});
