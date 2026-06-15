import React, { useState, useEffect } from "react";
import { Form, Select, Button as AntdButton, Tooltip, Input, InputNumber } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import {
  AUTH_TYPE,
  OAUTH_FLOW,
  MCP_OAUTH2_FLOW_M2M,
  MCPServer,
  MCPServerCostInfo,
  TRANSPORT,
  getMcpOAuthMode,
} from "./types";
import { updateMCPServer, listMCPTools, storeMCPOAuthUserCredential } from "../networking";
import { getToken, isTokenValid, setToken } from "@/utils/mcpTokenStore";
import { buildMcpPassthroughAuthHeader } from "@/utils/mcpHeaderUtils";
import MCPServerCostConfig from "./mcp_server_cost_config";
import MCPPermissionManagement from "./MCPPermissionManagement";
import MCPToolConfiguration from "./mcp_tool_configuration";
import StdioConfiguration from "./StdioConfiguration";
import MCPLogoSelector from "./MCPLogoSelector";
import EnvVarsSection from "./EnvVarsSection";
import { validateMCPServerUrl, validateMCPServerName, normalizeEnvVars } from "./utils";
import NotificationsManager from "../molecules/notifications_manager";
import { useMcpOAuthFlow } from "@/hooks/useMcpOAuthFlow";
import { getSecureItem, setSecureItem } from "@/utils/secureStorage";
import { useTranslations } from "@/i18n";

interface MCPServerEditProps {
  mcpServer: MCPServer;
  accessToken: string | null;
  userID?: string | null;
  onCancel: () => void;
  onSuccess: (server: MCPServer) => void;
  availableAccessGroups: string[];
}

const AUTH_TYPES_REQUIRING_AUTH_VALUE = [AUTH_TYPE.API_KEY, AUTH_TYPE.BEARER_TOKEN, AUTH_TYPE.TOKEN, AUTH_TYPE.BASIC];
const AUTH_TYPES_REQUIRING_CREDENTIALS = [...AUTH_TYPES_REQUIRING_AUTH_VALUE, AUTH_TYPE.OAUTH2, AUTH_TYPE.AWS_SIGV4];
export const EDIT_OAUTH_UI_STATE_KEY = "litellm-mcp-oauth-edit-state";

const MCPServerEdit: React.FC<MCPServerEditProps> = ({
  mcpServer,
  accessToken,
  userID,
  onCancel,
  onSuccess,
  availableAccessGroups,
}) => {
  const { t } = useTranslations("mcp");
  const [form] = Form.useForm();
  const [costConfig, setCostConfig] = useState<MCPServerCostInfo>({});
  const [tools, setTools] = useState<any[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(false);
  const [toolsError, setToolsError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [aliasManuallyEdited, setAliasManuallyEdited] = useState(false);
  const [allowedTools, setAllowedTools] = useState<string[]>([]);
  const [hasToolAllowlistInteraction, setHasToolAllowlistInteraction] = useState(false);
  const [toolNameToDisplayName, setToolNameToDisplayName] = useState<Record<string, string>>({});
  const [toolNameToDescription, setToolNameToDescription] = useState<Record<string, string>>({});
  const [pendingRestoredValues, setPendingRestoredValues] = useState<Record<string, any> | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(mcpServer.mcp_info?.logo_url || undefined);
  const authType = Form.useWatch("auth_type", form) as string | undefined;
  const transportType = Form.useWatch("transport", form) as string | undefined;
  const isStdioTransport = transportType === "stdio";
  const isOpenAPITransport = transportType === TRANSPORT.OPENAPI;
  const isMCPTransport = !isStdioTransport && !isOpenAPITransport;
  const shouldShowAuthValueField = authType ? AUTH_TYPES_REQUIRING_AUTH_VALUE.includes(authType) : false;
  const isOAuthAuthType = authType === AUTH_TYPE.OAUTH2;
  const isAwsSigV4AuthType = authType === AUTH_TYPE.AWS_SIGV4;
  const oauthFlowTypeValue = Form.useWatch("oauth_flow_type", form) as string | undefined;
  const isM2MFlow = isOAuthAuthType && oauthFlowTypeValue === OAUTH_FLOW.M2M;

  // Watch form fields that affect tool fetching
  const currentUrl = Form.useWatch("url", form);
  const currentSpecPath = Form.useWatch("spec_path", form);
  const currentServerName = Form.useWatch("server_name", form);
  const currentAuthType = Form.useWatch("auth_type", form);
  const currentStaticHeaders = Form.useWatch("static_headers", form);
  const currentCredentials = Form.useWatch("credentials", form);
  const currentAuthorizationUrl = Form.useWatch("authorization_url", form);
  const currentTokenUrl = Form.useWatch("token_url", form);
  const currentRegistrationUrl = Form.useWatch("registration_url", form);
  const hasExistingToolAllowlist =
    Boolean(mcpServer.mcp_info?.tool_allowlist_enforced) || (mcpServer.allowed_tools?.length ?? 0) > 0;
  const existingAllowedTools = hasExistingToolAllowlist ? mcpServer.allowed_tools ?? [] : null;

  const persistEditUiState = () => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const values = form.getFieldsValue(true);
      setSecureItem(
        EDIT_OAUTH_UI_STATE_KEY,
        JSON.stringify({
          serverId: mcpServer.server_id,
          formValues: values,
          costConfig,
          allowedTools,
          hasToolAllowlistInteraction,
          searchValue,
          aliasManuallyEdited,
        }),
      );
    } catch (err) {
      console.warn("Failed to persist MCP edit state", err);
    }
  };

  const {
    startOAuthFlow,
    status: oauthStatus,
    error: oauthError,
    tokenResponse: oauthTokenResponse,
  } = useMcpOAuthFlow({
    accessToken,
    getCredentials: () => form.getFieldValue("credentials"),
    getTemporaryPayload: () => {
      const values = form.getFieldsValue(true);
      const url = values.url || mcpServer.url;
      const transport = values.transport || mcpServer.transport;
      if (!url || !transport) {
        return null;
      }
      const staticHeaders = Array.isArray(values.static_headers)
        ? values.static_headers.reduce((acc: Record<string, string>, entry: Record<string, string>) => {
            const header = entry?.header?.trim();
            if (!header) {
              return acc;
            }
            acc[header] = (entry?.value ?? "").trim();
            return acc;
          }, {})
        : ({} as Record<string, string>);

      return {
        server_id: mcpServer.server_id,
        server_name: values.server_name || mcpServer.server_name || mcpServer.alias,
        alias: values.alias || mcpServer.alias,
        description: values.description || mcpServer.description,
        url,
        transport,
        auth_type: AUTH_TYPE.OAUTH2,
        credentials: values.credentials,
        mcp_access_groups: values.mcp_access_groups || mcpServer.mcp_access_groups,
        static_headers: staticHeaders,
        command: values.command,
        args: values.args,
        env: values.env,
      };
    },
    onTokenReceived: (token) => {
      if (token?.access_token) {
        const credentials = {
          access_token: token.access_token,
          ...(token.refresh_token && { refresh_token: token.refresh_token }),
          ...(token.expires_in && { expires_in: token.expires_in }),
          ...(token.scope && { scope: token.scope }),
        };

        form.setFieldsValue({ credentials });

        NotificationsManager.success(t("oauthSuccessMessage"));
      }
    },
    onBeforeRedirect: persistEditUiState,
    flowSource: "edit",
  });

  const initialStaticHeaders = React.useMemo(() => {
    if (!mcpServer.static_headers) {
      return [];
    }
    return Object.entries(mcpServer.static_headers).map(([header, value]) => ({
      header,
      value: value != null ? String(value) : "",
    }));
  }, [mcpServer.static_headers]);

  const initialEnvVars = React.useMemo(() => {
    if (!Array.isArray(mcpServer.env_vars)) {
      return [];
    }
    return mcpServer.env_vars.map((entry) => ({
      name: entry.name,
      value: entry.value ?? "",
      scope: entry.scope === "user" ? "user" : "global",
      description: entry.description ?? "",
    }));
  }, [mcpServer.env_vars]);

  const initialEnvJson = React.useMemo(() => {
    const env = mcpServer.env ?? undefined;
    if (!env || Object.keys(env).length === 0) {
      return "";
    }
    try {
      return JSON.stringify(env, null, 2);
    } catch {
      return "";
    }
  }, [mcpServer.env]);

  // If server has spec_path, show it as "openapi" transport in the UI
  const effectiveTransport = React.useMemo(() => {
    if (mcpServer.spec_path && mcpServer.transport !== "stdio") {
      return TRANSPORT.OPENAPI;
    }
    return mcpServer.transport;
  }, [mcpServer]);

  const initialValues = React.useMemo(
    () => ({
      ...mcpServer,
      transport: effectiveTransport,
      static_headers: initialStaticHeaders,
      env_vars: initialEnvVars,
      extra_headers: mcpServer.extra_headers || [],
      oauth_flow_type: mcpServer.token_url ? OAUTH_FLOW.M2M : OAUTH_FLOW.INTERACTIVE,
      token_validation_json: mcpServer.token_validation
        ? JSON.stringify(mcpServer.token_validation, null, 2)
        : undefined,
    }),
    [mcpServer, effectiveTransport, initialStaticHeaders, initialEnvVars, initialEnvJson],
  );

  // antd applies `initialValues` only at first mount. When the server loads after
  // mount (e.g. returning from the OAuth redirect lands on Overview and the form
  // mounts before the server data is ready), the form would stay blank. Re-sync it
  // from the loaded server once per server_id so it always reflects the saved config;
  // the OAuth-restore effect below then overlays any in-progress edits on top.
  const syncedServerIdRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (!mcpServer.server_id || syncedServerIdRef.current === mcpServer.server_id) {
      return;
    }
    syncedServerIdRef.current = mcpServer.server_id;
    form.setFieldsValue(initialValues);
  }, [mcpServer.server_id, initialValues, form]);

  // Initialize cost config from existing server data
  useEffect(() => {
    if (mcpServer.mcp_info?.mcp_server_cost_info) {
      setCostConfig(mcpServer.mcp_info.mcp_server_cost_info);
    }
  }, [mcpServer]);

  // Initialize allowed tools and tool overrides from existing server data
  useEffect(() => {
    setHasToolAllowlistInteraction(false);
  }, [mcpServer.server_id]);

  useEffect(() => {
    if (hasExistingToolAllowlist) {
      setAllowedTools(mcpServer.allowed_tools ?? []);
    }
    setToolNameToDisplayName(mcpServer.tool_name_to_display_name ?? {});
    setToolNameToDescription(mcpServer.tool_name_to_description ?? {});
  }, [mcpServer, hasExistingToolAllowlist]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedState = getSecureItem(EDIT_OAUTH_UI_STATE_KEY);
    if (!storedState) {
      return;
    }

    try {
      const parsed = JSON.parse(storedState);
      if (!parsed || parsed.serverId !== mcpServer.server_id) {
        return;
      }
      if (parsed.formValues) {
        setPendingRestoredValues({ ...mcpServer, ...parsed.formValues });
      }
      if (parsed.costConfig) {
        setCostConfig(parsed.costConfig);
      }
      if (parsed.allowedTools) {
        setAllowedTools(parsed.allowedTools);
      }
      if (typeof parsed.hasToolAllowlistInteraction === "boolean") {
        setHasToolAllowlistInteraction(parsed.hasToolAllowlistInteraction);
      }
      if (parsed.searchValue) {
        setSearchValue(parsed.searchValue);
      }
      if (typeof parsed.aliasManuallyEdited === "boolean") {
        setAliasManuallyEdited(parsed.aliasManuallyEdited);
      }
    } catch (err) {
      console.error("Failed to restore MCP edit state", err);
    } finally {
      window.sessionStorage.removeItem(EDIT_OAUTH_UI_STATE_KEY);
    }
  }, [form, mcpServer]);

  useEffect(() => {
    if (!pendingRestoredValues) {
      return;
    }
    // Set transport first so transport-dependent fields render, then apply the rest
    // on the re-run triggered by the transportType watch (without it the effect's
    // deps never change and the second pass never runs, leaving fields blank).
    const transport = pendingRestoredValues.transport || mcpServer.transport;
    if (transport && transport !== form.getFieldValue("transport")) {
      form.setFieldsValue({ transport });
      return;
    }
    form.setFieldsValue(pendingRestoredValues);
    setPendingRestoredValues(null);
  }, [pendingRestoredValues, form, mcpServer.transport, transportType]);

  // Transform string array to object array for initial form values
  useEffect(() => {
    if (mcpServer.mcp_access_groups) {
      // If access groups are objects, extract the name property; if strings, use as is
      const groupNames = mcpServer.mcp_access_groups.map((g: any) => (typeof g === "string" ? g : g.name || String(g)));
      form.setFieldValue("mcp_access_groups", groupNames);
    }
  }, [mcpServer]);

  // Fetch tools when component mounts for a saved server
  useEffect(() => {
    if (!mcpServer.server_id || mcpServer.server_id.trim() === "") {
      return;
    }
    fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcpServer, accessToken, userID, oauthTokenResponse?.access_token]);

  const fetchTools = async () => {
    if (!accessToken || !mcpServer.server_id) return;

    // OBO/M2M/static auth is attached server-side from the stored credential, so
    // a plain GET /tools/list?server_id suffices. PKCE passthrough holds the token
    // in the browser, so forward it from sessionStorage as the x-mcp header the
    // same way the Tools playground does.
    let customHeaders: Record<string, string> | undefined;
    const isPassthrough =
      getMcpOAuthMode({
        auth_type: mcpServer.auth_type,
        oauth2_flow: mcpServer.oauth2_flow,
        delegate_auth_to_upstream: mcpServer.delegate_auth_to_upstream,
      }) === "passthrough";
    if (isPassthrough) {
      const token =
        oauthTokenResponse?.access_token ??
        (isTokenValid(mcpServer.server_id, userID)
          ? getToken(mcpServer.server_id, userID)?.access_token ?? null
          : null);
      if (!token) {
        setTools([]);
        setToolsError(t("authenticateFirst"));
        return;
      }
      customHeaders = buildMcpPassthroughAuthHeader(mcpServer.alias, token);
    }

    setIsLoadingTools(true);
    setToolsError(null);

    try {
      // include_disabled_tools: configuring the allowlist needs the full server
      // catalog, so tools toggled off still render (as unchecked) instead of vanishing.
      const toolsResponse = await listMCPTools(accessToken, mcpServer.server_id, customHeaders, true);

      if (toolsResponse.tools && !toolsResponse.error) {
        setTools(toolsResponse.tools);
      } else {
        setTools([]);
        setToolsError(toolsResponse.message || t("failedToLoadTools"));
      }
    } catch (error) {
      setTools([]);
      setToolsError(error instanceof Error ? error.message : t("failedToLoadTools"));
    } finally {
      setIsLoadingTools(false);
    }
  };

  // Generate options with existing groups and potential new group
  const getAccessGroupOptions = () => {
    const existingOptions = availableAccessGroups.map((group: string) => ({
      value: group,
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">{group}</span>
        </div>
      ),
    }));

    // If search value doesn't match any existing group and is not empty, add "{t('createNewGroup')}" option
    if (
      searchValue &&
      !availableAccessGroups.some((group) => group.toLowerCase().includes(searchValue.toLowerCase()))
    ) {
      existingOptions.push({
        value: searchValue,
        label: (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium">{searchValue}</span>
            <span className="text-gray-400 text-xs ml-1">{t("createNewGroup")}</span>
          </div>
        ),
      });
    }

    return existingOptions;
  };

  const handleTransportChange = (value: string) => {
    // Clear fields that are not relevant for the selected transport.
    if (value === "stdio") {
      form.setFieldsValue({
        url: undefined,
        spec_path: undefined,
        auth_type: undefined,
        credentials: undefined,
        authorization_url: undefined,
        token_url: undefined,
        registration_url: undefined,
      });
    } else if (value === TRANSPORT.OPENAPI) {
      form.setFieldsValue({
        url: undefined,
        command: undefined,
        args: undefined,
        env_json: undefined,
        stdio_config: undefined,
      });
    } else {
      form.setFieldsValue({
        spec_path: undefined,
        command: undefined,
        args: undefined,
        env_json: undefined,
        stdio_config: undefined,
      });
    }
  };

  const handleSave = async (values: Record<string, any>) => {
    if (!accessToken) return;
    try {
      // Ensure access groups is always a string array
      const {
        static_headers: staticHeadersList,
        env_vars: envVarsList,
        credentials: credentialValues,
        stdio_config: rawStdioConfig,
        env_json: rawEnvJson,
        command: rawCommand,
        args: rawArgs,
        allow_all_keys: allowAllKeysRaw,
        available_on_public_internet: availableOnPublicInternetRaw,
        delegate_auth_to_upstream: delegateAuthToUpstreamRaw,
        oauth_passthrough: oauthPassthroughRaw,
        token_validation_json: rawTokenValidationJson,
        ...restValues
      } = values;

      const accessGroups = (restValues.mcp_access_groups || []).map((g: any) =>
        typeof g === "string" ? g : g.name || String(g),
      );

      const staticHeaders = Array.isArray(staticHeadersList)
        ? staticHeadersList.reduce((acc: Record<string, string>, entry: Record<string, string>) => {
            const header = entry?.header?.trim();
            if (!header) {
              return acc;
            }
            acc[header] = (entry?.value ?? "").trim();
            return acc;
          }, {})
        : ({} as Record<string, string>);

      const envVars = normalizeEnvVars(envVarsList);

      const credentialsPayload =
        credentialValues && typeof credentialValues === "object"
          ? Object.entries(credentialValues).reduce((acc: Record<string, any>, [key, value]) => {
              if (value === undefined || value === null || value === "") {
                return acc;
              }
              if (key === "scopes") {
                if (Array.isArray(value)) {
                  const filteredScopes = value.filter((scope) => scope != null && scope !== "");
                  if (filteredScopes.length > 0) {
                    acc[key] = filteredScopes;
                  }
                }
              } else {
                acc[key] = value;
              }
              return acc;
            }, {})
          : undefined;

      let stdioFields: Record<string, any> = {};

      if (restValues.transport === "stdio") {
        // Prefer JSON config if provided (matches Create screen behavior)
        if (rawStdioConfig) {
          try {
            const stdioConfig = JSON.parse(rawStdioConfig);

            let actualConfig = stdioConfig;
            if (stdioConfig?.mcpServers && typeof stdioConfig.mcpServers === "object") {
              const serverNames = Object.keys(stdioConfig.mcpServers);
              if (serverNames.length > 0) {
                actualConfig = stdioConfig.mcpServers[serverNames[0]];
              }
            }

            const parsedArgs = Array.isArray(actualConfig?.args)
              ? actualConfig.args.map((v: any) => String(v)).filter((v: string) => v.trim() !== "")
              : [];

            const parsedEnv =
              actualConfig?.env && typeof actualConfig.env === "object" && !Array.isArray(actualConfig.env)
                ? Object.entries(actualConfig.env).reduce((acc: Record<string, string>, [k, v]) => {
                    if (k == null || String(k).trim() === "") return acc;
                    acc[String(k)] = v == null ? "" : String(v);
                    return acc;
                  }, {})
                : {};

            stdioFields = {
              command: actualConfig?.command ? String(actualConfig.command) : undefined,
              args: parsedArgs,
              env: parsedEnv,
            };

            if (!stdioFields.command) {
              NotificationsManager.fromBackend(t("stdioConfigRequiresCommand"));
              return;
            }
          } catch {
            NotificationsManager.fromBackend(t("invalidStdioJson"));
            return;
          }
        } else {
          // Dedicated fields path (command/args + env JSON)
          let parsedEnv: Record<string, string> = {};
          if (rawEnvJson) {
            try {
              const env = JSON.parse(rawEnvJson);
              if (env && typeof env === "object" && !Array.isArray(env)) {
                parsedEnv = Object.entries(env).reduce((acc: Record<string, string>, [k, v]) => {
                  if (k == null || String(k).trim() === "") return acc;
                  acc[String(k)] = v == null ? "" : String(v);
                  return acc;
                }, {});
              }
            } catch {
              NotificationsManager.fromBackend(t("invalidStdioJson"));
              return;
            }
          }
          const parsedArgs = Array.isArray(rawArgs)
            ? rawArgs.map((v: any) => String(v)).filter((v: string) => v.trim() !== "")
            : [];

          const parsedCommand = rawCommand ? String(rawCommand).trim() : "";
          if (!parsedCommand) {
            NotificationsManager.fromBackend(t("stdioRequiresCommand"));
            return;
          }

          stdioFields = {
            command: parsedCommand,
            args: parsedArgs,
            env: parsedEnv,
          };
        }
      }

      // Map "openapi" transport to "http" for the backend
      if (restValues.transport === TRANSPORT.OPENAPI) {
        restValues.transport = "http";
      }

      // Parse token_validation JSON if provided
      let tokenValidation: Record<string, any> | null = null;
      if (rawTokenValidationJson && rawTokenValidationJson.trim() !== "") {
        try {
          tokenValidation = JSON.parse(rawTokenValidationJson);
        } catch {
          NotificationsManager.fromBackend(t("invalidTokenValidationJson"));
          return;
        }
      }

      // Prepare the payload with cost configuration and permission fields
      const mcpInfoServerName =
        restValues.server_name ||
        restValues.url ||
        mcpServer.server_name ||
        mcpServer.url ||
        restValues.alias ||
        mcpServer.alias ||
        "unknown";

      const toolAllowlistEnforced = hasExistingToolAllowlist || hasToolAllowlistInteraction || allowedTools.length > 0;

      const payload: Record<string, any> = {
        ...restValues,
        ...stdioFields,
        // Remove UI-only fields
        stdio_config: undefined,
        env_json: undefined,
        server_id: mcpServer.server_id,
        mcp_info: {
          ...(mcpServer.mcp_info ?? {}),
          server_name: mcpInfoServerName,
          description: restValues.description,
          logo_url: logoUrl || undefined,
          mcp_server_cost_info: Object.keys(costConfig).length > 0 ? costConfig : null,
          tool_allowlist_enforced: toolAllowlistEnforced,
        },
        mcp_access_groups: accessGroups,
        alias: restValues.alias,
        // Include permission management fields
        extra_headers: restValues.extra_headers || [],
        ...(toolAllowlistEnforced
          ? {
              allowed_tools: allowedTools,
            }
          : {}),
        tool_name_to_display_name: Object.keys(toolNameToDisplayName).length > 0 ? toolNameToDisplayName : null,
        tool_name_to_description: Object.keys(toolNameToDescription).length > 0 ? toolNameToDescription : null,
        disallowed_tools: restValues.disallowed_tools || [],
        static_headers: staticHeaders,
        env_vars: envVars,
        allow_all_keys: Boolean(allowAllKeysRaw ?? mcpServer.allow_all_keys),
        available_on_public_internet: Boolean(availableOnPublicInternetRaw ?? mcpServer.available_on_public_internet),
        // ``delegate_auth_to_upstream`` is only honored server-side for
        // ``auth_type=oauth2`` (PKCE passthrough). The Form.Item is
        // conditionally rendered so the value drops out of the form on
        // auth_type change; force false for any other configuration to avoid
        // persisting a stale ``true`` that would silently re-activate if the
        // configuration is later switched back.
        delegate_auth_to_upstream: (() => {
          const isOauth2 = restValues.auth_type === AUTH_TYPE.OAUTH2;
          return isOauth2 ? Boolean(delegateAuthToUpstreamRaw ?? mcpServer.delegate_auth_to_upstream) : false;
        })(),
        // ``oauth_passthrough`` is the dedicated, non-oauth2 opt-in. It is only
        // honored for ``auth_type=none`` servers that forward ``Authorization``
        // upstream. Kept separate from ``delegate_auth_to_upstream`` so enabling
        // pass-through never regresses oauth2 servers. Force false otherwise.
        oauth_passthrough: (() => {
          const isNoneAuth = restValues.auth_type === AUTH_TYPE.NONE || restValues.auth_type == null;
          const extraHeaders = Array.isArray(restValues.extra_headers) ? restValues.extra_headers : [];
          const hasAuthorizationHeader = extraHeaders.some(
            (h: unknown) => typeof h === "string" && h.toLowerCase() === "authorization",
          );
          return isNoneAuth && hasAuthorizationHeader
            ? Boolean(oauthPassthroughRaw ?? mcpServer.oauth_passthrough)
            : false;
        })(),
        // Include token_validation when it is set (non-null) or when clearing an existing value
        ...(tokenValidation !== null || mcpServer.token_validation ? { token_validation: tokenValidation } : {}),
      };

      const includeCredentials =
        restValues.auth_type && AUTH_TYPES_REQUIRING_CREDENTIALS.includes(restValues.auth_type);

      if (includeCredentials && credentialsPayload && Object.keys(credentialsPayload).length > 0) {
        payload.credentials = credentialsPayload;
      }

      const updated = await updateMCPServer(accessToken, payload);

      // Persist the token staged via "Authorize & Fetch" (mirrors the create flow's
      // commit-on-submit): OBO writes the per-user token to the DB, passthrough keeps
      // it in sessionStorage. M2M/static auth resolve server-side and need neither.
      if (oauthTokenResponse?.access_token) {
        const oauthMode = getMcpOAuthMode({
          auth_type: restValues.auth_type,
          oauth2_flow: isM2MFlow ? MCP_OAUTH2_FLOW_M2M : null,
          delegate_auth_to_upstream: Boolean(delegateAuthToUpstreamRaw ?? mcpServer.delegate_auth_to_upstream),
        });
        try {
          if (oauthMode === "obo") {
            const scope = oauthTokenResponse.scope;
            await storeMCPOAuthUserCredential(accessToken, mcpServer.server_id, {
              access_token: oauthTokenResponse.access_token,
              refresh_token: oauthTokenResponse.refresh_token,
              expires_in: oauthTokenResponse.expires_in,
              scopes: typeof scope === "string" && scope ? scope.split(" ") : undefined,
            });
          } else if (oauthMode === "passthrough") {
            setToken(
              mcpServer.server_id,
              {
                access_token: oauthTokenResponse.access_token,
                expires_in: oauthTokenResponse.expires_in,
                refresh_token: oauthTokenResponse.refresh_token,
                token_type: oauthTokenResponse.token_type,
              },
              userID,
            );
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "";
          NotificationsManager.fromBackend(t("mcpServerUpdatedOAuthFailed") + (message ? `: ${message}` : ""));
          return;
        }
      }

      NotificationsManager.success(t("mcpServerUpdated"));
      onSuccess(updated);
    } catch (error: any) {
      NotificationsManager.fromBackend(t("failedToUpdateMcpServer") + (error?.message ? `: ${error.message}` : ""));
    }
  };

  return (
    <TabGroup>
      <TabList className="grid w-full grid-cols-2">
        <Tab>{t("serverConfiguration")}</Tab>
        <Tab>{t("costConfiguration")}</Tab>
      </TabList>
      <TabPanels className="mt-6">
        <TabPanel>
          <Form form={form} onFinish={handleSave} initialValues={initialValues} layout="vertical">
            <Form.Item
              label={t("mcpServerName")}
              name="server_name"
              rules={[
                {
                  validator: (_, value) => validateMCPServerName(value),
                },
              ]}
            >
              <Input className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            </Form.Item>
            <Form.Item
              label={t("alias")}
              name="alias"
              rules={[
                {
                  validator: (_, value) => validateMCPServerName(value),
                },
              ]}
            >
              <Input
                onChange={() => setAliasManuallyEdited(true)}
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Item>
            <Form.Item label={t("description")} name="description">
              <Input className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            </Form.Item>
            <MCPLogoSelector value={logoUrl} onChange={setLogoUrl} />
            <Form.Item label={t("transportType")} name="transport" rules={[{ required: true }]}>
              <Select onChange={handleTransportChange}>
                <Select.Option value="http">{t("streamableHttp")}</Select.Option>
                <Select.Option value="sse">{t("serverSentEvents")}</Select.Option>
                <Select.Option value="stdio">{t("stdioLabel")}</Select.Option>
                <Select.Option value={TRANSPORT.OPENAPI}>{t("openApiSpec")}</Select.Option>
              </Select>
            </Form.Item>

            {/* URL field - only for HTTP/SSE */}
            {isMCPTransport && (
              <Form.Item
                label={t("mcpServerUrl")}
                name="url"
                rules={[
                  { required: true, message: t("pleaseEnterServerUrl") },
                  { validator: (_, value) => validateMCPServerUrl(value) },
                ]}
              >
                <Input
                  placeholder={t("placeholderServerUrl")}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </Form.Item>
            )}

            {/* OpenAPI Spec URL - only for OpenAPI transport */}
            {isOpenAPITransport && (
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    {t("openApiSpecUrl")}
                    <Tooltip title={t("tooltipOpenApiSpecUrl")}>
                      <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                    </Tooltip>
                  </span>
                }
                name="spec_path"
                rules={[{ required: true, message: t("pleaseEnterSpecUrl") }]}
              >
                <Input
                  placeholder={t("placeholderSpecUrl")}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </Form.Item>
            )}

            {/* Authentication - for HTTP, SSE, and OpenAPI */}
            {!isStdioTransport && (
              <Form.Item label={t("authentication")} name="auth_type" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="none">{t("authNone")}</Select.Option>
                  <Select.Option value="api_key">{t("authApiKey")}</Select.Option>
                  <Select.Option value="bearer_token">{t("authBearerToken")}</Select.Option>
                  <Select.Option value="token">{t("authToken")}</Select.Option>
                  <Select.Option value="basic">{t("authBasic")}</Select.Option>
                  <Select.Option value="oauth2">{t("authOAuth")}</Select.Option>
                  <Select.Option value="aws_sigv4">{t("authAwsSigV4")}</Select.Option>
                </Select>
              </Form.Item>
            )}

            {isStdioTransport && (
              <div className="rounded-lg border border-gray-200 p-4 space-y-4">
                <p className="text-sm text-gray-600">{t("stdioDescription")}</p>

                <Form.Item
                  label={t("command")}
                  name="command"
                  rules={[{ required: true, message: t("pleaseEnterCommand") }]}
                >
                  <Input
                    placeholder={t("placeholderCommand")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>

                <Form.Item label={t("args")} name="args">
                  <Select
                    mode="tags"
                    size="large"
                    tokenSeparators={[","]}
                    placeholder={t("placeholderArgs")}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={t("environmentJson")}
                  name="env_json"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        try {
                          const parsed = JSON.parse(value);
                          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(t("envMustBeJsonObject")));
                        } catch {
                          return Promise.reject(new Error(t("pleaseEnterValidJson")));
                        }
                      },
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={6}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                    placeholder={t("placeholderEnvJson")}
                  />
                </Form.Item>

                {/* Optional JSON config (if provided, it overrides command/args/env on save) */}
                <StdioConfiguration isVisible={true} required={false} />
              </div>
            )}

            {!isStdioTransport && shouldShowAuthValueField && (
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    {t("authenticationValue")}
                    <Tooltip title={t("tooltipAuthenticationValue")}>
                      <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                    </Tooltip>
                  </span>
                }
                name={["credentials", "auth_value"]}
                rules={[
                  {
                    validator: (_, value) =>
                      value && typeof value === "string" && value.trim() === ""
                        ? Promise.reject(new Error(t("authValueCannotBeEmpty")))
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t("placeholderTokenSecret")}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </Form.Item>
            )}

            {!isStdioTransport && isOAuthAuthType && (
              <>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("oauthClientId")}
                      <Tooltip title={t("tooltipOauthClientInfo")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "client_id"]}
                >
                  <Input.Password
                    placeholder={t("placeholderOauthClientId")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("oauthClientSecret")}
                      <Tooltip title={t("tooltipOauthClientInfo")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "client_secret"]}
                >
                  <Input.Password
                    placeholder={t("placeholderOauthClientSecret")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("oauthScopes")}
                      <Tooltip title={t("tooltipOauthScopes")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
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
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("authorizationUrlOverride")}
                      <Tooltip title={t("tooltipAuthUrlOverride")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name="authorization_url"
                >
                  <Input
                    placeholder={t("placeholderAuthUrl")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("tokenUrlOverride")}
                      <Tooltip title={t("tooltipTokenUrlOverride")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name="token_url"
                >
                  <Input
                    placeholder={t("placeholderTokenUrl")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("registrationUrlOverride")}
                      <Tooltip title={t("tooltipRegistrationUrlOverride")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name="registration_url"
                >
                  <Input
                    placeholder={t("placeholderRegistrationUrl")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                {!isM2MFlow && (
                  <>
                    <Form.Item
                      label={
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          {t("tokenValidationRules")}
                          <Tooltip title={t("tooltipTokenValidationRules")}>
                            <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                          </Tooltip>
                        </span>
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
                              return Promise.reject(new Error(t("mustBeValidJson")));
                            }
                          },
                        },
                      ]}
                    >
                      <Input.TextArea
                        placeholder={t("placeholderTokenValidationJson")}
                        rows={4}
                        className="font-mono text-sm rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          {t("tokenStorageTtl")}
                          <Tooltip title={t("tooltipTokenStorageTtl")}>
                            <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                          </Tooltip>
                        </span>
                      }
                      name="token_storage_ttl_seconds"
                    >
                      <InputNumber
                        min={1}
                        placeholder={t("placeholderTtl")}
                        style={{ width: "100%" }}
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </>
                )}
                <div className="rounded-lg border border-dashed border-gray-300 p-4 space-y-2">
                  <p className="text-sm text-gray-600">{t("oauthDescription")}</p>
                  <Button
                    variant="secondary"
                    onClick={startOAuthFlow}
                    disabled={oauthStatus === "authorizing" || oauthStatus === "exchanging"}
                  >
                    {oauthStatus === "authorizing"
                      ? t("waitingForAuthorization")
                      : oauthStatus === "exchanging"
                        ? t("exchangingAuthCode")
                        : t("authorizeFetchToken")}
                  </Button>
                  {oauthError && <p className="text-sm text-red-500">{oauthError}</p>}
                  {oauthStatus === "success" && oauthTokenResponse?.access_token && (
                    <p className="text-sm text-green-600">
                      {t("tokenFetchedExpiresIn", { seconds: oauthTokenResponse.expires_in ?? "?" })}
                    </p>
                  )}
                </div>
              </>
            )}

            {!isStdioTransport && isAwsSigV4AuthType && (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  {t("awsSigV4Description")}{" "}
                  <a
                    href="https://docs.litellm.ai/docs/mcp_aws_sigv4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {t("viewDocs")}
                  </a>
                </p>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("awsRegion")}
                      <Tooltip title={t("tooltipAwsRegion")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "aws_region_name"]}
                  rules={[]}
                >
                  <Input
                    placeholder={t("placeholderAwsRegion")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("awsServiceName")}
                      <Tooltip title={t("tooltipAwsServiceName")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "aws_service_name"]}
                >
                  <Input
                    placeholder={t("placeholderAwsServiceName")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("awsAccessKeyId")}
                      <Tooltip title={t("tooltipAwsAccessKeyId")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "aws_access_key_id"]}
                  rules={[]}
                >
                  <Input.Password
                    placeholder={t("placeholderLeaveBlank")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("awsSecretAccessKey")}
                      <Tooltip title={t("tooltipAwsSecretAccessKey")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "aws_secret_access_key"]}
                  rules={[]}
                >
                  <Input.Password
                    placeholder={t("placeholderLeaveBlank")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("awsSessionToken")}
                      <Tooltip title={t("tooltipAwsSessionToken")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "aws_session_token"]}
                >
                  <Input.Password
                    placeholder={t("placeholderLeaveBlank")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("awsRoleArn")}
                      <Tooltip title={t("tooltipAwsRoleArn")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "aws_role_name"]}
                >
                  <Input
                    placeholder={t("placeholderLeaveBlank")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {t("awsSessionName")}
                      <Tooltip title={t("tooltipAwsSessionName")}>
                        <InfoCircleOutlined className="ml-2 text-blue-400 hover:text-blue-600 cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  name={["credentials", "aws_session_name"]}
                >
                  <Input
                    placeholder={t("placeholderLeaveBlank")}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Item>
              </>
            )}

            {/* Environment Variables Section */}
            <div className="mt-6">
              <EnvVarsSection />
            </div>

            {/* Permission Management / Access Control Section */}
            <div className="mt-6">
              <MCPPermissionManagement
                availableAccessGroups={availableAccessGroups}
                mcpServer={mcpServer}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                getAccessGroupOptions={getAccessGroupOptions}
              />
            </div>

            {/* Tool Configuration Section */}
            <div className="mt-6">
              <MCPToolConfiguration
                accessToken={accessToken}
                formValues={{
                  server_id: mcpServer.server_id,
                  server_name: currentServerName ?? mcpServer.server_name,
                  url: currentUrl ?? mcpServer.url,
                  spec_path: currentSpecPath ?? mcpServer.spec_path,
                  transport: transportType ?? mcpServer.transport,
                  auth_type: currentAuthType ?? mcpServer.auth_type,
                  mcp_info: mcpServer.mcp_info,
                  oauth_flow_type: currentTokenUrl ?? mcpServer.token_url ? OAUTH_FLOW.M2M : OAUTH_FLOW.INTERACTIVE,
                  static_headers: currentStaticHeaders ?? mcpServer.static_headers,
                  credentials: currentCredentials,
                  authorization_url: currentAuthorizationUrl ?? mcpServer.authorization_url,
                  token_url: currentTokenUrl ?? mcpServer.token_url,
                  registration_url: currentRegistrationUrl ?? mcpServer.registration_url,
                }}
                allowedTools={allowedTools}
                existingAllowedTools={existingAllowedTools}
                hasToolAllowlistInteraction={hasToolAllowlistInteraction}
                isEditMode
                onAllowedToolsChange={setAllowedTools}
                onToolAllowlistInteraction={() => setHasToolAllowlistInteraction(true)}
                toolNameToDisplayName={toolNameToDisplayName}
                toolNameToDescription={toolNameToDescription}
                onToolNameToDisplayNameChange={setToolNameToDisplayName}
                onToolNameToDescriptionChange={setToolNameToDescription}
                externalTools={tools}
                externalIsLoading={isLoadingTools}
                externalError={toolsError}
                externalCanFetch={true}
              />
            </div>

            <div className="flex justify-end gap-2">
              <AntdButton onClick={onCancel}>{t("cancel")}</AntdButton>
              <Button type="submit">{t("saveChanges")}</Button>
            </div>
          </Form>
        </TabPanel>

        <TabPanel>
          <div className="space-y-6">
            <MCPServerCostConfig value={costConfig} onChange={setCostConfig} tools={tools} disabled={isLoadingTools} />

            <div className="flex justify-end gap-2">
              <AntdButton onClick={onCancel}>{t("cancel")}</AntdButton>
              <Button onClick={() => form.submit()}>{t("saveChanges")}</Button>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default MCPServerEdit;
