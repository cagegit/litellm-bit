"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Locale, I18nContextType } from "./types";
import enMessages from "./messages/en.json";
import zhMessages from "./messages/zh.json";

const LOCALE_COOKIE_NAME = "litellm_locale";
const STORAGE_KEY = "litellm_locale";

const messagesByLocale: Record<Locale, typeof enMessages> = {
  en: enMessages,
  zh: zhMessages,
};

// Utility: resolve nested key path "common.loading" -> value
function resolveMessage(messages: typeof enMessages, key: string): string {
  const parts = key.split(".");
  let current: any = messages;
  for (const part of parts) {
    if (current == null) {
      console.warn(`[i18n] Key path broken at "${key}"`);
      return key;
    }
    current = current[part];
  }
  if (typeof current === "string") return current;
  console.warn(`[i18n] Key "${key}" resolved to non-string`);
  return key;
}

// Replace {param} placeholders in translation strings
function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => (params[key] != null ? String(params[key]) : `{${key}}`));
}

function getLocaleFromStorage(): Locale | null {
  // Try cookie first
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(^| )${LOCALE_COOKIE_NAME}=([^;]+)`));
    if (match) {
      const value = match[2] as Locale;
      if (value === "en" || value === "zh") return value;
    }
  }
  // Try localStorage
  if (typeof localStorage !== "undefined") {
    const value = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (value && (value === "en" || value === "zh")) return value;
  }
  return null;
}

function setLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString(); // 1 year
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};expires=${expires};path=/;SameSite=Lax`;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function I18nProvider({ children, defaultLocale = "en" }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = getLocaleFromStorage();
    return stored || defaultLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleCookie(newLocale);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }, []);

  // Sync html lang attribute
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = useCallback(
    <T extends string>(key: T, params?: Record<string, string | number>) => {
      const currentMessages = messagesByLocale[locale];
      const raw = resolveMessage(currentMessages, key);
      return interpolate(raw, params);
    },
    [locale],
  );

  const currentMessages = messagesByLocale[locale];

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    messages: currentMessages,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook to access the full i18n context (locale, setLocale, t, messages)
 */
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

/**
 * Hook to get the translation function for a specific namespace.
 * Usage: const { t } = useTranslations('common');
 * Then: t('loading') resolves to 'common.loading'
 */
export function useTranslations(namespace: string) {
  const { t: globalT, locale } = useI18n();

  const t = useCallback(
    <T extends string>(key: T, params?: Record<string, string | number>) => {
      const fullKey = `${namespace}.${key}`;
      return globalT(fullKey, params);
    },
    [namespace, globalT],
  );

  return { t, locale };
}

/**
 * Hook to get and set the current locale.
 * Usage: const { locale, setLocale } = useLocale();
 */
export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
