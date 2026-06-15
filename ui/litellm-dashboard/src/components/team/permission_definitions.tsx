import { useTranslations } from "@/i18n";

export interface PermissionInfo {
  method: string;
  endpoint: string;
  description: string;
  route: string;
}

/**
 * Returns translated permission descriptions
 */
export const getPermissionDescriptions = (t: (key: string) => string): Record<string, string> => ({
  "/key/generate": t("keyGenerate"),
  "/key/service-account/generate": t("serviceAccountGenerate"),
  "/key/update": t("keyUpdate"),
  "/key/delete": t("keyDelete"),
  "/key/info": t("keyInfo"),
  "/key/regenerate": t("keyRegenerate"),
  "/key/{key_id}/regenerate": t("keyRegenerate"),
  "/key/list": t("keyList"),
  "/key/block": t("keyBlock"),
  "/key/unblock": t("keyUnblock"),
  "/key/access_group_assignment": t("accessGroupAssignment"),
  "/team/daily/activity": t("teamDailyActivity"),
  "/spend/logs": t("spendLogs"),
});

/**
 * Determines the HTTP method for a given permission endpoint
 */
export const getMethodForEndpoint = (endpoint: string): string => {
  if (
    endpoint.includes("/info") ||
    endpoint.includes("/list") ||
    endpoint.includes("/activity") ||
    endpoint === "/spend/logs"
  ) {
    return "GET";
  }
  return "POST";
};

/**
 * Parses a permission string into a structured PermissionInfo object
 * @param t - Optional translation function. If provided, descriptions will be translated.
 */
export const getPermissionInfo = (permission: string, t?: (key: string) => string): PermissionInfo => {
  const method = getMethodForEndpoint(permission);
  const endpoint = permission;
  const descriptions = t ? getPermissionDescriptions(t) : {};

  // Find exact match or fallback to default description
  let description = descriptions[permission] || "";

  // If no exact match, try to find a partial match based on patterns
  if (!description) {
    for (const [pattern, desc] of Object.entries(descriptions)) {
      if (permission.includes(pattern)) {
        description = desc;
        break;
      }
    }
  }

  // Fallback if no match found
  if (!description) {
    description = t ? `${t("access")} ${permission}` : `Access ${permission}`;
  }

  return {
    method,
    endpoint,
    description,
    route: permission,
  };
};

/**
 * Hook version of getPermissionInfo for use in React components
 */
export const usePermissionInfo = (permission: string): PermissionInfo => {
  const { t } = useTranslations("users");
  return getPermissionInfo(permission, t);
};
