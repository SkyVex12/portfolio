import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://stellar-platypus-e2865b.netlify.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
