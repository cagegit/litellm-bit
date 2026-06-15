import React from "react";
import { useTranslations } from "@/i18n";
import { Form, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

interface RateLimitTypeFormItemProps {
  /** The type of rate limit - either 'tpm' or 'rpm' */
  type: "tpm" | "rpm";
  /** The form field name */
  name: string;
  /** Whether to show detailed descriptions (default: true) */
  showDetailedDescriptions?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Initial value for the field */
  initialValue?: string | null;
  /** Form instance for setting field values */
  form?: any;
  /** Custom onChange handler */
  onChange?: (value: string) => void;
}

export const RateLimitTypeFormItem: React.FC<RateLimitTypeFormItemProps> = ({
  type,
  name,
  showDetailedDescriptions = true,
  className = "",
  initialValue = null,
  form,
  onChange,
}) => {
  const { t } = useTranslations("common");
  const limitTypeUpper = type.toUpperCase();
  const limitTypeLower = type.toLowerCase();

  const handleChange = (value: string) => {
    if (form) {
      form.setFieldValue(name, value);
    }
    if (onChange) {
      onChange(value);
    }
  };

  const tooltipTitle = t("rateLimitTypeTooltip", { type: limitTypeUpper });

  return (
    <Form.Item
      label={
        <span>
          {t("rateLimitType", { type: limitTypeUpper })}{" "}
          <Tooltip title={tooltipTitle}>
            <InfoCircleOutlined style={{ marginLeft: "4px" }} />
          </Tooltip>
        </span>
      }
      name={name}
      initialValue={initialValue}
      className={className}
    >
      <Select
        defaultValue={showDetailedDescriptions ? "default" : undefined}
        placeholder={t("selectRateLimitType")}
        style={{ width: "100%" }}
        optionLabelProp={showDetailedDescriptions ? "label" : undefined}
        onChange={handleChange}
      >
        {showDetailedDescriptions ? (
          <>
            <Option value="best_effort_throughput" label={t("defaultOption")}>
              <div style={{ padding: "4px 0" }}>
                <div style={{ fontWeight: 500 }}>{t("defaultOption")}</div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                  {t("bestEffortDescription", { type: limitTypeLower })}
                </div>
              </div>
            </Option>
            <Option value="guaranteed_throughput" label={t("guaranteedThroughput")}>
              <div style={{ padding: "4px 0" }}>
                <div style={{ fontWeight: 500 }}>{t("guaranteedThroughput")}</div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                  {t("guaranteedDescription", { type: limitTypeLower })}
                </div>
              </div>
            </Option>
            <Option value="dynamic" label={t("dynamic")}>
              <div style={{ padding: "4px 0" }}>
                <div style={{ fontWeight: 500 }}>{t("dynamic")}</div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                  {t("dynamicDescription", { type: limitTypeUpper })}
                </div>
              </div>
            </Option>
          </>
        ) : (
          <>
            <Option value="best_effort_throughput">{t("bestEffort")}</Option>
            <Option value="guaranteed_throughput">{t("guaranteedThroughput")}</Option>
            <Option value="dynamic">{t("dynamic")}</Option>
          </>
        )}
      </Select>
    </Form.Item>
  );
};

export default RateLimitTypeFormItem;
