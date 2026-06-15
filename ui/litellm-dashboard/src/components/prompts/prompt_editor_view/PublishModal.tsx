import React from "react";
import { Button as TremorButton, Text } from "@tremor/react";
import { Input, Modal } from "antd";
import { useTranslations } from "@/i18n";

interface PublishModalProps {
  visible: boolean;
  promptName: string;
  isSaving: boolean;
  onNameChange: (name: string) => void;
  onPublish: () => void;
  onCancel: () => void;
}

const PublishModal: React.FC<PublishModalProps> = ({
  visible,
  promptName,
  isSaving,
  onNameChange,
  onPublish,
  onCancel,
}) => {
  const { t } = useTranslations("prompts");
  return (
    <Modal
      title={t("publishPrompt")}
      open={visible}
      onCancel={onCancel}
      footer={[
        <div key="footer" className="flex justify-end gap-2">
          <TremorButton variant="secondary" onClick={onCancel}>
            {t("cancel")}
          </TremorButton>
          <TremorButton onClick={onPublish} loading={isSaving}>
            {t("publish")}
          </TremorButton>
        </div>,
      ]}
    >
      <div className="py-4">
        <Text className="mb-2">{t("name")}</Text>
        <Input
          value={promptName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t("enterPromptName")}
          onPressEnter={onPublish}
          autoFocus
        />
        <Text className="text-gray-500 text-xs mt-2">{t("publishedPromptsHelp")}</Text>
      </div>
    </Modal>
  );
};

export default PublishModal;
