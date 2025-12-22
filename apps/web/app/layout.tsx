import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Goran — AI Automation & Bot Development",
  description:
    "Personal portfolio of Goran, showcasing AI automation, chatbots, and backend integrations.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  openGraph: {
    title: "Goran — AI Automation & Bot Development",
    description:
      "Personal portfolio showcasing example AI assistants, workflow automations, and integrations.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="google-site-verification" content="v0K2q6oWirB2gFUoEfA9erjZhK48_mGIsduf3bbqTgg" />
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

