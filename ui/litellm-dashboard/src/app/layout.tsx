"use client";

import { Inter } from "next/font/google";
import "./globals.css";

import AntdGlobalProvider from "@/contexts/AntdGlobalProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "@/contexts/ReactQueryProvider";
import { I18nProvider } from "@/i18n";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <title>LiteLLM Dashboard</title>
        <meta name="description" content="LiteLLM Proxy Admin UI" />
        <I18nProvider>
          <ReactQueryProvider>
            <AntdGlobalProvider>
              <AuthProvider>{children}</AuthProvider>
            </AntdGlobalProvider>
          </ReactQueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
