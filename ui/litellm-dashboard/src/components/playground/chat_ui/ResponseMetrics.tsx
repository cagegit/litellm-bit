import React from "react";
import { Tooltip } from "antd";
import { useTranslations } from "@/i18n";
import {
  ClockCircleOutlined,
  NumberOutlined,
  ImportOutlined,
  ExportOutlined,
  BulbOutlined,
  ToolOutlined,
  DollarOutlined,
} from "@ant-design/icons";

export interface TokenUsage {
  completionTokens?: number;
  promptTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
  cost?: number;
}

interface ResponseMetricsProps {
  timeToFirstToken?: number;
  totalLatency?: number;
  usage?: TokenUsage;
  toolName?: string;
}

const ResponseMetrics: React.FC<ResponseMetricsProps> = ({ timeToFirstToken, totalLatency, usage, toolName }) => {
  const { t } = useTranslations("playground");
  if (!timeToFirstToken && !totalLatency && !usage) return null;

  return (
    <div className="response-metrics mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-3">
      {timeToFirstToken !== undefined && (
        <Tooltip title={t("timeToFirstToken")}>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <span>
              {t("ttft")}: {(timeToFirstToken / 1000).toFixed(2)}
              {t("secondsShort")}
            </span>
          </div>
        </Tooltip>
      )}

      {totalLatency !== undefined && (
        <Tooltip title={t("totalLatency")}>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <span>
              {t("totalLatencyLabel")}: {(totalLatency / 1000).toFixed(2)}
              {t("secondsShort")}
            </span>
          </div>
        </Tooltip>
      )}

      {usage?.promptTokens !== undefined && (
        <Tooltip title={t("promptTokens")}>
          <div className="flex items-center">
            <ImportOutlined className="mr-1" />
            <span>
              {t("in")}: {usage.promptTokens}
            </span>
          </div>
        </Tooltip>
      )}

      {usage?.completionTokens !== undefined && (
        <Tooltip title={t("completionTokens")}>
          <div className="flex items-center">
            <ExportOutlined className="mr-1" />
            <span>
              {t("out")}: {usage.completionTokens}
            </span>
          </div>
        </Tooltip>
      )}

      {usage?.reasoningTokens !== undefined && (
        <Tooltip title={t("reasoningTokens")}>
          <div className="flex items-center">
            <BulbOutlined className="mr-1" />
            <span>
              {t("reasoning")}: {usage.reasoningTokens}
            </span>
          </div>
        </Tooltip>
      )}

      {usage?.totalTokens !== undefined && (
        <Tooltip title={t("totalTokens")}>
          <div className="flex items-center">
            <NumberOutlined className="mr-1" />
            <span>
              {t("total")}: {usage.totalTokens}
            </span>
          </div>
        </Tooltip>
      )}

      {usage?.cost !== undefined && (
        <Tooltip title={t("cost")}>
          <div className="flex items-center">
            <DollarOutlined className="mr-1" />
            <span>${usage.cost.toFixed(6)}</span>
          </div>
        </Tooltip>
      )}

      {toolName && (
        <Tooltip title={t("toolUsed")}>
          <div className="flex items-center">
            <ToolOutlined className="mr-1" />
            <span>
              {t("tool")}: {toolName}
            </span>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default ResponseMetrics;
