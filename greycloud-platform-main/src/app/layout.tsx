import type { Metadata } from "next";
// import { Raleway as FontSans } from "next/font/google";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import Script from "next/script";

import { WEAVER_ENABLED } from "../lib/config";

const fontSans = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Systa.io",
  description:
    "Achieving cyber security maturity through a systematic risk-based approach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isWeaverDebug = process.env.NEXT_PUBLIC_WEAVER_DEBUG === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {WEAVER_ENABLED && !isWeaverDebug && (
          <link rel="stylesheet" href="/weaver/weaver.css" />
        )}
      </head>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <body
          className={cn(
            "flex min-h-screen flex-col items-center justify-center",
            fontSans.className
          )}
        >
          <main>{children}</main>
          <Toaster />
          {WEAVER_ENABLED && (
            <Script
              src={isWeaverDebug ? "http://localhost:5173/src/main.ts" : "/weaver/weaver.iife.js"}
              strategy="lazyOnload"
              type={isWeaverDebug ? "module" : undefined}
            />
          )}
        </body>
      </ThemeProvider>
    </html>
  );
}
