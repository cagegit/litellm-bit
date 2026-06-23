import React from "react";
import { Card, Text } from "@tremor/react";
import { useTranslations } from "@/i18n";
import VariableTextArea from "../variable_textarea";

interface DeveloperMessageCardProps {
  value: string;
  onChange: (value: string) => void;
}

const DeveloperMessageCard: React.FC<DeveloperMessageCardProps> = ({ value, onChange }) => {
  const { t } = useTranslations("prompts");
  return (
    <Card className="p-3">
      <Text className="block mb-2 text-sm font-medium">{t("developerMessage")}</Text>
      <Text className="text-gray-500 text-xs mb-2">{t("optionalSystemInstructions")}</Text>
      <VariableTextArea value={value} onChange={onChange} rows={3} placeholder={t("developerMessagePlaceholder")} />
    </Card>
  );
};

export default DeveloperMessageCard;
