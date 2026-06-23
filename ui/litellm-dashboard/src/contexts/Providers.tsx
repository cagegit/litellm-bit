"use client";

import { I18nProvider } from "@/i18n";
import AntdGlobalProvider from "@/contexts/AntdGlobalProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "@/contexts/ReactQueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ReactQueryProvider>
        <AntdGlobalProvider>
          <AuthProvider>{children}</AuthProvider>
        </AntdGlobalProvider>
      </ReactQueryProvider>
    </I18nProvider>
  );
}
