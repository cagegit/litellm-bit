import { useTranslations } from "@/i18n";
import { Select } from "antd";

interface DurationSelectProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function DurationSelect({ className, value, onChange }: DurationSelectProps) {
  const { t } = useTranslations("common");
  return (
    <Select className={className} value={value} onChange={onChange}>
      <Select.Option value="24h">{t("daily")}</Select.Option>
      <Select.Option value="7d">{t("weekly")}</Select.Option>
      <Select.Option value="30d">{t("monthly")}</Select.Option>
    </Select>
  );
}
