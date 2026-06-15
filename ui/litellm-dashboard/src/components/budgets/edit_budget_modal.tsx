import React, { useEffect } from "react";
import { TextInput, Accordion, AccordionHeader, AccordionBody } from "@tremor/react";
import { Button as Button2, Modal, Form, InputNumber, Select } from "antd";
import { useUpdateBudget } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import { budgetItem } from "./budget_panel";
import NotificationsManager from "../molecules/notifications_manager";
import { useTranslations } from "@/i18n";

interface EditBudgetModalProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  existingBudget: budgetItem;
}
const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isModalVisible, setIsModalVisible, existingBudget }) => {
  const { t } = useTranslations("settings");
  const [form] = Form.useForm();
  const updateBudget = useUpdateBudget();

  useEffect(() => {
    form.setFieldsValue(existingBudget);
  }, [existingBudget, form]);

  const handleOk = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleUpdate = async (formValues: Record<string, any>) => {
    try {
      NotificationsManager.info(t("makingApiCall"));
      await updateBudget.mutateAsync(formValues);
      NotificationsManager.success(t("budgetUpdated"));
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating the budget:", error);
      NotificationsManager.fromBackend(t("errorUpdatingBudget", { error: String(error) }));
    }
  };

  return (
    <Modal
      title={t("editBudget")}
      open={isModalVisible}
      width={800}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        initialValues={existingBudget}
      >
        <>
          <Form.Item label={t("budgetId")} name="budget_id" help={t("budgetIdCannotBeChanged")}>
            <TextInput placeholder="" disabled={true} />
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
          <Button2 htmlType="submit">{t("save")}</Button2>
        </div>
      </Form>
    </Modal>
  );
};

export default EditBudgetModal;
