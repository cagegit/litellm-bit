import React from "react";
import { MessageSquare } from "lucide-react";
import { NudgePrompt } from "./NudgePrompt";
import { useTranslations } from "@/i18n";

interface SurveyPromptProps {
  onOpen: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}

export function SurveyPrompt({ onOpen, onDismiss, isVisible }: SurveyPromptProps) {
  const { t } = useTranslations("survey");
  return (
    <NudgePrompt
      onOpen={onOpen}
      onDismiss={onDismiss}
      isVisible={isVisible}
      title={t("quickFeedback")}
      description={t("surveyPromptDesc")}
      buttonText={t("shareFeedback")}
      icon={MessageSquare}
      accentColor="#3b82f6"
    />
  );
}
