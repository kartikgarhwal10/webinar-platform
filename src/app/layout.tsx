import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsScripts from "@/components/AnalyticsScripts";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Webinar",
  description: "Join our expert-led premium live webinar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
