"use client";
import { useTranslations } from "@/i18n";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PublicModelHubPage from "@/components/public_model_hub";

function PublicModelHubContent() {
  const searchParams = useSearchParams()!;
  const key = searchParams.get("key");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (!key) {
      return;
    }
    setAccessToken(key);
  }, [key]);

  return <PublicModelHubPage accessToken={accessToken} />;
}

export default function PublicModelHub() {
  const { t } = useTranslations("common");
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PublicModelHubContent />
    </Suspense>
  );
}
