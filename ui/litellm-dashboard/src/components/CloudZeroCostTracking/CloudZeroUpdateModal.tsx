import { useCloudZeroUpdateSettings } from "@/app/(dashboard)/hooks/cloudzero/useCloudZeroSettings";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { Form, Input, Modal } from "antd";
import MessageManager from "@/components/molecules/message_manager";
import { useTranslations } from "@/i18n";
import { useEffect } from "react";
import { CloudZeroSettings } from "./types";

interface CloudZeroUpdateModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  settings: CloudZeroSettings;
}

export default function CloudZeroUpdateModal({ open, onOk, onCancel, settings }: CloudZeroUpdateModalProps) {
  const { accessToken } = useAuthorized();
  const { t } = useTranslations("billing");
  const [form] = Form.useForm();
  const updateMutation = useCloudZeroUpdateSettings(accessToken || "");

  useEffect(() => {
    if (open && settings) {
      form.setFieldsValue({
        connection_id: settings.connection_id,
        timezone: settings.timezone || "UTC",
        api_key: "",
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, settings, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      updateMutation.mutate(
        {
          connection_id: values.connection_id,
          timezone: values.timezone || "UTC",
          ...(values.api_key && { api_key: values.api_key }),
        },
        {
          onSuccess: () => {
            MessageManager.success(t("cloudZeroUpdatedSuccessfully"));
            form.resetFields();
            onOk();
          },
          onError: (error: any) => {
            if (error?.errorFields) {
              return;
            }
            MessageManager.error(error?.message || t("failedToUpdateCloudZero"));
          },
        },
      );
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }
      MessageManager.error(error?.message || t("failedToUpdateCloudZero"));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("editCloudZeroIntegration")}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={updateMutation.isPending}
      okText={updateMutation.isPending ? t("updating") : t("update")}
      cancelText={t("cancel")}
      okButtonProps={{
        disabled: updateMutation.isPending,
      }}
      cancelButtonProps={{
        disabled: updateMutation.isPending,
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("cloudZeroApiKey")}
          name="api_key"
          rules={[{ required: false, message: t("enterCloudZeroApiKey") }]}
          tooltip={t("leaveEmptyToKeepExisting")}
        >
          <Input.Password placeholder={t("leaveEmptyToKeepExistingPlaceholder")} />
        </Form.Item>
        <Form.Item
          label={t("connectionId")}
          name="connection_id"
          rules={[{ required: true, message: t("enterCloudZeroConnectionId") }]}
        >
          <Input placeholder={t("enterCloudZeroConnectionIdPlaceholder")} />
        </Form.Item>
        <Form.Item
          label={t("timezone")}
          name="timezone"
          tooltip={t("timezoneTooltip")}
        >
          <Input placeholder="UTC" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
