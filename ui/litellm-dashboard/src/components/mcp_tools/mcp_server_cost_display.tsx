import React from "react";
import { Text } from "@tremor/react";
import { MCPServerCostInfo } from "./types";
import { useTranslations } from "@/i18n";

interface MCPServerCostDisplayProps {
  costConfig?: MCPServerCostInfo | null;
}

const MCPServerCostDisplay: React.FC<MCPServerCostDisplayProps> = ({ costConfig }) => {
  const { t } = useTranslations("mcp");

  const hasDefaultCost =
    costConfig?.default_cost_per_query !== undefined && costConfig?.default_cost_per_query !== null;
  const hasToolCosts =
    costConfig?.tool_name_to_cost_per_query && Object.keys(costConfig.tool_name_to_cost_per_query).length > 0;
  const hasCostConfig = hasDefaultCost || hasToolCosts;

  if (!hasCostConfig) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Text className="text-gray-600">
              {t("noCostConfigurationSetForThisServerToolCallsWillBeChargedAt000PerToolCall")}
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="space-y-4">
        {hasDefaultCost &&
          costConfig?.default_cost_per_query !== undefined &&
          costConfig?.default_cost_per_query !== null && (
            <div>
              <Text className="font-medium">{t("defaultCostPerQuery")}</Text>
              <div className="text-green-600 font-mono">${costConfig.default_cost_per_query.toFixed(4)}</div>
            </div>
          )}

        {hasToolCosts && costConfig?.tool_name_to_cost_per_query && (
          <div>
            <Text className="font-medium">{t("toolSpecificCosts")}</Text>
            <div className="mt-2 space-y-2">
              {Object.entries(costConfig.tool_name_to_cost_per_query).map(
                ([toolName, cost]) =>
                  cost !== null &&
                  cost !== undefined && (
                    <div key={toolName} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <Text className="font-medium">{toolName}</Text>
                      <Text className="text-green-600 font-mono">
                        ${cost.toFixed(4)} {t("perQuery")}
                      </Text>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-blue-800 font-medium">{t("costSummary")}</Text>
          <div className="mt-2 space-y-1">
            {hasDefaultCost &&
              costConfig?.default_cost_per_query !== undefined &&
              costConfig?.default_cost_per_query !== null && (
                <Text className="text-blue-700">
                  {t("defaultCost")}
                  {costConfig.default_cost_per_query.toFixed(4)} {t("perQuery")}
                </Text>
              )}
            {hasToolCosts && costConfig?.tool_name_to_cost_per_query && (
              <Text className="text-blue-700">
                • {Object.keys(costConfig.tool_name_to_cost_per_query).length} {t("toolSWithCustomPricing")}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPServerCostDisplay;
