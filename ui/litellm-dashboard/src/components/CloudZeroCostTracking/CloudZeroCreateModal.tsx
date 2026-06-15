import { Form, Modal, Input } from "antd";
import MessageManager from "@/components/molecules/message_manager";
import { useTranslations } from "@/i18n";
import { useEffect } from "react";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { useCloudZeroCreate } from "@/app/(dashboard)/hooks/cloudzero/useCloudZeroCreate";

interface CloudZeroCreationModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export default function CloudZeroCreationModal({ open, onOk, onCancel }: CloudZeroCreationModalProps) {
  const { accessToken } = useAuthorized();
  const { t } = useTranslations("billing");
  const [form] = Form.useForm();
  const createMutation = useCloudZeroCreate(accessToken || "");

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createMutation.mutate(
        {
          connection_id: values.connection_id,
          timezone: values.timezone || "UTC",
          ...(values.api_key && { api_key: values.api_key }),
        },
        {
          onSuccess: () => {
            MessageManager.success(t("cloudZeroCreatedSuccessfully"));
            form.resetFields();
            onOk();
          },
          onError: (error: any) => {
            if (error?.errorFields) {
              return;
            }
            MessageManager.error(error?.message || t("failedToCreateCloudZero"));
          },
        },
      );
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }
      MessageManager.error(error?.message || t("failedToCreateCloudZero"));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("createCloudZeroIntegration")}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={createMutation.isPending}
      okText={createMutation.isPending ? t("creating") : t("create")}
      cancelText={t("cancel")}
      okButtonProps={{
        disabled: createMutation.isPending,
      }}
      cancelButtonProps={{
        disabled: createMutation.isPending,
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("cloudZeroApiKey")}
          name="api_key"
          rules={[{ required: true, message: t("enterCloudZeroApiKey") }]}
        >
          <Input.Password placeholder={t("enterCloudZeroApiKeyPlaceholder")} />
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
