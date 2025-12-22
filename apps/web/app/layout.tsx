import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://stellar-platypus-e2865b.netlify.app"),
  title: {
    default: "Goran — AI Automation Developer",
    template: "%s — Goran",
  },
  description:
    "Personal portfolio of Goran, showcasing practical AI automation, chatbots, and backend integrations (demo and personal builds).",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  verification: {
    google: "v0K2q6oWirB2gFUoEfA9erjZhK48_mGIsduf3bbqTgg",
  },
  openGraph: {
    title: "Goran — AI Automation Developer",
    description:
      "Portfolio showcasing example AI assistants, workflow automations, and integrations. Transparent scope and contact.",
    url: "/",
    siteName: "Goran Portfolio",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Goran — AI Automation Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goran — AI Automation Developer",
    description:
      "Portfolio showcasing example AI assistants, workflow automations, and integrations.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Goran",
              jobTitle: "AI Automation Developer",
              url: "https://stellar-platypus-e2865b.netlify.app",
              sameAs: ["https://github.com/SkyVex12"],
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
