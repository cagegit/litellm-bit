"use client";

import {
  HIDE_AGENT_PLATFORM_BANNER_KEY,
  useHideAgentPlatformBanner,
} from "@/app/(dashboard)/hooks/useHideAgentPlatformBanner";
import { emitLocalStorageChange, setLocalStorageItem } from "@/utils/localStorageUtils";
import { useTranslations } from "@/i18n";
import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, Popover, Typography } from "antd";
import React, { useState } from "react";

export const AGENT_PLATFORM_URL = "https://github.com/BerriAI/litellm-agent-platform";

export const NotificationsBell: React.FC = () => {
  const { t } = useTranslations("common");
  const hidden = useHideAgentPlatformBanner();
  const hasUnread = !hidden;
  const [open, setOpen] = useState(false);

  const markDismissed = () => {
    setLocalStorageItem(HIDE_AGENT_PLATFORM_BANNER_KEY, "true");
    emitLocalStorageChange(HIDE_AGENT_PLATFORM_BANNER_KEY);
    setOpen(false);
  };

  const content = (
    <div className="max-w-[280px]">
      <Typography.Title level={5} className="!mt-0 !mb-2">
        {t("agentPlatform")}
      </Typography.Title>
      <Typography.Paragraph type="secondary" className="!mb-3 text-sm leading-snug">
        {t("agentPlatformDescription")}
      </Typography.Paragraph>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="primary" size="small" href={AGENT_PLATFORM_URL} target="_blank" rel="noopener noreferrer">
          {t("github")}
        </Button>
        {hasUnread ? (
          <Button type="link" size="small" className="!px-1" onClick={markDismissed}>
            {t("markAsRead")}
          </Button>
        ) : null}
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottomRight">
      <Button
        type="text"
        className="!flex !h-9 !w-9 items-center justify-center !rounded-md text-gray-600 transition-colors hover:!bg-gray-100 hover:!text-gray-900"
        aria-label={t("notifications")}
      >
        <Badge dot={hasUnread} color="#1677ff" size="small" offset={[8, 2]}>
          <BellOutlined className="text-base" aria-hidden />
        </Badge>
      </Button>
    </Popover>
  );
};
