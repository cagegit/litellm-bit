import React from "react";
import { TextInput, Accordion, AccordionHeader, AccordionBody } from "@tremor/react";
import { Button as Button2, Modal, Form, InputNumber, Select } from "antd";
import { useCreateBudget } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import NotificationsManager from "../molecules/notifications_manager";
import { useTranslations } from "@/i18n";

interface BudgetModalProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const BudgetModal: React.FC<BudgetModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const [form] = Form.useForm();
  const createBudget = useCreateBudget();
  const { t } = useTranslations("settings");

  const handleOk = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreate = async (formValues: Record<string, any>) => {
    try {
      NotificationsManager.info(t("makingApiCall"));
      await createBudget.mutateAsync(formValues);
      NotificationsManager.success(t("budgetCreated"));
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating the budget:", error);
      NotificationsManager.fromBackend(t("errorCreatingBudget", { error: String(error) }));
    }
  };

  return (
    <Modal
      title={t("createBudget")}
      open={isModalVisible}
      width={800}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleCreate} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
        <>
          <Form.Item
            label={t("budgetId")}
            name="budget_id"
            rules={[
              {
                required: true,
                message: t("pleaseInputBudgetName"),
              },
            ]}
            help={t("budgetNameHelp")}
          >
            <TextInput placeholder="" />
          </Form.Item>
          <Form.Item label={t("maxTokensPerMinute")} name="tpm_limit" help={t("defaultIsModelLimit")}>
            <InputNumber step={1} precision={2} width={200} />
          </Form.Item>
          <Form.Item label={t("maxRequestsPerMinute")} name="rpm_limit" help={t("defaultIsModelLimit")}>
            <InputNumber step={1} precision={2} width={200} />
          </Form.Item>

          <Accordion className="mt-20 mb-8">
            <AccordionHeader>
              <b>{t("optionalSettings")}</b>
            </AccordionHeader>
            <AccordionBody>
              <Form.Item label={t("maxBudgetUsd")} name="max_budget">
                <InputNumber step={0.01} precision={2} width={200} />
              </Form.Item>
              <Form.Item className="mt-8" label={t("resetBudget")} name="budget_duration">
                <Select defaultValue={null} placeholder={t("na")}>
                  <Select.Option value="24h">{t("daily")}</Select.Option>
                  <Select.Option value="7d">{t("weekly")}</Select.Option>
                  <Select.Option value="30d">{t("monthly")}</Select.Option>
                </Select>
              </Form.Item>
            </AccordionBody>
          </Accordion>
        </>

        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <Button2 htmlType="submit">{t("createBudget")}</Button2>
        </div>
      </Form>
    </Modal>
  );
};

export default BudgetModal;
