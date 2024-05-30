import type { Metadata } from "next";
// import { Raleway as FontSans } from "next/font/google";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <body
          className={cn(
            "flex min-h-screen flex-col items-center justify-center",
            fontSans.className
          )}
        >
          <main>{children}</main>
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
}
