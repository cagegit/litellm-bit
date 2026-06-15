import { KeyResponse } from "./key_list";
import { useTranslations } from "@/i18n";

export const transformKeyInfo = (apiResponse: any): KeyResponse => {
  const { key, info } = apiResponse;

  // Simply combine the key with all info fields
  return {
    token: key,
    ...info,
  } as KeyResponse;
};
