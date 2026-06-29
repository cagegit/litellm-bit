import React from "react";
import { Form, Input, InputNumber, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, TextInput } from "@tremor/react";
import { OAUTH_FLOW } from "./types";
import { useTranslations } from "@/i18n";

interface OAuthFlowStatus {
  startOAuthFlow: () => void;
  status: string;
  error: string | null;
  tokenResponse: { access_token?: string; expires_in?: number } | null;
}

interface OAuthFormFieldsProps {
  isM2M: boolean;
  isEditing?: boolean;
  oauthFlow?: OAuthFlowStatus;
  initialFlowType?: string;
  /** Link to provider docs for creating an OAuth app (e.g. GitHub). */
  docsUrl?: string | null;
}

const fieldClassName = "rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500";

const FieldLabel: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => (
  <span className="text-sm font-medium text-gray-700 flex items-center">
    {label}
    <Tooltip title={tooltip}>
      <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
    </Tooltip>
  </span>
);

const OAuthFormFields: React.FC<OAuthFormFieldsProps> = ({
  isM2M,
  isEditing = false,
  oauthFlow,
  initialFlowType,
  docsUrl,
}) => {
  const { t } = useTranslations("mcp");

  const placeholderSuffix = isEditing ? " (leave blank to keep existing)" : "";

  return (
    <>
      <Form.Item
        label={
          <FieldLabel
            label={t("oauthFlowType")}
            tooltip="Choose how the proxy authenticates with this MCP server. M2M is for server-to-server communication using client credentials. Interactive (PKCE) is for user-facing flows that require browser-based authorization."
          />
        }
        name="oauth_flow_type"
        {...(initialFlowType ? { initialValue: initialFlowType } : {})}
      >
        <Select className="rounded-lg" size="large">
          <Select.Option value={OAUTH_FLOW.M2M}>
            <div>
              <span className="font-medium">{t("machineToMachinem2m")}</span>
              <span className="text-gray-400 text-xs ml-2">{t("serverToServerNoUserInteraction")}</span>
            </div>
          </Select.Option>
          <Select.Option value={OAUTH_FLOW.INTERACTIVE}>
            <div>
              <span className="font-medium">{t("interactivepkce")}</span>
              <span className="text-gray-400 text-xs ml-2">{t("browserBasedUserAuthorization")}</span>
            </div>
          </Select.Option>
        </Select>
      </Form.Item>

      {isM2M ? (
        <>
          <Form.Item
            label={<FieldLabel label={t("clientId")} tooltip={t("oauth2ClientIdForTheClientCredentialsGrant")} />}
            name={["credentials", "client_id"]}
            rules={[{ required: true, message: t("clientIdIsRequiredForM2mOauth") }]}
          >
            <TextInput
              type="password"
              placeholder={`Enter OAuth client ID${placeholderSuffix}`}
              className={fieldClassName}
            />
          </Form.Item>
          <Form.Item
            label={
              <FieldLabel label={t("clientSecret")} tooltip={t("oauth2ClientSecretForTheClientCredentialsGrant")} />
            }
            name={["credentials", "client_secret"]}
            rules={[{ required: true, message: t("clientSecretIsRequiredForM2mOauth") }]}
          >
            <TextInput
              type="password"
              placeholder={`Enter OAuth client secret${placeholderSuffix}`}
              className={fieldClassName}
            />
          </Form.Item>
          <Form.Item
            label={<FieldLabel label={t("tokenUrl")} tooltip={t("tokenEndpointUrlForTheClientCredentialsGrant")} />}
            name="token_url"
            rules={[{ required: true, message: t("tokenUrlIsRequiredForM2mOauth") }]}
          >
            <TextInput placeholder="https://auth.example.com/oauth/token" className={fieldClassName} />
          </Form.Item>
          <Form.Item
            label={
              <FieldLabel
                label={t("scopesoptional")}
                tooltip={t("optionalScopesToRequestWithTheClientCredentialsGrant")}
              />
            }
            name={["credentials", "scopes"]}
          >
            <Select
              mode="tags"
              tokenSeparators={[","]}
              placeholder={t("placeholderAddScopes")}
              className="rounded-lg"
              size="large"
            />
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item
            label={
              <span className="flex items-center justify-between w-full">
                <FieldLabel label={t("clientIdoptional")} tooltip={t("tooltipOauthClientInfo")} />
                {docsUrl && (
                  <a
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-700 ml-2 font-normal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("createOAuthApp")}
                  </a>
                )}
              </span>
            }
            name={["credentials", "client_id"]}
          >
            <TextInput type="password" placeholder={`Enter client ID${placeholderSuffix}`} className={fieldClassName} />
          </Form.Item>
          <Form.Item
            label={<FieldLabel label={t("clientSecretoptional")} tooltip={t("tooltipOauthClientInfo")} />}
            name={["credentials", "client_secret"]}
          >
            <TextInput
              type="password"
              placeholder={`Enter client secret${placeholderSuffix}`}
              className={fieldClassName}
            />
          </Form.Item>
          <Form.Item
            label={
              <FieldLabel
                label={t("scopesoptional")}
                tooltip={t("optionalScopesRequestedDuringTokenExchangeSeparateMultipleScopesWithEnterOrComma")}
              />
            }
            name={["credentials", "scopes"]}
          >
            <Select
              mode="tags"
              tokenSeparators={[","]}
              placeholder={t("placeholderAddScopes")}
              className="rounded-lg"
              size="large"
            />
          </Form.Item>
          <Form.Item
            label={<FieldLabel label={t("authorizationUrloptional")} tooltip={t("tooltipAuthUrlOverride")} />}
            name="authorization_url"
          >
            <TextInput placeholder="https://example.com/oauth/authorize" className={fieldClassName} />
          </Form.Item>
          <Form.Item
            label={<FieldLabel label={t("tokenUrloptional")} tooltip={t("tooltipTokenUrlOverride")} />}
            name="token_url"
          >
            <TextInput placeholder="https://example.com/oauth/token" className={fieldClassName} />
          </Form.Item>
          <Form.Item
            label={<FieldLabel label={t("registrationUrloptional")} tooltip={t("tooltipRegistrationUrlOverride")} />}
            name="registration_url"
          >
            <TextInput placeholder="https://example.com/oauth/register" className={fieldClassName} />
          </Form.Item>
          <Form.Item
            label={
              <FieldLabel
                label={t("tokenValidationRules")}
                tooltip='JSON object of key-value rules checked against the OAuth token response before storing. Supports dot-notation for nested fields (e.g. {"organization": "my-org", "team.id": "123"}). Tokens that fail validation are rejected with HTTP 403.'
              />
            }
            name="token_validation_json"
            rules={[
              {
                validator: (_: any, value: string) => {
                  if (!value || value.trim() === "") return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error("Must be valid JSON"));
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              placeholder={'{\n  "organization": "my-org",\n  "team.id": "123"\n}'}
              rows={4}
              className="font-mono text-sm rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            label={
              <FieldLabel
                label={t("tokenStorageTtl")}
                tooltip="How long to cache each user's OAuth access token in Redis before evicting it (regardless of the token's own expires_in). Leave blank to derive the TTL from the token's expires_in, or fall back to the 12-hour default."
              />
            }
            name="token_storage_ttl_seconds"
          >
            <InputNumber
              min={1}
              placeholder={t("placeholderTtl")}
              className="w-full rounded-lg"
              style={{ width: "100%" }}
            />
          </Form.Item>
          {oauthFlow && (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 space-y-2">
              <p className="text-sm text-gray-600">{t("useOAuthToFetchFreshAccessTokenDescription")}</p>
              <Button
                variant="secondary"
                onClick={oauthFlow.startOAuthFlow}
                disabled={oauthFlow.status === "authorizing" || oauthFlow.status === "exchanging"}
              >
                {oauthFlow.status === "authorizing"
                  ? "Waiting for authorization..."
                  : oauthFlow.status === "exchanging"
                    ? "Exchanging authorization code..."
                    : "Authorize & Fetch Token"}
              </Button>
              {oauthFlow.error && <p className="text-sm text-red-500">{oauthFlow.error}</p>}
              {oauthFlow.status === "success" && oauthFlow.tokenResponse?.access_token && (
                <p className="text-sm text-green-600">
                  {t("tokenFetchedExpiresIn1")} {oauthFlow.tokenResponse.expires_in ?? "?"} seconds.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OAuthFormFields;
