"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Typography } from "antd";
import { useTranslations } from "@/i18n";
import type { MemoryRow } from "../networking";

const { Text } = Typography;

interface MemoryEditModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialRow?: MemoryRow;
  onClose: () => void;
  onSave: (key: string, value: string, metadataText: string, isCreate: boolean) => Promise<boolean>;
}

export const MemoryEditModal: React.FC<MemoryEditModalProps> = ({ open, mode, initialRow, onClose, onSave }) => {
  const { t } = useTranslations("memoryView");
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialRow) {
      form.setFieldsValue({
        key: initialRow.key,
        value: initialRow.value,
        metadata: initialRow.metadata != null ? JSON.stringify(initialRow.metadata, null, 2) : "",
      });
    } else {
      form.resetFields();
    }
  }, [open, mode, initialRow, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    const ok = await onSave(values.key.trim(), values.value ?? "", values.metadata ?? "", mode === "create");
    setSubmitting(false);
    if (ok) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? t("createMemory") : `${t("edit")} ${initialRow?.key ?? ""}`}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText={mode === "create" ? t("create") : t("save")}
      confirmLoading={submitting}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t("key")}
          name="key"
          rules={[{ required: true, message: t("keyRequired") }]}
          tooltip={t("keyTooltip")}
        >
          <Input placeholder={t("keyPlaceholder")} disabled={mode === "edit"} />
        </Form.Item>
        <Form.Item
          label={t("value")}
          name="value"
          rules={[{ required: true, message: t("valueRequired") }]}
          tooltip={t("valueTooltip")}
        >
          <Input.TextArea rows={8} placeholder={t("valuePlaceholder")} />
        </Form.Item>
        <Form.Item
          label={
            <span>
              {t("metadata")} <Text type="secondary">{t("optionalJson")}</Text>
            </span>
          }
          name="metadata"
          tooltip={t("metadataTooltip")}
        >
          <Input.TextArea
            rows={4}
            placeholder={t("metadataPlaceholder")}
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemoryEditModal;
