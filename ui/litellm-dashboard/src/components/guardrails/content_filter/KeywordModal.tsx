import React from "react";
import { Typography, Select, Modal, Space, Button, Input } from "antd";
import { useTranslations } from "@/i18n";

const { Text } = Typography;
const { Option } = Select;

interface KeywordModalProps {
  visible: boolean;
  keyword: string;
  action: "BLOCK" | "MASK";
  description: string;
  onKeywordChange: (keyword: string) => void;
  onActionChange: (action: "BLOCK" | "MASK") => void;
  onDescriptionChange: (description: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const KeywordModal: React.FC<KeywordModalProps> = ({
  visible,
  keyword,
  action,
  description,
  onKeywordChange,
  onActionChange,
  onDescriptionChange,
  onAdd,
  onCancel,
}) => {
  const { t } = useTranslations("common");
  return (
    <Modal title={t("addBlockedKeyword")} open={visible} onCancel={onCancel} footer={null} width={800}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div>
          <Text strong>{t("keyword")}</Text>
          <Input
            placeholder={t("enterSensitiveKeyword")}
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>

        <div>
          <Text strong>{t("action")}</Text>
          <Text type="secondary" style={{ display: "block", marginTop: 4, marginBottom: 8 }}>
            {t("chooseActionDescription")}
          </Text>
          <Select value={action} onChange={onActionChange} style={{ width: "100%" }}>
            <Option value="BLOCK">{t("block")}</Option>
            <Option value="MASK">{t("mask")}</Option>
          </Select>
        </div>

        <div>
          <Text strong>{t("descriptionOptional")}</Text>
          <Input.TextArea
            placeholder={t("explainKeywordSensitivity")}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            style={{ marginTop: 8 }}
          />
        </div>
      </Space>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "24px" }}>
        <Button onClick={onCancel}>{t("cancel")}</Button>
        <Button type="primary" onClick={onAdd}>
          {t("add")}
        </Button>
      </div>
    </Modal>
  );
};

export default KeywordModal;
