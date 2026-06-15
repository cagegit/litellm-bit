import React, { useState } from "react";
import { Select, Tooltip, Divider, Switch, Checkbox } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { TextInput } from "@tremor/react";
import { useTranslations } from "@/i18n";

const { Option } = Select;

interface KeyLifecycleSettingsProps {
  form: any; // Form instance from parent
  autoRotationEnabled: boolean;
  onAutoRotationChange: (enabled: boolean) => void;
  rotationInterval: string;
  onRotationIntervalChange: (interval: string) => void;
  isCreateMode?: boolean; // If true, shows "leave empty to never expire" instead of "-1 to never expire"
  neverExpire?: boolean;
  onNeverExpireChange?: (checked: boolean) => void;
}

const KeyLifecycleSettings: React.FC<KeyLifecycleSettingsProps> = ({
  form,
  autoRotationEnabled,
  onAutoRotationChange,
  rotationInterval,
  onRotationIntervalChange,
  isCreateMode = false,
  neverExpire = false,
  onNeverExpireChange,
}) => {
  const { t } = useTranslations("common");

  // Predefined intervals
  const predefinedIntervals = ["7d", "30d", "90d", "180d", "365d"];

  // Check if current interval is custom
  const isCustomInterval = rotationInterval && !predefinedIntervals.includes(rotationInterval);

  const [showCustomInput, setShowCustomInput] = useState(isCustomInterval);
  const [customInterval, setCustomInterval] = useState(isCustomInterval ? rotationInterval : "");
  const [durationValue, setDurationValue] = useState<string>(form?.getFieldValue?.("duration") || "");

  const handleIntervalChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInput(true);
      // Don't change the actual interval yet, wait for custom input
    } else {
      setShowCustomInput(false);
      setCustomInterval("");
      onRotationIntervalChange(value);
    }
  };

  const handleCustomIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomInterval(value);
    onRotationIntervalChange(value);
  };

  const handleDurationChange = (value: string) => {
    setDurationValue(value);
    if (form && typeof form.setFieldValue === "function") {
      form.setFieldValue("duration", value);
    } else if (form && typeof form.setFieldsValue === "function") {
      form.setFieldsValue({ duration: value });
    }
  };
  return (
    <div className="space-y-6">
      {/* Key Expiry Section */}
      <div className="space-y-4">
        <span className="text-sm font-medium text-gray-700">{t("keyExpirySettings")}</span>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
            <span>{t("expireKey")}</span>
            <Tooltip title={t("expireKeyTooltip")}>
              <InfoCircleOutlined className="text-gray-400 cursor-help text-xs" />
            </Tooltip>
            {!isCreateMode && onNeverExpireChange && (
              <Checkbox
                checked={neverExpire}
                onChange={(e) => {
                  const checked = e.target.checked;
                  onNeverExpireChange(checked);
                  if (checked) {
                    setDurationValue("");
                    if (form && typeof form.setFieldValue === "function") {
                      form.setFieldValue("duration", "");
                    } else if (form && typeof form.setFieldsValue === "function") {
                      form.setFieldsValue({ duration: "" });
                    }
                  }
                }}
                className="ml-2 text-sm font-normal text-gray-600"
              >
                {t("neverExpire")}
              </Checkbox>
            )}
          </label>
          <TextInput
            name="duration"
            placeholder={isCreateMode ? t("expireKeyPlaceholderCreate") : t("expireKeyPlaceholderEdit")}
            className="w-full"
            value={durationValue}
            onValueChange={handleDurationChange}
            disabled={!isCreateMode && neverExpire}
          />
        </div>
      </div>

      <Divider />

      {/* Auto-Rotation Section */}
      <div className="space-y-4">
        <span className="text-sm font-medium text-gray-700">{t("autoRotationSettings")}</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
              <span>{t("enableAutoRotation")}</span>
              <Tooltip title={t("enableAutoRotationTooltip")}>
                <InfoCircleOutlined className="text-gray-400 cursor-help text-xs" />
              </Tooltip>
            </label>
            <Switch
              checked={autoRotationEnabled}
              onChange={onAutoRotationChange}
              size="default"
              className={autoRotationEnabled ? "" : "bg-gray-400"}
            />
          </div>

          {autoRotationEnabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <span>{t("rotationInterval")}</span>
                <Tooltip title={t("rotationIntervalTooltip")}>
                  <InfoCircleOutlined className="text-gray-400 cursor-help text-xs" />
                </Tooltip>
              </label>
              <div className="space-y-2">
                <Select
                  value={showCustomInput ? "custom" : rotationInterval}
                  onChange={handleIntervalChange}
                  className="w-full"
                  placeholder={t("selectInterval")}
                >
                  <Option value="7d">{t("interval7d")}</Option>
                  <Option value="30d">{t("interval30d")}</Option>
                  <Option value="90d">{t("interval90d")}</Option>
                  <Option value="180d">{t("interval180d")}</Option>
                  <Option value="365d">{t("interval365d")}</Option>
                  <Option value="custom">{t("customInterval")}</Option>
                </Select>

                {showCustomInput && (
                  <div className="space-y-1">
                    <TextInput
                      value={customInterval}
                      onChange={handleCustomIntervalChange}
                      placeholder={t("customIntervalPlaceholder")}
                    />
                    <div className="text-xs text-gray-500">{t("supportedFormats")}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {autoRotationEnabled && (
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">{t("rotationNotification")}</div>
        )}
      </div>
    </div>
  );
};

export default KeyLifecycleSettings;
