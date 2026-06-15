/**
 * Allow proxy admin to add other people to view global spend
 * Use this to avoid sharing master key with others
 */
import { useTranslations } from "@/i18n";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import {
  Button,
  Callout,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Alert, Button as Button2, Form, Input, Modal, Space, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import NewBadge from "./common_components/NewBadge";
import { useBaseUrl } from "./constants";
import NotificationsManager from "./molecules/notifications_manager";
import { addAllowedIP, deleteAllowedIP, getAllowedIPs, getSSOSettings } from "./networking";
import SCIMConfig from "./SCIM";
import LoggingSettings from "./Settings/AdminSettings/LoggingSettings/LoggingSettings";
import SSOSettings from "./Settings/AdminSettings/SSOSettings/SSOSettings";
import UISettings from "./Settings/AdminSettings/UISettings/UISettings";
import HashicorpVault from "./Settings/AdminSettings/HashicorpVault/HashicorpVault";
import SSOModals from "./SSOModals";
import UIAccessControlForm from "./UIAccessControlForm";

const { Title, Paragraph, Text } = Typography;

interface AdminPanelProps {
  proxySettings?: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ proxySettings }) => {
  const { premiumUser, accessToken, userId: userID } = useAuthorized();
  const { t } = useTranslations("common");
  const [form] = Form.useForm();
  const [isAddSSOModalVisible, setIsAddSSOModalVisible] = useState(false);
  const [isInstructionsModalVisible, setIsInstructionsModalVisible] = useState(false);
  const [isAllowedIPModalVisible, setIsAllowedIPModalVisible] = useState(false);
  const [isAddIPModalVisible, setIsAddIPModalVisible] = useState(false);
  const [isDeleteIPModalVisible, setIsDeleteIPModalVisible] = useState(false);
  const [isUIAccessControlModalVisible, setIsUIAccessControlModalVisible] = useState(false);
  const [allowedIPs, setAllowedIPs] = useState<string[]>([]);
  const [ipToDelete, setIPToDelete] = useState<string | null>(null);
  const [ssoConfigured, setSsoConfigured] = useState<boolean>(false);

  const baseUrl = useBaseUrl();
  const all_ip_address_allowed = t("allIPAddressesAllowed");

  let nonSssoUrl = baseUrl;
  nonSssoUrl += "/fallback/login";

  const checkSSOConfiguration = async () => {
    if (accessToken) {
      try {
        const ssoData = await getSSOSettings(accessToken);

        if (ssoData && ssoData.values) {
          const hasGoogleSSO = ssoData.values.google_client_id && ssoData.values.google_client_secret;
          const hasMicrosoftSSO = ssoData.values.microsoft_client_id && ssoData.values.microsoft_client_secret;
          const hasGenericSSO = ssoData.values.generic_client_id && ssoData.values.generic_client_secret;

          setSsoConfigured(hasGoogleSSO || hasMicrosoftSSO || hasGenericSSO);
        } else {
          setSsoConfigured(false);
        }
      } catch (error) {
        console.error("Error checking SSO configuration:", error);
        setSsoConfigured(false);
      }
    }
  };

  const handleShowAllowedIPs = async () => {
    try {
      if (premiumUser !== true) {
        NotificationsManager.fromBackend(t("premiumUpgradeRequired"));
        return;
      }
      if (accessToken) {
        const data = await getAllowedIPs(accessToken);
        setAllowedIPs(data && data.length > 0 ? data : [all_ip_address_allowed]);
      } else {
        setAllowedIPs([all_ip_address_allowed]);
      }
    } catch (error) {
      console.error("Error fetching allowed IPs:", error);
      NotificationsManager.fromBackend(`${t("failedToFetchAllowedIPs")} ${error}`);
      setAllowedIPs([all_ip_address_allowed]);
    } finally {
      if (premiumUser === true) {
        setIsAllowedIPModalVisible(true);
      }
    }
  };

  const handleAddIP = async (values: { ip: string }) => {
    try {
      if (accessToken) {
        await addAllowedIP(accessToken, values.ip);
        // Fetch the updated list of IPs
        const updatedIPs = await getAllowedIPs(accessToken);
        setAllowedIPs(updatedIPs);
        NotificationsManager.success(t("ipAddressAdded"));
      }
    } catch (error) {
      console.error("Error adding IP:", error);
      NotificationsManager.fromBackend(`${t("failedToAddIP")} ${error}`);
    } finally {
      setIsAddIPModalVisible(false);
    }
  };

  const handleDeleteIP = async (ip: string) => {
    setIPToDelete(ip);
    setIsDeleteIPModalVisible(true);
  };

  const confirmDeleteIP = async () => {
    if (ipToDelete && accessToken) {
      try {
        await deleteAllowedIP(accessToken, ipToDelete);
        // Fetch the updated list of IPs
        const updatedIPs = await getAllowedIPs(accessToken);
        setAllowedIPs(updatedIPs.length > 0 ? updatedIPs : [all_ip_address_allowed]);
        NotificationsManager.success(t("ipAddressDeleted"));
      } catch (error) {
        console.error("Error deleting IP:", error);
        NotificationsManager.fromBackend(`${t("failedToDeleteIP")} ${error}`);
      } finally {
        setIsDeleteIPModalVisible(false);
        setIPToDelete(null);
      }
    }
  };

  const handleAddSSOOk = () => {
    setIsAddSSOModalVisible(false);
    form.resetFields();
    if (accessToken && premiumUser) {
      checkSSOConfiguration();
    }
  };

  const handleAddSSOCancel = () => {
    setIsAddSSOModalVisible(false);
    form.resetFields();
  };

  const handleShowInstructions = (formValues: Record<string, any>) => {
    setIsAddSSOModalVisible(false);
    setIsInstructionsModalVisible(true);
  };

  const handleInstructionsOk = () => {
    setIsInstructionsModalVisible(false);
    if (accessToken && premiumUser) {
      checkSSOConfiguration();
    }
  };

  const handleInstructionsCancel = () => {
    setIsInstructionsModalVisible(false);
    if (accessToken && premiumUser) {
      checkSSOConfiguration();
    }
  };

  useEffect(() => {
    checkSSOConfiguration();
  }, [accessToken, premiumUser, checkSSOConfiguration]);

  const handleUIAccessControlOk = () => {
    setIsUIAccessControlModalVisible(false);
  };

  const handleUIAccessControlCancel = () => {
    setIsUIAccessControlModalVisible(false);
  };

  const tabItems = [
    {
      key: "sso-settings",
      label: t("ssoSettings"),
      children: <SSOSettings />,
    },
    {
      key: "security-settings",
      label: t("securitySettings"),
      children: (
        <>
          <Card>
            <Title level={4}> ✨ {t("securitySettings")}</Title>
            <Alert
              message={t("ssoConfigurationDeprecated")}
              description={t("ssoDeprecatedDescription")}
              type="warning"
              showIcon
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
                marginLeft: "0.5rem",
              }}
            >
              <div>
                <Button style={{ width: "150px" }} onClick={() => setIsAddSSOModalVisible(true)}>
                  {ssoConfigured ? t("editSSOSettings") : t("addSSO")}
                </Button>
              </div>
              <div>
                <Button style={{ width: "150px" }} onClick={handleShowAllowedIPs}>
                  {t("allowedIPs")}
                </Button>
              </div>
              <div>
                <Button
                  style={{ width: "150px" }}
                  onClick={() =>
                    premiumUser === true
                      ? setIsUIAccessControlModalVisible(true)
                      : NotificationsManager.fromBackend(t("premiumRequiredForUIAccessControl"))
                  }
                >
                  {t("uiAccessControl")}
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-start mb-4">
            <SSOModals
              isAddSSOModalVisible={isAddSSOModalVisible}
              isInstructionsModalVisible={isInstructionsModalVisible}
              handleAddSSOOk={handleAddSSOOk}
              handleAddSSOCancel={handleAddSSOCancel}
              handleShowInstructions={handleShowInstructions}
              handleInstructionsOk={handleInstructionsOk}
              handleInstructionsCancel={handleInstructionsCancel}
              form={form}
              accessToken={accessToken}
              ssoConfigured={ssoConfigured}
            />
            <Modal
              title={t("manageAllowedIPAddresses")}
              width={800}
              open={isAllowedIPModalVisible}
              onCancel={() => setIsAllowedIPModalVisible(false)}
              footer={[
                <Button className="mx-1" key="add" onClick={() => setIsAddIPModalVisible(true)}>
                  {t("addIPAddress")}
                </Button>,
                <Button key="close" onClick={() => setIsAllowedIPModalVisible(false)}>
                  {t("close")}
                </Button>,
              ]}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>{t("ipAddress")}</TableHeaderCell>
                    <TableHeaderCell className="text-right">{t("actions")}</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allowedIPs.map((ip, index) => (
                    <TableRow key={index}>
                      <TableCell>{ip}</TableCell>
                      <TableCell className="text-right">
                        {ip !== all_ip_address_allowed && (
                          <Button onClick={() => handleDeleteIP(ip)} color="red" size="xs">
                            {t("delete")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Modal>

            <Modal
              title={t("addAllowedIPAddress")}
              open={isAddIPModalVisible}
              onCancel={() => setIsAddIPModalVisible(false)}
              footer={null}
            >
              <Form onFinish={handleAddIP}>
                <Form.Item name="ip" rules={[{ required: true, message: t("pleaseEnterIPAddress") }]}>
                  <Input placeholder={t("enterIPAddress")} />
                </Form.Item>
                <Form.Item>
                  <Button2 htmlType="submit">{t("addIPAddress")}</Button2>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title={t("confirmDelete")}
              open={isDeleteIPModalVisible}
              onCancel={() => setIsDeleteIPModalVisible(false)}
              onOk={confirmDeleteIP}
              footer={[
                <Button className="mx-1" key="delete" onClick={() => confirmDeleteIP()}>
                  {t("yes")}
                </Button>,
                <Button key="close" onClick={() => setIsDeleteIPModalVisible(false)}>
                  {t("close")}
                </Button>,
              ]}
            >
              <Text>{t("confirmDeleteIPAddress", { ip: ipToDelete ?? "" })}</Text>
            </Modal>

            {/* UI Access Control Modal */}
            <Modal
              title={t("uiAccessControlSettings")}
              open={isUIAccessControlModalVisible}
              width={600}
              footer={null}
              onOk={handleUIAccessControlOk}
              onCancel={handleUIAccessControlCancel}
            >
              <UIAccessControlForm
                accessToken={accessToken}
                onSuccess={() => {
                  handleUIAccessControlOk();
                  NotificationsManager.success(t("uiAccessControlSettingsUpdated"));
                }}
              />
            </Modal>
          </div>
          <Callout title={t("loginWithoutSSO")} color="teal">
            {t("loginWithoutSSOPrefix")}{" "}
            <a href={nonSssoUrl} target="_blank" rel="noopener noreferrer">
              <b>{nonSssoUrl}</b>{" "}
            </a>
          </Callout>
        </>
      ),
    },
    {
      key: "scim",
      label: t("scim"),
      children: <SCIMConfig accessToken={accessToken} userID={userID} proxySettings={proxySettings} />,
    },
    {
      key: "ui-settings",
      label: (
        <Space>
          <Text>
            {t("uiSettings")} <NewBadge />
          </Text>
        </Space>
      ),
      children: <UISettings />,
    },
    {
      key: "logging-settings",
      label: t("loggingSettings"),
      children: <LoggingSettings />,
    },
    {
      key: "hashicorp-vault",
      label: t("hashicorpVault"),
      children: <HashicorpVault />,
    },
  ];

  return (
    <div className="w-full m-2 mt-2 p-8">
      <Title level={4}>{t("adminAccess")}</Title>
      <Paragraph>{t("addAdminsDescription")}</Paragraph>
      <Tabs items={tabItems} />
    </div>
  );
};

export default AdminPanel;
