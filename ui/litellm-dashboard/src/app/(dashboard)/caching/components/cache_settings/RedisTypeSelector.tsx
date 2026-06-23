import React from "react";
import { Select, SelectItem } from "@tremor/react";
import { useTranslations } from "@/i18n";

interface RedisTypeSelectorProps {
  redisType: string;
  redisTypeDescriptions: { [key: string]: string };
  onTypeChange: (type: string) => void;
}

const RedisTypeSelector: React.FC<RedisTypeSelectorProps> = ({ redisType, redisTypeDescriptions, onTypeChange }) => {
  const { t } = useTranslations("settings");
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{t("redisType")}</label>
      <Select value={redisType} onValueChange={onTypeChange}>
        <SelectItem value="node">{t("nodeSingleInstance")}</SelectItem>
        <SelectItem value="cluster">{t("cluster")}</SelectItem>
        <SelectItem value="sentinel">{t("sentinel")}</SelectItem>
        <SelectItem value="semantic">{t("semantic")}</SelectItem>
      </Select>
      <p className="text-xs text-gray-500">{redisTypeDescriptions[redisType] || t("selectRedisType")}</p>
    </div>
  );
};

export default RedisTypeSelector;
