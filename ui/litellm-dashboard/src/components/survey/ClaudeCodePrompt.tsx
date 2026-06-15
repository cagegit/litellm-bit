import React from "react";
import { Code } from "lucide-react";
import { NudgePrompt } from "./NudgePrompt";
import { useTranslations } from "@/i18n";

interface ClaudeCodePromptProps {
  onOpen: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}

export function ClaudeCodePrompt({ onOpen, onDismiss, isVisible }: ClaudeCodePromptProps) {
  const { t } = useTranslations("survey");
  return (
    <NudgePrompt
      onOpen={onOpen}
      onDismiss={onDismiss}
      isVisible={isVisible}
      title={t("claudeCodeFeedback")}
      description={t("claudeCodePromptDesc")}
      buttonText={t("shareFeedback")}
      icon={Code}
      accentColor="#7c3aed"
      buttonStyle={{ backgroundColor: "#7c3aed", borderColor: "#7c3aed" }}
    />
  );
}
