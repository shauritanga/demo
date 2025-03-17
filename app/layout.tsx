import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import NotistackProvider from "@/lib/NotistackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CTML Logistics Dashboard",
  description: "A modern dashboard with theme switching",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotistackProvider>
            <SessionProvider>{children}</SessionProvider>
          </NotistackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
