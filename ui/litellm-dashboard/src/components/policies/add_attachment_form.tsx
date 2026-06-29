import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Radio, Divider, Typography } from "antd";
import { Button } from "@tremor/react";
import { Policy } from "./types";
import { teamListCall, keyListCall, modelAvailableCall, estimateAttachmentImpactCall } from "../networking";
import NotificationsManager from "../molecules/notifications_manager";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { buildAttachmentData } from "./build_attachment_data";
import ImpactPreviewAlert from "./impact_preview_alert";
import { useTranslations } from "@/i18n";

const { Text } = Typography;

interface AddAttachmentFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string | null;
  policies: Policy[];
  createAttachment: (accessToken: string, attachmentData: any) => Promise<any>;
}

const AddAttachmentForm: React.FC<AddAttachmentFormProps> = ({
  visible,
  onClose,
  onSuccess,
  accessToken,
  policies,
  createAttachment,
}) => {
  const { t } = useTranslations("settings");

  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scopeType, setScopeType] = useState<"global" | "specific">("global");
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [availableKeys, setAvailableKeys] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [impactResult, setImpactResult] = useState<any>(null);
  const { userId, userRole } = useAuthorized();

  useEffect(() => {
    if (visible && accessToken) {
      loadTeamsKeysAndModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, accessToken]);

  const loadTeamsKeysAndModels = async () => {
    if (!accessToken) return;

    // Load teams — teamListCall returns a plain array of team objects
    setIsLoadingTeams(true);
    try {
      const teamsResponse = await teamListCall(accessToken, null, userId);
      const teamsArray = Array.isArray(teamsResponse) ? teamsResponse : teamsResponse?.data || [];
      const teamAliases = teamsArray.map((t: any) => t.team_alias).filter(Boolean);
      setAvailableTeams(teamAliases);
    } catch (error) {
      console.error("Failed to load teams:", error);
    } finally {
      setIsLoadingTeams(false);
    }

    // Load keys — keyListCall returns {keys: [...], total_count, ...}
    setIsLoadingKeys(true);
    try {
      const keysResponse = await keyListCall(accessToken, null, null, null, null, null, 1, 100);
      const keysArray = keysResponse?.keys || keysResponse?.data || [];
      const keyAliases = keysArray.map((k: any) => k.key_alias).filter(Boolean);
      setAvailableKeys(keyAliases);
    } catch (error) {
      console.error("Failed to load keys:", error);
    } finally {
      setIsLoadingKeys(false);
    }

    // Load models
    setIsLoadingModels(true);
    try {
      const modelsResponse = await modelAvailableCall(accessToken, userId || "", userRole || "");
      const modelsArray = modelsResponse?.data || (Array.isArray(modelsResponse) ? modelsResponse : []);
      const modelIds = modelsArray.map((m: any) => m.id || m.model_name).filter(Boolean);
      setAvailableModels(modelIds);
    } catch (error) {
      console.error("Failed to load models:", error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setScopeType("global");
    setImpactResult(null);
  };

  const handlePreviewImpact = async () => {
    if (!accessToken) return;
    try {
      await form.validateFields(["policy_names"]);
    } catch {
      return;
    }
    setIsEstimating(true);
    try {
      const { policy_names = [] } = form.getFieldsValue(true);
      const firstPolicy = policy_names?.[0];
      if (!firstPolicy) return;
      const data = buildAttachmentData(
        {
          ...form.getFieldsValue(true),
          policy_name: firstPolicy,
        },
        scopeType,
      );
      const result = await estimateAttachmentImpactCall(accessToken, data);
      setImpactResult(result);
    } catch (error) {
      console.error("Failed to estimate impact:", error);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await form.validateFields();

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const values = form.getFieldsValue(true);
      const selectedPolicyNames: string[] = values.policy_names || [];

      const results = await Promise.allSettled(
        selectedPolicyNames.map((policyName) => {
          const data = buildAttachmentData(
            {
              ...values,
              policy_name: policyName,
            },
            scopeType,
          );
          return createAttachment(accessToken, data);
        }),
      );

      const successCount = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];

      if (successCount > 0 && failed.length === 0) {
        NotificationsManager.success(
          successCount === 1 ? "Attachment created successfully" : `${successCount} attachments created successfully`,
        );
      } else if (successCount > 0 && failed.length > 0) {
        NotificationsManager.fromBackend(`${successCount} attachments created, ${failed.length} failed`);
      } else {
        throw new Error(failed[0]?.reason instanceof Error ? failed[0].reason.message : "Failed to create attachments");
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create attachment:", error);
      NotificationsManager.fromBackend(
        "Failed to create attachment: " + (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const policyOptions = policies.map((p) => ({
    label: p.policy_name,
    value: p.policy_name,
  }));

  return (
    <Modal title={t("createPolicyAttachment")} open={visible} onCancel={handleClose} footer={null} width={600}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          scope_type: "global",
        }}
      >
        <Form.Item
          name="policy_names"
          label={t("policies")}
          rules={[{ required: true, message: t("pleaseSelectAtLeastOnePolicy") }]}
        >
          <Select
            mode="multiple"
            placeholder={t("selectPoliciesToAttach")}
            options={policyOptions}
            showSearch
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Divider orientation="left">
          <Text strong>{t("scope")}</Text>
        </Divider>

        <Form.Item label={t("scopeType")}>
          <Radio.Group value={scopeType} onChange={(e) => setScopeType(e.target.value)}>
            <Radio value="specific">{t("specificteamsKeysModelsOrTags")}</Radio>
            <Radio value="global">{t("globalappliesToAllRequests")}</Radio>
          </Radio.Group>
        </Form.Item>

        {scopeType === "specific" && (
          <>
            <Form.Item
              name="teams"
              label={t("teams")}
              tooltip={t("selectTeamAliasesOrEnterCustomPatternsSupportsWildcardsEGHealthcare")}
            >
              <Select
                mode="tags"
                placeholder={isLoadingTeams ? "Loading teams..." : "Select or enter team aliases"}
                loading={isLoadingTeams}
                options={availableTeams.map((team) => ({
                  label: team,
                  value: team,
                }))}
                tokenSeparators={[","]}
                showSearch
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="keys"
              label={t("keys")}
              tooltip={t("selectKeyAliasesOrEnterCustomPatternsSupportsWildcardsEGDev")}
            >
              <Select
                mode="tags"
                placeholder={isLoadingKeys ? "Loading keys..." : "Select or enter key aliases"}
                loading={isLoadingKeys}
                options={availableKeys.map((key) => ({
                  label: key,
                  value: key,
                }))}
                tokenSeparators={[","]}
                showSearch
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="models"
              label={t("models")}
              tooltip={t("modelNamesThisAttachmentAppliesToSupportsWildcardsEGGpt4LeaveEmptyToApplyToAllMo")}
            >
              <Select
                mode="tags"
                placeholder={
                  isLoadingModels ? "Loading models..." : "Select or enter model names (e.g., gpt-4, bedrock/*)"
                }
                loading={isLoadingModels}
                options={availableModels.map((model) => ({
                  label: model,
                  value: model,
                }))}
                tokenSeparators={[","]}
                showSearch
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="tags"
              label={t("tags")}
              tooltip={t("matchAgainstTagsSetInKeyOrTeamMetadataUseExactValuesEGHealthcareOrWildcardPatter")}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("matchesTagsFromKeyTeamMetadataOrRequestBody")} {t("useAsteriskAsSuffixWildcardDescription")}
                </Text>
              }
            >
              <Select
                mode="tags"
                placeholder={t("typeATagAndPressEnterEGHealthcareProd")}
                tokenSeparators={[",", " "]}
                notFoundContent={null}
                suffixIcon={null}
                open={false}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </>
        )}

        {impactResult && <ImpactPreviewAlert impactResult={impactResult} />}

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          {scopeType === "specific" && (
            <Button variant="secondary" onClick={handlePreviewImpact} loading={isEstimating}>
              {t("estimateImpact")}
            </Button>
          )}
          <Button onClick={handleSubmit} loading={isSubmitting}>
            {t("createAttachment")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddAttachmentForm;
