"use client";
import { useTranslations } from "@/i18n";

import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Typography } from "antd";
import type { MemoryRow } from "@/components/networking";

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
      title={mode === "create" ? "Create memory" : `Edit ${initialRow?.key ?? ""}`}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText={mode === "create" ? "Create" : "Save"}
      confirmLoading={submitting}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t("key")}
          name="key"
          rules={[{ required: true, message: t("keyIsRequired") }]}
          tooltip={t("keyTooltip")}
        >
          <Input placeholder={t("keyPlaceholder")} disabled={mode === "edit"} />
        </Form.Item>
        <Form.Item
          label={t("value")}
          name="value"
          rules={[{ required: true, message: t("valueIsRequired") }]}
          tooltip="Markdown/text injected into LLM context. Plain strings are fine."
        >
          <Input.TextArea rows={8} placeholder={t("memoryPlaceholder")} />
        </Form.Item>
        <Form.Item
          label={
            <span>
              {t("metadata1")} <Text type="secondary">{t("optionalJson")}</Text>
            </span>
          }
          name={t("metadata")}
          tooltip={t("metadataTooltip")}
        >
          <Input.TextArea
            rows={4}
            placeholder='{"tags": ["example"]}'
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemoryEditModal;
