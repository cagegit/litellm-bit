import * as React from "react";
import { useTranslations } from "@/i18n";

interface TimeCellProps {
  utcTime: string;
}

const getLocalTime = (utcTime: string, errorMessage: string): string => {
  try {
    const date = new Date(utcTime);
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  } catch (e) {
    return errorMessage;
  }
};

export const TimeCell: React.FC<TimeCellProps> = ({ utcTime }) => {
  const { t } = useTranslations("logs");
  return (
    <span
      style={{
        fontFamily: "monospace",
        width: "180px",
        display: "inline-block",
      }}
    >
      {getLocalTime(utcTime, t("errorConvertingTime"))}
    </span>
  );
};

export const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
