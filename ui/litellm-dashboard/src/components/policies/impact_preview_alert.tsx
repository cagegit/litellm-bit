import React from "react";
import { useTranslations } from "@/i18n";
import { Alert, Tag, Typography } from "antd";

const { Text } = Typography;

interface ImpactResult {
  affected_keys_count: number;
  affected_teams_count: number;
  sample_keys: string[];
  sample_teams: string[];
}

interface ImpactPreviewAlertProps {
  impactResult: ImpactResult;
}

const ImpactPreviewAlert: React.FC<ImpactPreviewAlertProps> = ({ impactResult }) => {
  const { t } = useTranslations("common");
  return (
    <Alert
      type={impactResult.affected_keys_count === -1 ? "warning" : "info"}
      showIcon
      className="mb-4"
      message={t("impactPreview")}
      description={
        impactResult.affected_keys_count === -1 ? (
          <Text>
            {t("globalScopeLabel")} <strong>{t("allKeysAndTeams")}</strong>.
          </Text>
        ) : (
          <div>
            <Text>
              {t("thisAttachmentWouldAffect")}{" "}
              <strong>
                {impactResult.affected_keys_count} {impactResult.affected_keys_count !== 1 ? t("keys") : t("key")}
              </strong>{" "}
              {t("and")}{" "}
              <strong>
                {impactResult.affected_teams_count} {impactResult.affected_teams_count !== 1 ? t("teams") : t("team")}
              </strong>
              .
            </Text>
            {impactResult.sample_keys.length > 0 && (
              <div className="mt-1">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("keysLabel")}:{" "}
                </Text>
                {impactResult.sample_keys.slice(0, 5).map((k: string) => (
                  <Tag key={k} style={{ fontSize: 11 }}>
                    {k}
                  </Tag>
                ))}
                {impactResult.affected_keys_count > 5 && (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {t("andXMore", { count: impactResult.affected_keys_count - 5 })}
                  </Text>
                )}
              </div>
            )}
            {impactResult.sample_teams.length > 0 && (
              <div className="mt-1">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("teamsLabel")}:{" "}
                </Text>
                {impactResult.sample_teams.slice(0, 5).map((tm: string) => (
                  <Tag key={tm} style={{ fontSize: 11 }}>
                    {tm}
                  </Tag>
                ))}
                {impactResult.affected_teams_count > 5 && (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {t("andXMore", { count: impactResult.affected_teams_count - 5 })}
                  </Text>
                )}
              </div>
            )}
          </div>
        )
      }
    />
  );
};

export default ImpactPreviewAlert;
