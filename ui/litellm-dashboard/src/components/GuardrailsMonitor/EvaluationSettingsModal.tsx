import { CloseOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import { fetchAvailableModels, type ModelGroup } from "@/components/playground/llm_calls/fetch_models";
import { useTranslations } from "@/i18n";

const DEFAULT_PROMPT = `Evaluate whether this guardrail's decision was correct.
Analyze the user input, the guardrail action taken, and determine if it was appropriate.

Consider:
— Was the user's intent genuinely harmful or policy-violating?
— Was the guardrail's action (block / flag / pass) appropriate?
— Could this be a false positive or false negative?

Return a structured verdict with confidence and justification.`;

const DEFAULT_SCHEMA = `{
  "verdict": "correct" | "false_positive" | "false_negative",
  "confidence": 0.0,
  "justification": "string",
  "risk_category": "string",
  "suggested_action": "keep" | "adjust threshold" | "add allowlist"
}
`;

export interface EvaluationSettingsModalProps {
  open: boolean;
  onClose: () => void;
  guardrailName?: string;
  accessToken: string | null;
  onRunEvaluation?: (settings: { prompt: string; schema: string; model: string }) => void;
}

export function EvaluationSettingsModal({
  open,
  onClose,
  guardrailName,
  accessToken,
  onRunEvaluation,
}: EvaluationSettingsModalProps) {
  const { t } = useTranslations("logs");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [schema, setSchema] = useState(DEFAULT_SCHEMA);
  const [model, setModel] = useState<string | null>(null);
  const [modelOptions, setModelOptions] = useState<ModelGroup[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (!open || !accessToken) {
      setModelOptions([]);
      return;
    }
    let cancelled = false;
    setLoadingModels(true);
    fetchAvailableModels(accessToken)
      .then((list) => {
        if (!cancelled) setModelOptions(list);
      })
      .catch(() => {
        if (!cancelled) setModelOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, accessToken]);

  const handleResetPrompt = () => setPrompt(DEFAULT_PROMPT);
  const handleRun = () => {
    if (model) {
      onRunEvaluation?.({ prompt, schema, model });
      onClose();
    }
  };

  const modelSelectOptions = modelOptions.map((m) => ({
    value: m.model_group,
    label: m.model_group,
  }));

  return (
    <Modal
      title={t("evaluationSettings")}
      open={open}
      onCancel={onClose}
      width={640}
      footer={null}
      closeIcon={<CloseOutlined />}
      destroyOnClose
    >
      <p className="text-sm text-gray-500 mb-4">
        {guardrailName
          ? t("configureAiEvaluationFor", { name: guardrailName })
          : t("configureAiEvaluationForRerunning")}
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700">{t("evaluationPrompt")}</label>
            <button type="button" onClick={handleResetPrompt} className="text-xs text-indigo-600 hover:text-indigo-700">
              {t("resetToDefault")}
            </button>
          </div>
          <Input.TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">{t("systemPromptDescription")}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("responseSchema")}</label>
          <p className="text-xs text-gray-400 mb-1">{t("responseFormatDescription")}</p>
          <Input.TextArea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("model")}</label>
          <Select
            placeholder={loadingModels ? t("loadingModels") : t("selectAModel")}
            value={model ?? undefined}
            onChange={setModel}
            options={modelSelectOptions}
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="label"
            loading={loadingModels}
            notFoundContent={!accessToken ? t("signInToSeeModels") : t("noModelsAvailable")}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleRun} disabled={!model}>
          {t("runEvaluation")}
        </Button>
      </div>
    </Modal>
  );
}
