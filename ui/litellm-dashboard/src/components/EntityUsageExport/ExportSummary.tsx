import React from "react";
import type { DateRangePickerValue } from "@tremor/react";
import { useTranslations } from "@/i18n";

interface ExportSummaryProps {
  dateRange: DateRangePickerValue;
  selectedFilters: string[];
}

const ExportSummary: React.FC<ExportSummaryProps> = ({ dateRange, selectedFilters }) => {
  const { t } = useTranslations("billing");
  return (
    <div className="text-sm text-gray-500">
      {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
      {selectedFilters.length > 0 && <> · {t("filterCount", { count: selectedFilters.length })}</>}
    </div>
  );
};

export default ExportSummary;
