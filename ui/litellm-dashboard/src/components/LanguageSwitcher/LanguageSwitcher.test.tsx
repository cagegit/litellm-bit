import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { I18nProvider } from "@/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("switches between English and Chinese without exposing translation keys", async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>,
    );
    const switcher = screen.getByRole("button", { name: "Switch Language" });
    expect(switcher).not.toHaveAccessibleName("common.switchLanguage");
    await user.click(switcher);
    await user.click(screen.getByRole("button", { name: "中文" }));
    expect(screen.getByRole("button", { name: "切换语言" })).toBeInTheDocument();
    expect(screen.queryByText("common.switchLanguage")).not.toBeInTheDocument();
  });
});
