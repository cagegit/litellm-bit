"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale, Locale } from "@/i18n";
import { GlobalOutlined, CheckOutlined } from "@ant-design/icons";
import { useTranslations } from "@/i18n";

export function LanguageSwitcher() {
  const { t } = useTranslations("common");

  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: "English" },
    { value: "zh", label: "中文" },
  ];

  const currentLabel = options.find((o) => o.value === locale)?.label || "English";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSwitch = (newLocale: Locale) => {
    setLocale(newLocale);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        title={t("switchLanguage")}
        aria-label={t("switchLanguage")}
      >
        <GlobalOutlined />
        <span className="hidden sm:inline">{currentLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSwitch(option.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                locale === option.value ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {locale === option.value && <CheckOutlined className="text-xs" />}
              <span className={locale === option.value ? "font-medium" : ""}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
