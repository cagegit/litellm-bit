import { useTranslations } from "@/i18n";
import React, { useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import MessageManager from "@/components/molecules/message_manager";
import { Button } from "@tremor/react";
import { registerClaudeCodePlugin } from "../networking";
import { validatePluginName, isValidSemanticVersion, isValidEmail, isValidUrl, parseKeywords } from "./helpers";

const { TextArea } = Input;
const { Option } = Select;

interface AddPluginFormProps {
  visible: boolean;
  onClose: () => void;
  accessToken: string | null;
  onSuccess: () => void;
}

const PREDEFINED_CATEGORIES = [
  "Development",
  "Productivity",
  "Learning",
  "Security",
  "Data & Analytics",
  "Integration",
  "Testing",
  "Documentation",
];

interface ParsedSource {
  source: "github" | "url" | "git-subdir";
  repo?: string;
  url?: string;
  path?: string;
}

interface ParsePreview {
  parsed: ParsedSource;
  label: string;
  suggestedName: string;
}

function parseGitHubUrl(raw: string): ParsePreview | null {
  // Strip protocol and trailing slashes/spaces
  let s = raw
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

  if (!s.startsWith("github.com/")) return null;

  // Remove "github.com/"
  const rest = s.slice("github.com/".length);
  const parts = rest.split("/");

  if (parts.length < 2) return null;

  const org = parts[0];
  const repo = parts[1];
  const repoBase = repo.replace(/\.git$/, "");

  // github.com/org/repo  (exactly 2 parts, or ends with .git)
  if (parts.length === 2 || (parts.length === 2 && repoBase)) {
    return {
      parsed: { source: "github", repo: `${org}/${repoBase}` },
      label: `GitHub repo — ${org}/${repoBase}`,
      suggestedName: repoBase,
    };
  }

  // github.com/org/repo/tree/branch/folder or /blob/branch/folder/FILE.md
  if (parts.length >= 5 && (parts[2] === "tree" || parts[2] === "blob")) {
    // parts[3] = branch, parts[4..] = path segments
    const pathParts = parts.slice(4);
    // If last segment looks like a file (has extension), drop it
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart.includes(".")) {
      pathParts.pop();
    }
    if (pathParts.length === 0) {
      // Path resolved to repo root — treat as plain github source
      return {
        parsed: { source: "github", repo: `${org}/${repoBase}` },
        label: `GitHub repo — ${org}/${repoBase}`,
        suggestedName: repoBase,
      };
    }
    const subPath = pathParts.join("/");
    const suggestedName = pathParts[pathParts.length - 1];
    return {
      parsed: {
        source: "git-subdir",
        url: `https://github.com/${org}/${repoBase}`,
        path: subPath,
      },
      label: `GitHub subdir — ${org}/${repoBase} @ ${subPath}`,
      suggestedName,
    };
  }

  return null;
}

const AddPluginForm: React.FC<AddPluginFormProps> = ({ visible, onClose, accessToken, onSuccess }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslations("claudeCodePlugins");
  const [urlPreview, setUrlPreview] = useState<ParsePreview | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const preview = parseGitHubUrl(val);
    setUrlPreview(preview);
    if (preview) {
      // Auto-fill name only if it's currently empty
      const currentName = form.getFieldValue("name");
      if (!currentName) {
        form.setFieldsValue({ name: preview.suggestedName });
      }
    }
  };

  const handleSubmit = async (values: any) => {
    if (!accessToken) {
      MessageManager.error(t("noAccessToken"));
      return;
    }

    if (!urlPreview) {
      MessageManager.error(t("enterValidGitHubUrl"));
      return;
    }

    if (!validatePluginName(values.name)) {
      MessageManager.error(t("skillNameKebabCase"));
      return;
    }

    if (values.version && !isValidSemanticVersion(values.version)) {
      MessageManager.error(t("versionSemantic"));
      return;
    }

    if (values.authorEmail && !isValidEmail(values.authorEmail)) {
      MessageManager.error(t("invalidEmail"));
      return;
    }

    if (values.homepage && !isValidUrl(values.homepage)) {
      MessageManager.error(t("invalidHomepageUrl"));
      return;
    }

    setIsSubmitting(true);
    try {
      const pluginData: any = {
        name: values.name.trim(),
        source: urlPreview.parsed,
      };

      if (values.version) pluginData.version = values.version.trim();
      if (values.description) pluginData.description = values.description.trim();
      if (values.authorName || values.authorEmail) {
        pluginData.author = {};
        if (values.authorName) pluginData.author.name = values.authorName.trim();
        if (values.authorEmail) pluginData.author.email = values.authorEmail.trim();
      }
      if (values.homepage) pluginData.homepage = values.homepage.trim();
      if (values.category) pluginData.category = values.category;
      if (values.keywords) pluginData.keywords = parseKeywords(values.keywords);
      if (values.domain) pluginData.domain = values.domain.trim();
      if (values.namespace) pluginData.namespace = values.namespace.trim();

      await registerClaudeCodePlugin(accessToken, pluginData);
      MessageManager.success(t("skillRegisteredSuccess"));
      form.resetFields();
      setUrlPreview(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error registering skill:", error);
      MessageManager.error(t("failedToRegisterSkill"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setUrlPreview(null);
    onClose();
  };

  return (
    <Modal title={t("addNewSkill")} open={visible} onCancel={handleCancel} footer={null} width={700} className="top-8">
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
        {/* Smart URL Input */}
        <Form.Item
          label={t("githubUrl")}
          name="skillUrl"
          rules={[{ required: true, message: t("pleaseEnterGitHubUrl") }]}
          tooltip={t("githubUrlTooltip")}
        >
          <Input placeholder={t("githubUrlPlaceholder")} className="rounded-lg" onChange={handleUrlChange} />
        </Form.Item>

        {/* Parsed preview */}
        {urlPreview && (
          <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            {t("detected", { label: urlPreview.label })}
          </div>
        )}

        {/* Skill Name */}
        <Form.Item
          label={t("skillName")}
          name="name"
          rules={[
            { required: true, message: t("pleaseEnterSkillName") },
            {
              pattern: /^[a-z0-9-]+$/,
              message: t("skillNamePattern"),
            },
          ]}
          tooltip={t("skillNameTooltip")}
        >
          <Input placeholder={t("skillNamePlaceholder")} className="rounded-lg" />
        </Form.Item>

        {/* Domain and Namespace — side by side */}
        <div className="flex gap-4">
          <Form.Item label={t("domainOptional")} name="domain" tooltip={t("domainTooltip")} className="flex-1">
            <Input placeholder={t("domainPlaceholder")} className="rounded-lg" />
          </Form.Item>
          <Form.Item label={t("namespaceOptional")} name="namespace" tooltip={t("namespaceTooltip")} className="flex-1">
            <Input placeholder={t("namespacePlaceholder")} className="rounded-lg" />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item label={t("descriptionOptional")} name="description" tooltip={t("descriptionTooltip")}>
          <TextArea rows={3} placeholder={t("descriptionPlaceholder")} maxLength={500} className="rounded-lg" />
        </Form.Item>

        {/* Category */}
        <Form.Item label={t("categoryOptional")} name="category" tooltip={t("categoryTooltip")}>
          <Select
            placeholder={t("categoryPlaceholder")}
            allowClear
            showSearch
            optionFilterProp="children"
            className="rounded-lg"
          >
            {PREDEFINED_CATEGORIES.map((cat) => {
              const key = "category" + cat.replace(/[\s&]/g, "");
              return (
                <Option key={cat} value={cat}>
                  {t(key)}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {/* Keywords */}
        <Form.Item label={t("keywordsOptional")} name="keywords" tooltip={t("keywordsTooltip")}>
          <Input placeholder={t("keywordsPlaceholder")} className="rounded-lg" />
        </Form.Item>

        {/* Version */}
        <Form.Item label={t("versionOptional")} name="version" tooltip={t("versionTooltip")}>
          <Input placeholder={t("versionPlaceholder")} className="rounded-lg" />
        </Form.Item>

        {/* Author Name */}
        <Form.Item label={t("authorNameOptional")} name="authorName" tooltip={t("authorNameTooltip")}>
          <Input placeholder={t("authorNamePlaceholder")} className="rounded-lg" />
        </Form.Item>

        {/* Author Email */}
        <Form.Item
          label={t("authorEmailOptional")}
          name="authorEmail"
          rules={[{ type: "email", message: t("pleaseEnterValidEmail") }]}
          tooltip={t("authorEmailTooltip")}
        >
          <Input type="email" placeholder={t("authorEmailPlaceholder")} className="rounded-lg" />
        </Form.Item>

        {/* Submit Buttons */}
        <Form.Item className="mb-0 mt-6">
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? t("adding") : t("addSkill")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPluginForm;
