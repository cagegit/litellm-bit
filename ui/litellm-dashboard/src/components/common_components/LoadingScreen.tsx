import { cx } from "@/lib/cva.config";
import { useTranslations } from "@/i18n";
import { UiLoadingSpinner } from "../ui/ui-loading-spinner";

export default function LoadingScreen() {
  const { t } = useTranslations("common");
  return (
    <div className={cx("h-screen", "flex items-center justify-center gap-4")}>
      <div className="text-lg font-medium py-2 pr-4 border-r border-r-gray-200">{t("litellm")}</div>

      <div className="flex items-center justify-center gap-2">
        <UiLoadingSpinner className="size-4" />
        <span className="text-gray-600 text-sm">{t("loading")}</span>
      </div>
    </div>
  );
}
