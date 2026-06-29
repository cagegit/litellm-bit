import React, { useState, useEffect } from "react";
import { Card, Title, Text, Grid, Button as TremorButton, Callout, TextInput, Divider } from "@tremor/react";
import { Form } from "antd";
import { useTranslations } from "@/i18n";
import { keyCreateCall } from "./networking";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  LinkOutlined,
  KeyOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import NotificationsManager from "./molecules/notifications_manager";

interface SCIMConfigProps {
  accessToken: string | null;
  userID: string | null;
  proxySettings: any;
}

const SCIMConfig: React.FC<SCIMConfigProps> = ({ accessToken, userID, proxySettings }) => {
  const { t } = useTranslations("users");
  const [form] = Form.useForm();
  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [baseUrl, setBaseUrl] = useState("<your_proxy_base_url>");

  useEffect(() => {
    let url = "<your_proxy_base_url>";

    if (proxySettings && proxySettings.PROXY_BASE_URL && proxySettings.PROXY_BASE_URL !== undefined) {
      url = proxySettings.PROXY_BASE_URL;
    } else if (typeof window !== "undefined") {
      // Use the current origin as the base URL if no proxy URL is set
      url = window.location.origin;
    }

    setBaseUrl(url);
  }, [proxySettings]);

  const scimBaseUrl = `${baseUrl}/scim/v2`;

  const handleCreateSCIMToken = async (values: any) => {
    if (!accessToken || !userID) {
      NotificationsManager.fromBackend(t("youNeedToBeLoggedIn"));
      return;
    }

    try {
      setIsCreatingToken(true);

      const formData = {
        key_alias: values.key_alias || "SCIM Access Token",
        team_id: null,
        models: [],
        allowed_routes: ["/scim/*"],
      };

      const response = await keyCreateCall(accessToken, userID, formData);
      setTokenData(response);
      NotificationsManager.success(t("scimTokenCreatedSuccessfully"));
    } catch (error: any) {
      console.error("Error creating SCIM token:", error);
      NotificationsManager.fromBackend(t("failedToCreateScimToken"));
    } finally {
      setIsCreatingToken(false);
    }
  };

  return (
    <Grid numItems={1}>
      <Card>
        <div className="flex items-center mb-4">
          <Title>{t("scimConfiguration")}</Title>
        </div>
        <Text className="text-gray-600">{t("scimDescription")}</Text>

        <Divider />

        <div className="space-y-8">
          {/* Step 1: SCIM URL */}
          <div>
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 mr-2">
                1
              </div>
              <Title className="text-lg flex items-center">
                <LinkOutlined className="h-5 w-5 mr-2" />
                {t("scimTenantUrl")}
              </Title>
            </div>
            <Text className="text-gray-600 mb-3">{t("useThisUrlInScimSettings")}</Text>
            <div className="flex items-center">
              <TextInput value={scimBaseUrl} disabled={true} className="flex-grow" />
              <CopyToClipboard
                text={scimBaseUrl}
                onCopy={() => NotificationsManager.success(t("urlCopiedToClipboard"))}
              >
                <TremorButton variant="primary" className="ml-2 flex items-center">
                  <CopyOutlined className="h-4 w-4 mr-1" />
                  {t("copy")}
                </TremorButton>
              </CopyToClipboard>
            </div>
          </div>

          {/* Step 2: SCIM Token */}
          <div>
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 mr-2">
                2
              </div>
              <Title className="text-lg flex items-center">
                <KeyOutlined className="h-5 w-5 mr-2" />
                {t("authenticationToken")}
              </Title>
            </div>

            <Callout title={t("usingScim")} color="blue" className="mb-4">
              {t("scimTokenDescription")}
            </Callout>

            {!tokenData ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <Form form={form} onFinish={handleCreateSCIMToken} layout="vertical">
                  <Form.Item
                    name="key_alias"
                    label={t("tokenName")}
                    rules={[{ required: true, message: t("pleaseEnterTokenName") }]}
                  >
                    <TextInput placeholder={t("scimAccessToken")} />
                  </Form.Item>
                  <Form.Item>
                    <TremorButton
                      variant="primary"
                      type="submit"
                      loading={isCreatingToken}
                      className="flex items-center"
                    >
                      <KeyOutlined className="h-4 w-4 mr-1" />
                      {t("createScimToken")}
                    </TremorButton>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              <Card className="border border-yellow-300 bg-yellow-50">
                <div className="flex items-center mb-2 text-yellow-800">
                  <ExclamationCircleOutlined className="h-5 w-5 mr-2" />
                  <Title className="text-lg text-yellow-800">{t("yourScimToken")}</Title>
                </div>
                <Text className="text-yellow-800 mb-4 font-medium">{t("copyTokenNowWarning")}</Text>
                <div className="flex items-center">
                  <TextInput
                    value={tokenData.key}
                    className="flex-grow mr-2 bg-white"
                    type="password"
                    disabled={true}
                  />
                  <CopyToClipboard
                    text={tokenData.key}
                    onCopy={() => NotificationsManager.success(t("tokenCopiedToClipboard"))}
                  >
                    <TremorButton variant="primary" className="flex items-center">
                      <CopyOutlined className="h-4 w-4 mr-1" />
                      {t("copy")}
                    </TremorButton>
                  </CopyToClipboard>
                </div>
                <TremorButton className="mt-4 flex items-center" variant="secondary" onClick={() => setTokenData(null)}>
                  <PlusCircleOutlined className="h-4 w-4 mr-1" />
                  {t("createAnotherToken")}
                </TremorButton>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </Grid>
  );
};

export default SCIMConfig;
