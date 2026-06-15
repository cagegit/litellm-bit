import { CodeOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Input, Space, Tabs, Typography } from "antd";
import ModelSelector from "@/components/common_components/ModelSelector";
import { TestResult } from "./semanticFilterTestUtils";
import { useTranslations } from "@/i18n";

interface MCPSemanticFilterTestPanelProps {
  accessToken: string | null;
  testQuery: string;
  setTestQuery: (value: string) => void;
  testModel: string;
  setTestModel: (value: string) => void;
  isTesting: boolean;
  onTest: () => void;
  filterEnabled: boolean;
  testResult: TestResult | null;
  curlCommand: string;
}

export default function MCPSemanticFilterTestPanel({
  accessToken,
  testQuery,
  setTestQuery,
  testModel,
  setTestModel,
  isTesting,
  onTest,
  filterEnabled,
  testResult,
  curlCommand,
}: MCPSemanticFilterTestPanelProps) {
  const { t } = useTranslations("settings");
  return (
    <Card title={t("testConfiguration")} style={{ marginBottom: 16 }}>
      <Tabs
        defaultActiveKey="test"
        items={[
          {
            key: "test",
            label: t("test"),
            children: (
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <div>
                  <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                    <PlayCircleOutlined /> {t("testQuery")}
                  </Typography.Text>
                  <Input.TextArea
                    placeholder={t("testQueryPlaceholder")}
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    rows={4}
                    disabled={isTesting}
                  />
                </div>

                <div>
                  <ModelSelector
                    accessToken={accessToken || ""}
                    value={testModel}
                    onChange={setTestModel}
                    disabled={isTesting}
                    showLabel={true}
                    labelText={t("selectModel")}
                  />
                </div>

                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={onTest}
                  loading={isTesting}
                  disabled={!testQuery || !testModel || !filterEnabled}
                  block
                >
                  {t("testFilter")}
                </Button>

                {!filterEnabled && (
                  <Alert
                    type="warning"
                    message={t("semanticFilterDisabled")}
                    description={t("semanticFilterDisabledDesc")}
                    showIcon
                  />
                )}

                {testResult && (
                  <div>
                    <Typography.Title level={5}>{t("results")}</Typography.Title>
                    <Alert
                      type="success"
                      message={t("toolsSelected", { count: testResult.selectedTools })}
                      description={t("filteredFromTools", { total: testResult.totalTools })}
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                    <div>
                      <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                        {t("selectedTools")}
                      </Typography.Text>
                      <ul style={{ paddingLeft: 20, margin: 0 }}>
                        {testResult.tools.map((tool, index) => (
                          <li key={index} style={{ marginBottom: 4 }}>
                            <Typography.Text>{tool}</Typography.Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Space>
            ),
          },
          {
            key: "api",
            label: t("apiUsage"),
            children: (
              <div>
                <Space style={{ marginBottom: 8 }}>
                  <CodeOutlined />
                  <Typography.Text strong>{t("apiUsage")}</Typography.Text>
                </Space>
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                  {t("apiUsageDescription")}
                </Typography.Text>
                <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                  {t("responseHeadersToCheck")}
                </Typography.Text>
                <ul style={{ paddingLeft: 20, margin: "0 0 12px 0" }}>
                  <li>
                    <Typography.Text>{t("semanticFilterHeader")}</Typography.Text>
                    <Typography.Text type="secondary" style={{ display: "block" }}>
                      {t("example10to3")}
                    </Typography.Text>
                  </li>
                  <li>
                    <Typography.Text>{t("semanticFilterToolsHeader")}</Typography.Text>
                    <Typography.Text type="secondary" style={{ display: "block" }}>
                      {t("exampleTools")}
                    </Typography.Text>
                  </li>
                </ul>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: 12,
                    borderRadius: 4,
                    overflow: "auto",
                    fontSize: 12,
                    margin: 0,
                  }}
                >
                  {curlCommand}
                </pre>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}
