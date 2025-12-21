import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Goran — AI Bots & Automation",
  description: "Fashionable portfolio for AI bots, LLM systems, and workflow automation. Ship real business results fast.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  openGraph: {
    title: "Goran — AI Bots & Automation",
    description: "I build practical AI bots and automation that reduce manual work and ship fast.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
