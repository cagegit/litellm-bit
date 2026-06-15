"use client";

import React, { useEffect, useRef } from "react";
import { notification, message, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { setNotificationInstance } from "@/components/molecules/notifications_manager";
import { setMessageInstance } from "@/components/molecules/message_manager";
import { useLocale } from "@/i18n";

export default function AntdGlobalProvider({ children }: { children: React.ReactNode }) {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  const initialized = useRef(false);
  const { locale } = useLocale();
  const antdLocale = locale === "zh" ? zhCN : enUS;

  useEffect(() => {
    if (!initialized.current) {
      setNotificationInstance(notificationApi);
      setMessageInstance(messageApi);
      initialized.current = true;
    }
  }, [notificationApi, messageApi]);

  return (
    <ConfigProvider locale={antdLocale}>
      {notificationContextHolder}
      {messageContextHolder}
      {children}
    </ConfigProvider>
  );
}
