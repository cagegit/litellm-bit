import { Badge } from "antd";
import { useDisableShowNewBadge } from "@/app/(dashboard)/hooks/useDisableShowNewBadge";
import { useTranslations } from "@/i18n";

export default function NewBadge({ children, dot = false }: { children?: React.ReactNode; dot?: boolean }) {
  const { t } = useTranslations("common");
  const disableShowNewBadge = useDisableShowNewBadge();

  if (disableShowNewBadge) {
    return children ? <>{children}</> : null;
  }

  return children ? (
    <Badge color="blue" count={dot ? undefined : t("new")} dot={dot}>
      {children}
    </Badge>
  ) : (
    <Badge color="blue" count={dot ? undefined : t("new")} dot={dot} />
  );
}
