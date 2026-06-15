import React from "react";
import { Typography, Select, Table, Tag, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslations } from "@/i18n";

const { Text } = Typography;
const { Option } = Select;

interface Pattern {
  id: string;
  type: "prebuilt" | "custom";
  name: string;
  display_name?: string;
  pattern?: string;
  action: "BLOCK" | "MASK";
}

interface PatternTableProps {
  patterns: Pattern[];
  onActionChange: (id: string, action: "BLOCK" | "MASK") => void;
  onRemove: (id: string) => void;
}

const PatternTable: React.FC<PatternTableProps> = ({ patterns, onActionChange, onRemove }) => {
  const { t } = useTranslations("common");

  const columns = [
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color={type === "prebuilt" ? "blue" : "green"}>{type === "prebuilt" ? t("prebuilt") : t("custom")}</Tag>
      ),
    },
    {
      title: t("patternName"),
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Pattern) => record.display_name || record.name,
    },
    {
      title: t("regexPattern"),
      dataIndex: "pattern",
      key: "pattern",
      render: (pattern: string) =>
        pattern ? (
          <Text code style={{ fontSize: 12 }}>
            {pattern.substring(0, 40)}...
          </Text>
        ) : (
          t("none")
        ),
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (action: string, record: Pattern) => (
        <Select
          value={action}
          onChange={(value) => onActionChange(record.id, value as "BLOCK" | "MASK")}
          style={{ width: 120 }}
          size="small"
        >
          <Option value="BLOCK">{t("block")}</Option>
          <Option value="MASK">{t("mask")}</Option>
        </Select>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_: any, record: Pattern) => (
        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => onRemove(record.id)}>
          {t("delete")}
        </Button>
      ),
    },
  ];

  if (patterns.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>{t("noData")}</div>;
  }

  return <Table dataSource={patterns} columns={columns} rowKey="id" pagination={false} size="small" />;
};

export default PatternTable;
