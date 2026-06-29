import React from "react";
import { MessageType } from "@/components/chat_ui/types";
import { useTranslations } from "@/i18n";

interface AudioRendererProps {
  message: MessageType;
}

const AudioRenderer: React.FC<AudioRendererProps> = ({ message }) => {
  const { t } = useTranslations("common");

  // Check if this message contains audio
  if (!message.isAudio || typeof message.content !== "string") {
    return null;
  }

  return (
    <div className="mb-2">
      <audio controls src={message.content} className="max-w-full" style={{ maxWidth: "500px" }}>
        {t("yourBrowserDoesNotSupportTheAudioElement")}
      </audio>
    </div>
  );
};

export default AudioRenderer;
