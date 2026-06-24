import React from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { useTranslations } from "@/i18n";

type OnboardingFormBodyProps = {
  variant: "signup" | "reset_password";
  userEmail: string;
  isPending: boolean;
  claimError: string | null;
  onSubmit: (values: { password: string }) => void;
};

export function OnboardingFormBody({ variant, userEmail, isPending, claimError, onSubmit }: OnboardingFormBodyProps) {
  const [form] = Form.useForm();
  const { t } = useTranslations("auth");

  React.useEffect(() => {
    if (userEmail) form.setFieldValue("user_email", userEmail);
  }, [userEmail, form]);

  return (
    <div className="mx-auto w-full max-w-md mt-10">
      <Card>
        <Typography.Title level={5} className="text-center mb-5">
          {"\u{1F685}"} LiteLLM
        </Typography.Title>
        <Typography.Title level={3}>{variant === "reset_password" ? t("resetPassword") : t("signUp")}</Typography.Title>
        <Typography.Text>
          {variant === "reset_password"
            ? t("resetYourPassword")
            : t("claimYourAccount")}
        </Typography.Text>

        {variant === "signup" && (
          <Alert
            className="mt-4"
            type="info"
            message={t("sso")}
            description={
              <div className="flex justify-between items-center">
                <span>{t("ssoUnderEnterpriseTier")}</span>
                <Button type="primary" size="small" href="https://forms.gle/W3U4PZpJGFHWtHyA9" target="_blank">
                  {t("getFreeTrial")}
                </Button>
              </div>
            }
            showIcon
          />
        )}

        <Form
          className="mt-10 mb-5"
          layout="vertical"
          form={form}
          onFinish={(values) => onSubmit({ password: values.password })}
        >
          <Form.Item label={t("emailAddress")} name="user_email">
            <Input type="email" disabled />
          </Form.Item>

          <Form.Item
            label={t("password")}
            name="password"
            rules={[{ required: true, message: t("passwordRequiredToSignUp") }]}
            help={variant === "reset_password" ? t("enterYourNewPassword") : t("createAPassword")}
          >
            <Input.Password />
          </Form.Item>

          {claimError && <Alert type="error" message={claimError} showIcon className="mb-4" />}

          <div className="mt-10">
            <Button htmlType="submit" loading={isPending}>
              {variant === "reset_password" ? t("resetPassword") : t("signUp")}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
