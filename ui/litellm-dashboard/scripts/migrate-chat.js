const fs = require("fs");

// Helper: string replace instead of regex for safety
function sr(haystack, needle, replacement) {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return haystack;
  return haystack.slice(0, idx) + replacement + haystack.slice(idx + needle.length);
}

// ChatPage.tsx - already has import + hook, just needs string replacements
const chatPage = "/home/cage/work/litellm-bit/ui/litellm-dashboard/src/components/chat/ChatPage.tsx";
let c = fs.readFileSync(chatPage, "utf8");

const chatReplacements = [
  [/>Select model</, '>{t("selectModel")}'],
  [/>Expand sidebar</, '>{t("expandSidebar")}'],
  [/>Collapse sidebar</, '>{t("collapseSidebar")}'],
  [/>Back</, '>{t("back")}'],
  [/>Disconnect</g, '>{t("disconnect")}'],
  [/>Connect</g, '>{t("connect")}'],
  [/>Connecting…</g, '>{t("connecting")}'],
  [/>MCP server</g, '>{t("mcpServer")}'],
  [/>Server ID</, '>{t("serverId")}'],
  [/>Transport</, '>{t("transport")}'],
  [/>Status</, '>{t("status")}'],
  [/>Connected</, '>{t("connected")}'],
  [/>Not connected</, '>{t("notConnected")}'],
  [/>Information</, '>{t("information")}'],
  [/>Available Tools</, '>{t("availableTools")}'],
  [/>No tools available</, '>{t("noToolsAvailable")}'],
  [/>MCP Servers</, '>{t("mcpServers")}'],
  [/>Beta</, '>{t("beta")}'],
  [/>Loading tools\.\.\.</, '>{t("loadingTools")}'],
  [/>All</, '>{t("all")}'],
  [/>Toolsets</, '>{t("toolsets")}'],
  [/>Servers</, '>{t("servers")}'],
  [/>All MCP Servers</g, '>{t("allMcpServers")}'],
  [/>Select Tool</, '>{t("selectTool")}'],
  [/>Select a tool to call</, '>{t("selectToolToCall")}'],
  [/>Limit tools for/, '>{t("limitToolsFor")}'],
  [/>All tools (default)</, '>{t("allToolsDefault")}'],
  [/>Vector Store</, '>{t("vectorStore")}'],
  [/>Guardrails</, '>{t("guardrails")}'],
  [/>Policies</, '>{t("policies")}'],
  [/>Session Management</, '>{t("sessionManagement")}'],
  [/>Code Interpreter</, '>{t("codeInterpreter")}'],
  [/>Code Interpreter Active</, '>{t("codeInterpreterActive")}'],
  [/>Running Python code\.\.\.</, '>{t("runningPythonCode")}'],
  [/>Disable</, '>{t("disable")}'],
  [/>Clear Chat</, '>{t("clearChat")}'],
  [/>Get Code</, '>{t("getCode")}'],
  [/>Generated Code</, '>{t("generatedCode")}'],
  [/>Copy to Clipboard</, '>{t("copyToClipboard")}'],
  [/>Cancel</, '>{t("cancel")}'],
  [/>Start a conversation, generate an image, or handle audio</, '>{t("startConversation")}'],
  [/>Test Key</, '>{t("testKey")}'],
  [/>Configurations</, '>{t("configurations")}'],
  [/>Virtual Key Source</, '>{t("virtualKeySource")}'],
  [/>Current UI Session</, '>{t("currentUiSession")}'],
  [/>Virtual Key</, '>{t("virtualKey")}'],
  [/>Enter custom Virtual Key</, '>{t("enterCustomVirtualKey")}'],
  [/>Custom Proxy Base URL</, '>{t("customProxyBaseUrl")}'],
  [/>Fill</, '>{t("fill")}'],
  [/>Clear</, '>{t("clear")}'],
  [/>Endpoint Type</, '>{t("endpointType")}'],
  [/>Voice</, '>{t("voice")}'],
  [/>Select Model</, '>{t("selectModel")}'],
  [/>Model Settings</, '>{t("modelSettings")}'],
  [/>Select a Model</, '>{t("selectAModel")}'],
  [/>Enter custom model</, '>{t("enterCustomModel")}'],
  [/>Enter custom model name</, '>{t("enterCustomModelName")}'],
  [/>Select Agent</, '>{t("selectAgent")}'],
  [/>Select an Agent</, '>{t("selectAnAgent")}'],
  [/>Tags</, '>{t("tags")}'],
  [/>Select MCP server</, '>{t("selectMcpServer")}'],
  [/>Select MCP servers</, '>{t("selectMcpServers")}'],
  [/>Click or drag images to upload</, '>{t("clickOrDragImagesToUpload")}'],
  [/>Add more</, '>{t("addMore")}'],
  [/>Click or drag audio file to upload</, '>{t("clickOrDragAudioFileToUpload")}'],
  [/>Remove</, '>{t("remove")}'],
  [/>SDK Type</, '>{t("sdkType")}'],
  [/>OpenAI SDK</, '>{t("openaiSdk")}'],
  [/>Azure SDK</, '>{t("azureSdk")}'],
  [/>How Toolsets Work</, '>{t("howToolsetsWork")}'],
  [/>Close</, '>{t("close")}'],
];

for (const [pat, rep] of chatReplacements) {
  c = c.replace(pat, rep);
}
// String-based replacements for HTML-containing patterns
c = sr(
  c,
  ">Go to <strong>Apps</strong> and click <strong>Connect</strong> to authorize an MCP server.",
  '>{t("goToAppsAndConnect")}',
);
fs.writeFileSync(chatPage, c);
console.log("ChatPage.tsx done");

// MCPAppsPanel.tsx - needs import + hook + string replacements
const mcpPanel = "/home/cage/work/litellm-bit/ui/litellm-dashboard/src/components/chat/MCPAppsPanel.tsx";
let p = fs.readFileSync(mcpPanel, "utf8");

p = p.replace(
  'import MessageManager from "@/components/molecules/message_manager";',
  'import { useTranslations } from "@/i18n";\nimport MessageManager from "@/components/molecules/message_manager";',
);

p = p.replace(
  "const [loading, setLoading] = useState(true);",
  "const { t } = useTranslations('chat');\n  const [loading, setLoading] = useState(true);",
);

const panelReplacements = [
  [/>Back</, '>{t("back")}'],
  [/>Disconnect</g, '>{t("disconnect")}'],
  [/>Connect</g, '>{t("connect")}'],
  [/>Connecting…</g, '>{t("connecting")}'],
  [/>MCP server</g, '>{t("mcpServer")}'],
  [/>Server ID</, '>{t("serverId")}'],
  [/>Transport</, '>{t("transport")}'],
  [/>Status</, '>{t("status")}'],
  [/>Connected</, '>{t("connected")}'],
  [/>Not connected</, '>{t("notConnected")}'],
  [/>Information</, '>{t("information")}'],
  [/>Available Tools</, '>{t("availableTools")}'],
  [/>No tools available</, '>{t("noToolsAvailable")}'],
  [/>MCP Servers</, '>{t("mcpServers")}'],
  [/>Beta</, '>{t("beta")}'],
  [/>Loading tools\.\.\.</, '>{t("loadingTools")}'],
  [/>All</, '>{t("all")}'],
  [/>No MCP servers configured/, '>{t("noMcpServersConfigured")}'],
  [/>No servers connected yet\./, '>{t("noServersConnected")}'],
  [/>No servers match your search\./, '>{t("noServersMatchSearch")}'],
  [/>Toolsets</, '>{t("toolsets")}'],
  [/>Servers</, '>{t("servers")}'],
  [/>All MCP Servers</g, '>{t("allMcpServers")}'],
  [/>Select Tool</, '>{t("selectTool")}'],
  [/>Select a tool to call</, '>{t("selectToolToCall")}'],
  [/>Limit tools for/, '>{t("limitToolsFor")}'],
  [/>All tools (default)</, '>{t("allToolsDefault")}'],
  [/>Search servers\.\.\.</, '>{t("searchServers")}'],
  [/>Browse tools, authenticate once, use in chat — no setup needed\./, '>{t("browseToolsAuthOnce")}'],
];

for (const [pat, rep] of panelReplacements) {
  p = p.replace(pat, rep);
}
fs.writeFileSync(mcpPanel, p);
console.log("MCPAppsPanel.tsx done");

// MCPCredentialsTab.tsx - needs import + hook + string replacements
const credsTab = "/home/cage/work/litellm-bit/ui/litellm-dashboard/src/components/chat/MCPCredentialsTab.tsx";
let d = fs.readFileSync(credsTab, "utf8");

d = d.replace(
  'import { deleteMCPOAuthUserCredential, listMCPUserCredentials, MCPUserCredentialListItem } from "../networking";',
  'import { useTranslations } from "@/i18n";\nimport { deleteMCPOAuthUserCredential, listMCPUserCredentials, MCPUserCredentialListItem } from "../networking";',
);

d = d.replace(
  "const [loading, setLoading] = useState(true);",
  "  const { t } = useTranslations('chat');\n  const [loading, setLoading] = useState(true);",
);

const credsReplacements = [
  [/>App Credentials</, '>{t("appCredentials")}'],
  [/>Your stored OAuth connections — used automatically in chat\./, '>{t("storedOAuthConnections")}'],
  [/>No connections yet\./, '>{t("noConnectionsYet")}'],
  [/>App</, '>{t("app")}'],
  [/>Connected</, '>{t("connected")}'],
  [/>Status</, '>{t("status")}'],
  [/>Actions</, '>{t("actions")}'],
  [/>Revoke connection</, '>{t("revokeConnection")}'],
  [/>just now</, '>{t("justNow")}'],
  [/>Does not expire</, '>{t("doesNotExpire")}'],
  [/>Expired</, '>{t("expired")}'],
  [/>Expires in/, '>{t("expiresIn")}'],
  [/>Failed to revoke connection\. Please try again\./, '>{t("failedToRevokeConnection")}'],
];

for (const [pat, rep] of credsReplacements) {
  d = d.replace(pat, rep);
}
// String-based for HTML-containing patterns
d = sr(
  d,
  ">Go to <strong>Apps</strong> and click <strong>Connect</strong> to authorize an MCP server.",
  '>{t("goToAppsAndConnect")}',
);
fs.writeFileSync(credsTab, d);
console.log("MCPCredentialsTab.tsx done");

// MCPConnectPicker.tsx - has hook but needs one string fixed
const picker = "/home/cage/work/litellm-bit/ui/litellm-dashboard/src/components/chat/MCPConnectPicker.tsx";
let pk = fs.readFileSync(picker, "utf8");
pk = pk.replace(/>No MCP servers configured/, '>{t("noMcpServersConfigured")}');
fs.writeFileSync(picker, pk);
console.log("MCPConnectPicker.tsx done");

console.log("All chat/ files done");
