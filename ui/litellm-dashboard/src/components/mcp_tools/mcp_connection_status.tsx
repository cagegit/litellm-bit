import React from "react";
import { useTranslations } from "@/i18n";
import { Button, Spin, Alert, Collapse } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, ToolOutlined } from "@ant-design/icons";
import { Card, Title, Text } from "@tremor/react";

interface MCPConnectionStatusProps {
  formValues: Record<string, any>;
  tools: any[];
  isLoadingTools: boolean;
  toolsError: string | null;
  toolsErrorStackTrace: string | null;
  canFetchTools: boolean;
  fetchTools: () => Promise<void>;
}

const MCPConnectionStatus: React.FC<MCPConnectionStatusProps> = ({
  formValues,
  tools,
  isLoadingTools,
  toolsError,
  toolsErrorStackTrace,
  canFetchTools,
  fetchTools,
}) => {
  const { t } = useTranslations("mcp");

  // Don't show anything if required fields aren't filled
  if (!canFetchTools && !formValues.url && !formValues.spec_path) {
    return null;
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircleOutlined className="text-blue-600" />
          <Title>{t("connectionStatus")}</Title>
        </div>

        {!canFetchTools && (formValues.url || formValues.spec_path) && (
          <div className="text-center py-6 text-gray-400 border rounded-lg border-dashed">
            <ToolOutlined className="text-2xl mb-2" />
            <Text>{t("completeRequiredFields")}</Text>
            <br />
            <Text className="text-sm">{t("fillInDetails")}</Text>
          </div>
        )}

        {canFetchTools && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Text className="text-gray-700 font-medium">
                  {isLoadingTools
                    ? t("testingConnection")
                    : tools.length > 0
                      ? t("connectionSuccessful")
                      : toolsError
                        ? t("connectionFailed")
                        : t("readyToTest")}
                </Text>
                <br />
                <Text className="text-gray-500 text-sm">
                  {t("serverLabel")}: {formValues.url || formValues.spec_path}
                </Text>
              </div>

              {isLoadingTools && (
                <div className="flex items-center text-blue-600">
                  <Spin size="small" className="mr-2" />
                  <Text className="text-blue-600">{t("connecting")}</Text>
                </div>
              )}

              {!isLoadingTools && !toolsError && tools.length > 0 && (
                <div className="flex items-center text-green-600">
                  <CheckCircleOutlined className="mr-1" />
                  <Text className="text-green-600 font-medium">{t("connected")}</Text>
                </div>
              )}

              {toolsError && (
                <div className="flex items-center text-red-600">
                  <ExclamationCircleOutlined className="mr-1" />
                  <Text className="text-red-600 font-medium">{t("failed")}</Text>
                </div>
              )}
            </div>

            {isLoadingTools && (
              <div className="flex items-center justify-center py-6">
                <Spin size="large" />
                <Text className="ml-3">{t("testingAndLoading")}</Text>
              </div>
            )}

            {toolsError && (
              <Alert
                message={t("connectionFailedTitle")}
                description={
                  <div>
                    <div>{toolsError}</div>
                    {toolsErrorStackTrace && (
                      <Collapse
                        items={[
                          {
                            key: "stack-trace",
                            label: t("stackTrace"),
                            children: (
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                  fontSize: "12px",
                                  fontFamily: "monospace",
                                  margin: 0,
                                  padding: "8px",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "4px",
                                  maxHeight: "400px",
                                  overflow: "auto",
                                }}
                              >
                                {toolsErrorStackTrace}
                              </pre>
                            ),
                          },
                        ]}
                        style={{ marginTop: "12px" }}
                      />
                    )}
                  </div>
                }
                type="error"
                showIcon
                action={
                  <Button icon={<ReloadOutlined />} onClick={fetchTools} size="small">
                    {t("retry")}
                  </Button>
                }
              />
            )}

            {!isLoadingTools && tools.length === 0 && !toolsError && (
              <div className="text-center py-6 text-gray-500 border rounded-lg border-dashed">
                <CheckCircleOutlined className="text-2xl mb-2 text-green-500" />
                <Text className="text-green-600 font-medium">{t("connectionSuccessfulExcl")}</Text>
                <br />
                <Text className="text-gray-500">{t("noToolsFound")}</Text>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MCPConnectionStatus;
