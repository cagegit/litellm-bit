import { useTranslations } from "@/i18n";
import { Button, InputNumber, Select } from "antd";
import React from "react";

export interface BudgetWindowEntry {
  budget_duration: string;
  max_budget: number | null;
}

export const BUDGET_WINDOW_OPTIONS = [
  { value: "1h", labelKey: "hourly", resetHintKey: "resetsEveryHour" },
  { value: "24h", labelKey: "daily", resetHintKey: "resetsDaily" },
  { value: "7d", labelKey: "weekly", resetHintKey: "resetsWeekly" },
  { value: "30d", labelKey: "monthly", resetHintKey: "resetsMonthly" },
];

interface BudgetWindowsEditorProps {
  value: BudgetWindowEntry[];
  onChange: (v: BudgetWindowEntry[]) => void;
}

export function BudgetWindowsEditor({ value, onChange }: BudgetWindowsEditorProps) {
  const { t } = useTranslations("keys");
  const addWindow = () => {
    onChange([...value, { budget_duration: "24h", max_budget: null }]);
  };

  const removeWindow = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const updateWindow = (idx: number, field: keyof BudgetWindowEntry, fieldValue: string | number | null) => {
    const updated = value.map((w, i) => (i === idx ? { ...w, [field]: fieldValue } : w));
    onChange(updated);
  };

  return (
    <div>
      {value.map((window, idx) => {
        const hintKey = BUDGET_WINDOW_OPTIONS.find((o) => o.value === window.budget_duration)?.resetHintKey;
        return (
          <div key={idx} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Select
                value={window.budget_duration}
                onChange={(v) => updateWindow(idx, "budget_duration", v)}
                style={{ width: 130 }}
                options={BUDGET_WINDOW_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
              />
              <InputNumber
                step={0.01}
                min={0}
                precision={2}
                value={window.max_budget ?? undefined}
                onChange={(v) => updateWindow(idx, "max_budget", v ?? null)}
                placeholder={t("maxSpend")}
                style={{ width: 160 }}
                prefix="$"
              />
              <Button type="text" danger size="small" onClick={() => removeWindow(idx)} style={{ padding: "0 4px" }}>
                ✕
              </Button>
            </div>
            {hintKey && <div style={{ fontSize: 11, color: "#888", marginTop: 3, marginLeft: 2 }}>↻ {t(hintKey)}</div>}
          </div>
        );
      })}
      <Button
        size="small"
        onClick={(e) => {
          e.preventDefault();
          addWindow();
        }}
      >
        {t("addBudgetWindow")}
      </Button>
    </div>
  );
}
