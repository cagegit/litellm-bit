import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider, useI18n } from "./I18nContext";

function Consumer() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="interpolation">{t("common.currentExpiry", { expiry: "tomorrow" })}</span>
      <span data-testid="missing">{t("common.notARealKey")}</span>
      <button onClick={() => setLocale("zh")}>中文</button>
    </div>
  );
}

describe("I18nProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "litellm_locale=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.documentElement.lang = "";
  });

  it("uses English by default", () => {
    render(
      <I18nProvider>
        <Consumer />
      </I18nProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
  });

  it("prefers the cookie over localStorage", () => {
    localStorage.setItem("litellm_locale", "en");
    document.cookie = "litellm_locale=zh; path=/";
    render(
      <I18nProvider>
        <Consumer />
      </I18nProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("zh");
  });

  it("persists locale changes and updates the document language", () => {
    render(
      <I18nProvider>
        <Consumer />
      </I18nProvider>,
    );
    act(() => screen.getByRole("button", { name: "中文" }).click());
    expect(localStorage.getItem("litellm_locale")).toBe("zh");
    expect(document.cookie).toContain("litellm_locale=zh");
    expect(document.documentElement.lang).toBe("zh");
  });

  it("interpolates values and echoes missing keys", () => {
    render(
      <I18nProvider>
        <Consumer />
      </I18nProvider>,
    );
    expect(screen.getByTestId("interpolation")).toHaveTextContent("Current expiry: tomorrow");
    expect(screen.getByTestId("missing")).toHaveTextContent("common.notARealKey");
  });
});
