/**
 * JSON view of tool definition
 */

import { ParsedTool } from "./types";
import { useTranslations } from "@/i18n";

interface JsonToolViewProps {
  tool: ParsedTool;
}

export function JsonToolView({ tool }: JsonToolViewProps) {
  const { t } = useTranslations("logs");

  // Reconstruct the original tool definition
  const toolJson = {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  };

  return (
    <pre
      style={{
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: 12,
        background: "#fafafa",
        padding: 12,
        borderRadius: 4,
        maxHeight: 300,
        overflow: "auto",
      }}
    >
      {JSON.stringify(toolJson, null, 2)}
    </pre>
  );
}
