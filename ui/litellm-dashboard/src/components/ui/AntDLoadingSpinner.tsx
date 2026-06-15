import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslations } from "@/i18n";

interface AntDLoadingSpinnerProps {
  size?: "small" | "default" | "large";
  fontSize?: number;
}

export function AntDLoadingSpinner({ size, fontSize }: AntDLoadingSpinnerProps) {
  const { t } = useTranslations("common");

  const indicator = <LoadingOutlined style={fontSize ? { fontSize } : undefined} spin />;
  return <Spin indicator={indicator} size={size} />;
}
