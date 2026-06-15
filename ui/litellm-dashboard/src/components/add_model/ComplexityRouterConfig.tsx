import { InfoCircleOutlined } from "@ant-design/icons";
import { Select as AntdSelect, Card, Divider, Space, Tooltip, Typography } from "antd";
import React from "react";
import { ModelGroup } from "../playground/llm_calls/fetch_models";
import { useTranslations } from "@/i18n";

const { Text } = Typography;

interface ComplexityTiers {
  SIMPLE: string;
  MEDIUM: string;
  COMPLEX: string;
  REASONING: string;
}

interface ComplexityRouterConfigProps {
  modelInfo: ModelGroup[];
  value: ComplexityTiers;
  onChange: (tiers: ComplexityTiers) => void;
}

const TIER_DESCRIPTIONS: Record<keyof ComplexityTiers, { label: string; description: string; examples: string }> = {
  SIMPLE: {
    label: "Simple",
    description: "Basic questions, greetings, simple factual queries",
    examples: '"Hello!", "What is Python?", "Thanks!"',
  },
  MEDIUM: {
    label: "Medium",
    description: "Standard queries requiring some reasoning or explanation",
    examples: '"Explain how REST APIs work", "Debug this error"',
  },
  COMPLEX: {
    label: "Complex",
    description: "Technical, multi-part requests requiring deep knowledge",
    examples: '"Design a microservices architecture", "Implement a rate limiter"',
  },
  REASONING: {
    label: "Reasoning",
    description: "Chain-of-thought, analysis, explicit reasoning requests",
    examples: '"Think step by step...", "Analyze the pros and cons..."',
  },
};

const ComplexityRouterConfig: React.FC<ComplexityRouterConfigProps> = ({ modelInfo, value, onChange }) => {
  const { t } = useTranslations("models");
  // Prepare model options for dropdowns
  const modelOptions = modelInfo.map((model) => ({
    value: model.model_group,
    label: model.model_group,
  }));

  const handleTierChange = (tier: keyof ComplexityTiers, model: string) => {
    onChange({
      ...value,
      [tier]: model,
    });
  };

  return (
    <div className="w-full max-w-none">
      <Space align="center" style={{ marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {t("complexityTierConfiguration")}
        </Typography.Title>
        <Tooltip title={t("complexityTierTooltip")}>
          <InfoCircleOutlined className="text-gray-400" />
        </Tooltip>
      </Space>

      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        {t("complexityRouterDescription")}
      </Text>

      <Card>
        {(Object.keys(TIER_DESCRIPTIONS) as Array<keyof ComplexityTiers>).map((tier, index) => {
          const tierInfo = TIER_DESCRIPTIONS[tier];
          return (
            <div key={tier}>
              {index > 0 && <Divider style={{ margin: "16px 0" }} />}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Text strong style={{ fontSize: 16 }}>
                    {tierInfo.label} {t("tier")}
                  </Text>
                  <Tooltip title={tierInfo.description}>
                    <InfoCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ display: "block", marginBottom: 8, fontSize: 12 }}>
                  {t("examples")}: {tierInfo.examples}
                </Text>
                <AntdSelect
                  value={value[tier]}
                  onChange={(model) => handleTierChange(tier, model)}
                  placeholder={t("selectModelFor", { tier: tierInfo.label.toLowerCase() })}
                  showSearch
                  style={{ width: "100%" }}
                  options={modelOptions}
                />
              </div>
            </div>
          );
        })}
      </Card>

      <Divider />

      <Card className="bg-gray-50">
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          {t("howClassificationWorks")}
        </Text>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {t("classificationDescription")}
        </Text>
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20, fontSize: 13, color: "rgba(0, 0, 0, 0.45)" }}>
          <li>
            <strong>SIMPLE</strong>: {t("scoreLessThan015")}
          </li>
          <li>
            <strong>MEDIUM</strong>: {t("score015To035")}
          </li>
          <li>
            <strong>COMPLEX</strong>: {t("score035To060")}
          </li>
          <li>
            <strong>REASONING</strong>: {t("scoreGreaterThan060")}
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default ComplexityRouterConfig;
