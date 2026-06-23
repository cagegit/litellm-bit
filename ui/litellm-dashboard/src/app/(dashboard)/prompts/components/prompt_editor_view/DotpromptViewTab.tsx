import React from "react";
import { PromptType } from "./types";
import { convertToDotPrompt } from "./utils";
import { useTranslations } from "@/i18n";

interface DotpromptViewTabProps {
  prompt: PromptType;
}

const DotpromptViewTab: React.FC<DotpromptViewTabProps> = ({ prompt }) => {
  const { t } = useTranslations("prompts");

  const dotpromptContent = convertToDotPrompt(prompt);

  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t("prompts.generatedpromptFile")}</h3>
        <p className="text-xs text-gray-500">{t("prompts.thisIsTheDotpromptFormatThatWillBeSavedToTheDatabase")}</p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto">
        <pre className="text-sm text-gray-900 font-mono whitespace-pre-wrap">{dotpromptContent}</pre>
      </div>
    </div>
  );
};

export default DotpromptViewTab;
