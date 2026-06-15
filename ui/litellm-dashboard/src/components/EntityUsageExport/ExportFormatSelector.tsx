import React from "react";
import { Select } from "antd";
import { useTranslations } from "@/i18n";
import type { ExportFormat } from "./types";

interface ExportFormatSelectorProps {
  value: ExportFormat;
  onChange: (value: ExportFormat) => void;
}

const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslations("billing");
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">{t("format")}</label>
      <Select
        value={value}
        onChange={onChange}
        className="w-full"
        options={[
          {
            value: "csv",
            label: t("csvExcelGoogleSheets"),
          },
          {
            value: "json",
            label: t("jsonIncludesMetadata"),
          },
        ]}
      />
    </div>
  );
};

export default ExportFormatSelector;
