"use client";

import React, { useState } from "react";
import { ToolDetail } from "@/components/ToolDetail";
import { ToolPolicies } from "@/components/ToolPolicies";
import { useTranslations } from "@/i18n";

type View = { type: "overview" } | { type: "detail"; toolName: string };

interface ToolPoliciesViewProps {
  accessToken: string | null;
  userRole?: string;
}

export default function ToolPoliciesView({ accessToken, userRole }: ToolPoliciesViewProps) {
  const [view, setView] = useState<View>({ type: "overview" });

  const handleSelectTool = (toolName: string) => {
  const { t } = useTranslations("settings");

    setView({ type: "detail", toolName });
  };

  const handleBack = () => {
    setView({ type: "overview" });
  };

  return (
    <div className="p-6 w-full min-w-0 flex-1">
      {view.type === "detail" ? (
        <ToolDetail toolName={view.toolName} onBack={handleBack} accessToken={accessToken} />
      ) : (
        <ToolPolicies accessToken={accessToken} userRole={userRole} onSelectTool={handleSelectTool} />
      )}
    </div>
  );
}
