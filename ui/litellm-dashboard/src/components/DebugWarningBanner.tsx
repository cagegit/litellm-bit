"use client";

import React from "react";
import { Alert } from "antd";
import { useTranslations } from "@/i18n";
import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";

interface DebugWarningBannerProps {
  accessToken: string | null;
}

export const DebugWarningBanner: React.FC<DebugWarningBannerProps> = ({ accessToken }) => {
  const { t } = useTranslations("common");
  const { data: healthData } = useHealthReadinessDetails(accessToken);

  // Only show banner if detailed debug mode is explicitly enabled
  if (!healthData?.is_detailed_debug) {
    return null;
  }

  return (
    <Alert
      message={t("debugModeWarning")}
      description={
        <>
          {t("debugModeDescriptionPart1")} (<code>LITELLM_LOG=DEBUG</code>) {t("debugModeDescriptionPart2")}
        </>
      }
      type="warning"
      showIcon
      banner
      style={{ marginBottom: 0, borderRadius: 0 }}
    />
  );
};
