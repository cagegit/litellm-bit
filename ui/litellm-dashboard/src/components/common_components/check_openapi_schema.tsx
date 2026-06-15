import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { TextInput } from "@tremor/react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { getOpenAPISchema } from "../networking";
import { formatLabel } from "@/utils/textUtils";
import { useTranslations } from "@/i18n";

interface SchemaProperty {
  type?: string;
  title?: string;
  description?: string;
  anyOf?: Array<{ type: string }>;
  enum?: string[];
  format?: string;
}

interface OpenAPISchema {
  properties: {
    [key: string]: SchemaProperty;
  };
  required?: string[];
}

interface SchemaFormFieldsProps {
  schemaComponent: string;
  excludedFields?: string[];
  form: any;
  overrideLabels?: { [key: string]: string };
  overrideTooltips?: { [key: string]: string };
  customValidation?: {
    [key: string]: (rule: any, value: any) => Promise<void>;
  };
  defaultValues?: { [key: string]: any };
}

// Define which fields should be parsed as JSON
export const jsonFields = ["metadata", "config", "enforced_params", "aliases"];

// Helper function to determine if a field should be treated as JSON
const isJSONField = (key: string, property: SchemaProperty): boolean => {
  return jsonFields.includes(key) || property.format === "json";
};

// Helper function to validate JSON input
const validateJSON = (value: string): boolean => {
  if (!value) return true;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const SchemaFormFields: React.FC<SchemaFormFieldsProps> = ({
  schemaComponent,
  excludedFields = [],
  form,
  overrideLabels = {},
  overrideTooltips = {},
  customValidation = {},
  defaultValues = {},
}) => {
  const { t } = useTranslations("common");

  const getFieldHelp = (key: string, property: SchemaProperty, type: string): string => {
    const defaultHelp =
      {
        string: t("textInput"),
        number: t("numericInput"),
        integer: t("wholeNumberInput"),
        boolean: t("trueFalseValue"),
      }[type] || t("textInput");

    const specificHelp: { [key: string]: string } = {
      max_budget: t("helpMaxBudget"),
      budget_duration: t("helpBudgetDuration"),
      tpm_limit: t("helpTpmLimit"),
      rpm_limit: t("helpRpmLimit"),
      duration: t("helpDuration"),
      metadata: t("helpMetadata"),
      config: t("helpConfig"),
      permissions: t("helpPermissions"),
      enforced_params: t("helpEnforcedParams"),
      blocked: t("helpBlocked"),
      aliases: t("helpAliases"),
      models: t("helpModels"),
      key_alias: t("helpKeyAlias"),
      tags: t("helpTags"),
    };

    const helpText = specificHelp[key] || defaultHelp;

    if (isJSONField(key, property)) {
      return `${helpText}\n${t("mustBeValidJSON")}`;
    }

    if (property.enum) {
      return `${t("selectFromOptions")}\n${t("allowedValues")}${property.enum.join(", ")}`;
    }

    return helpText;
  };

  const [schemaProperties, setSchemaProperties] = useState<OpenAPISchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpenAPISchema = async () => {
      try {
        const schema = await getOpenAPISchema();
        const componentSchema = schema.components.schemas[schemaComponent];

        if (!componentSchema) {
          throw new Error(`${t("schemaComponentNotFound")} "${schemaComponent}"`);
        }

        setSchemaProperties(componentSchema);

        const defaultFormValues: { [key: string]: any } = {};
        Object.keys(componentSchema.properties)
          .filter((key) => !excludedFields.includes(key) && defaultValues[key] !== undefined)
          .forEach((key) => {
            defaultFormValues[key] = defaultValues[key];
          });

        form.setFieldsValue(defaultFormValues);
      } catch (error) {
        console.error("Schema fetch error:", error);
        setError(error instanceof Error ? error.message : t("failedToFetchSchema"));
      }
    };

    fetchOpenAPISchema();
  }, [schemaComponent, form, excludedFields]);

  const getPropertyType = (property: SchemaProperty): string => {
    if (property.type) {
      return property.type;
    }
    if (property.anyOf) {
      const types = property.anyOf.map((t) => t.type);
      if (types.includes("number") || types.includes("integer")) return "number";
      if (types.includes("string")) return "string";
    }
    return "string";
  };

  const renderFormItem = (key: string, property: SchemaProperty) => {
    const type = getPropertyType(property);
    const isRequired = schemaProperties?.required?.includes(key);

    const label = overrideLabels[key] || property.title || formatLabel(key);
    const tooltip = overrideTooltips[key] || property.description;

    const rules = [];
    if (isRequired) {
      rules.push({ required: true, message: `${label} ${t("isRequired")}` });
    }
    if (customValidation[key]) {
      rules.push({ validator: customValidation[key] });
    }
    if (isJSONField(key, property)) {
      rules.push({
        validator: async (_: any, value: string) => {
          if (value && !validateJSON(value)) {
            throw new Error(t("pleaseEnterValidJSON"));
          }
        },
      });
    }

    const formLabel = tooltip ? (
      <span>
        {label}{" "}
        <Tooltip title={tooltip}>
          <InfoCircleOutlined style={{ marginLeft: "4px" }} />
        </Tooltip>
      </span>
    ) : (
      label
    );

    let inputComponent;
    if (isJSONField(key, property)) {
      inputComponent = <Input.TextArea rows={4} placeholder={t("enterAsJSON")} className="font-mono" />;
    } else if (property.enum) {
      inputComponent = (
        <Select>
          {property.enum.map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      );
    } else if (type === "number" || type === "integer") {
      inputComponent = <InputNumber style={{ width: "100%" }} precision={type === "integer" ? 0 : undefined} />;
    } else if (key === "duration") {
      inputComponent = <TextInput placeholder={t("durationPlaceholder")} />;
    } else {
      inputComponent = <TextInput placeholder={tooltip || ""} />;
    }

    return (
      <Form.Item
        key={key}
        label={formLabel}
        name={key}
        className="mt-8"
        rules={rules}
        initialValue={defaultValues[key]}
        help={<div className="text-xs text-gray-500">{getFieldHelp(key, property, type)}</div>}
      >
        {inputComponent}
      </Form.Item>
    );
  };

  if (error) {
    return (
      <div className="text-red-500">
        {t("error")}: {error}
      </div>
    );
  }

  if (!schemaProperties?.properties) {
    return null;
  }

  return (
    <div>
      {Object.entries(schemaProperties.properties)
        .filter(([key]) => !excludedFields.includes(key))
        .map(([key, property]) => renderFormItem(key, property))}
    </div>
  );
};

export default SchemaFormFields;
