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
      <head>
        {/* Plausible Analytics */}
        <script
          async
          src="https://plausible.io/js/pa-BBdKcsiDAKn_5TXMvdYdq.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};
              plausible.init=plausible.init||function(i){plausible.o=i||{}};
              plausible.init();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

