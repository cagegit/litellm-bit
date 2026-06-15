import React from "react";
import { Select } from "antd";
import { useTranslations } from "@/i18n";

const { Option } = Select;

interface BudgetDurationDropdownProps {
  value?: string | null;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const BudgetDurationDropdown: React.FC<BudgetDurationDropdownProps> = ({
  value,
  onChange,
  className = "",
  style = {},
}) => {
  const { t } = useTranslations("common");
  return (
    <Select
      style={{ width: "100%", ...style }}
      value={value || undefined}
      onChange={onChange}
      className={className}
      placeholder={t("notAvailable")}
      allowClear
    >
      <Option value="1h">{t("hourly")}</Option>
      <Option value="24h">{t("daily")}</Option>
      <Option value="7d">{t("weekly")}</Option>
      <Option value="30d">{t("monthly")}</Option>
    </Select>
  );
};

export const getBudgetDurationLabel = (value: string | null | undefined, t?: (key: string) => string): string => {
  if (!value) return t ? t("notSet") : "Not set";

  const budgetDurationMap: Record<string, string> = {
    "1h": "hourly",
    "24h": "daily",
    "7d": "weekly",
    "30d": "monthly",
  };

  const label = budgetDurationMap[value] || value;
  return t ? t(label as "hourly" | "daily" | "weekly" | "monthly") : label;
};

export default BudgetDurationDropdown;
