import { KeyResponse } from "@/components/key_team_helpers/key_list";
import { Empty, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SpinProps } from "antd";
import DefaultProxyAdminTag from "../common_components/DefaultProxyAdminTag";
import { useTranslations } from "@/i18n";

interface ProjectKeysTableProps {
  keys: KeyResponse[];
  loading?: boolean | SpinProps;
}

export function ProjectKeysTable({ keys, loading }: ProjectKeysTableProps) {
  const { t } = useTranslations("common");

  const columns: ColumnsType<KeyResponse> = [
    {
      title: t("keyName"),
      dataIndex: "key_alias",
      key: "key_alias",
      render: (alias: string | null) => alias || "—",
    },
    {
      title: t("owner"),
      key: "owner",
      render: (_: unknown, record: KeyResponse) => {
        const email = record.user?.user_email ?? record.user_id ?? null;
        if (!email) return "—";
        return (
          <Tooltip title={email}>
            <DefaultProxyAdminTag userId={email} />
          </Tooltip>
        );
      },
    },
    {
      title: t("created"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: t("lastActive"),
      dataIndex: "last_active",
      key: "last_active",
      render: (date: string | null) => (date ? new Date(date).toLocaleDateString() : t("never")),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={keys}
      rowKey="token"
      loading={loading}
      pagination={false}
      size="small"
      locale={{ emptyText: <Empty description={t("noKeysFound")} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
    />
  );
}
