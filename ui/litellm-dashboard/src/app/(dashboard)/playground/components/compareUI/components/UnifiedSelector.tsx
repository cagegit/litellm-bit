/**
 * Unified selector component that handles both model and agent selection
 * based on the current endpoint configuration.
 */

import { Select, Spin } from "antd";
import { useTranslations } from "@/i18n";
import { SelectorOption, EndpointConfig } from "../endpoint_config";

interface UnifiedSelectorProps {
  value: string;
  options: SelectorOption[];
  loading: boolean;
  config: EndpointConfig;
  onChange: (value: string) => void;
}

export function UnifiedSelector({ value, options, loading, config, onChange }: UnifiedSelectorProps) {
  const { t } = useTranslations("playground");
  return (
    <Select
      value={value || undefined}
      placeholder={loading ? `${t("loading")} ${config.selectorLabel.toLowerCase()}s...` : config.selectorPlaceholder}
      onChange={onChange}
      loading={loading}
      showSearch
      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
      options={options}
      className="w-48 md:w-64 lg:w-72"
      notFoundContent={
        loading ? (
          <div className="flex items-center justify-center py-2">
            <Spin size="small" />
          </div>
        ) : (
          `${t("no")} ${config.selectorLabel.toLowerCase()}s ${t("available")}`
        )
      }
    />
  );
}
