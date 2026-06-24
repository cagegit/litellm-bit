import React from "react";
import { Alert, Button } from "antd";
import { useTranslations } from "@/i18n";

export function OnboardingErrorView() {
  const { t } = useTranslations("auth");
  return (
    <div className="mx-auto w-full max-w-md mt-10">
      <Alert
        type="error"
        message={t("failedToLoadInvitation")}
        description={t("invitationInvalidOrExpired")}
        showIcon
      />
      <div className="mt-4">
        <Button href="/ui/login">{t("backToLogin")}</Button>
      </div>
    </div>
  );
}
