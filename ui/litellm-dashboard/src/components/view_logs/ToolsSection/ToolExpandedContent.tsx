/**
 * Expanded content for a tool with view mode toggle
 */

import { useState } from "react";
import { useTranslations } from "@/i18n";
import { Typography, Radio } from "antd";
import { ParsedTool } from "./types";
import { FormattedToolView } from "./FormattedToolView";
import { JsonToolView } from "./JsonToolView";

const { Text } = Typography;

type ViewMode = "formatted" | "json";

interface ToolExpandedContentProps {
  tool: ParsedTool;
}

export function ToolExpandedContent({ tool }: ToolExpandedContentProps) {
  const { t } = useTranslations("logs");
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");

  return (
    <div>
      {/* View Mode Toggle - Top Right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t("description")}
        </Text>
        <Radio.Group size="small" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <Radio.Button value="formatted">{t("formatted")}</Radio.Button>
          <Radio.Button value="json">{t("json")}</Radio.Button>
        </Radio.Group>
      </div>

      {viewMode === "formatted" ? <FormattedToolView tool={tool} /> : <JsonToolView tool={tool} />}
    </div>
  );
}
