"use client";
import { Alert } from "antd";
import { useDeletedTeams } from "@/app/(dashboard)/hooks/teams/useTeams";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { DeletedTeamsTable } from "./DeletedTeamsTable/DeletedTeamsTable";
import { useTranslations } from "@/i18n";

export default function DeletedTeamsPage() {
  const { t } = useTranslations("organization");
  const { premiumUser } = useAuthorized();
  const { data: teamsData, isPending: isLoading, isFetching } = useDeletedTeams(1, 100);

  return (
    <div className="flex flex-col gap-4">
      {!premiumUser && (
        <Alert
          type="info"
          banner
          showIcon
          message={t("comingSoonToEnterprise")}
          description={t("deletedTeamAuditingDescription")}
        />
      )}
      <DeletedTeamsTable teams={teamsData || []} isLoading={isLoading} isFetching={isFetching} />
    </div>
  );
}
