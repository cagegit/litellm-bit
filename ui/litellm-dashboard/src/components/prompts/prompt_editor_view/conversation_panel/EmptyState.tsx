import React from "react";
import { RobotOutlined } from "@ant-design/icons";
import { useTranslations } from "@/i18n";

interface EmptyStateProps {
  hasVariables: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasVariables }) => {
  const { t } = useTranslations("prompts");
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400">
      <RobotOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
      <span className="text-base">{hasVariables ? t("fillVariablesToTest") : t("typeMessageToTest")}</span>
    </div>
  );
};

export default EmptyState;
