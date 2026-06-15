import React from "react";
import { useTranslations } from "@/i18n";
import { Table, Badge, Tooltip } from "antd";
import MessageManager from "@/components/molecules/message_manager";
import { EyeOutlined, CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { DocumentUpload } from "./types";

interface DocumentsTableProps {
  documents: DocumentUpload[];
  onRemove: (uid: string) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ documents, onRemove }) => {
  const { t } = useTranslations("vectorStore");
  const handleCopyId = (uid: string) => {
    navigator.clipboard.writeText(uid);
    MessageManager.success(t("documentIdCopied"));
  };

  const getStatusBadge = (status: DocumentUpload["status"]) => {
    const statusConfig = {
      uploading: { color: "blue", text: t("uploading") },
      done: { color: "green", text: t("ready") },
      error: { color: "red", text: t("error") },
      removed: { color: "default", text: t("removed") },
    };

    const config = statusConfig[status];
    return <Badge color={config.color} text={config.text} />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return t("na");
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} ${t("kilobyte")}`;
    return `${(kb / 1024).toFixed(2)} ${t("megabyte")}`;
  };

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (name: string, record: DocumentUpload) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{name}</span>
          {record.size && <span className="text-xs text-gray-400">({formatFileSize(record.size)})</span>}
        </div>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: DocumentUpload["status"]) => getStatusBadge(status),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 120,
      render: (_: any, record: DocumentUpload) => (
        <div className="flex items-center space-x-2">
          <Tooltip title={t("viewDetails")}>
            <EyeOutlined
              className="cursor-pointer text-gray-600 hover:text-blue-500"
              onClick={() => console.log("View", record)}
            />
          </Tooltip>
          <Tooltip title={t("copyId")}>
            <CopyOutlined
              className="cursor-pointer text-gray-600 hover:text-blue-500"
              onClick={() => handleCopyId(record.uid)}
            />
          </Tooltip>
          <Tooltip title={t("remove")}>
            <DeleteOutlined
              className="cursor-pointer text-gray-600 hover:text-red-500"
              onClick={() => onRemove(record.uid)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={documents}
      columns={columns}
      rowKey="uid"
      pagination={false}
      locale={{
        emptyText: t("noDocuments"),
      }}
      size="small"
    />
  );
};

export default DocumentsTable;
