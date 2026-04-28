import type { MetadataRoute } from "next";

const SITE = "https://www.thenyctowingservice.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      `${SITE}/sitemap/0.xml`,
      `${SITE}/sitemap/1.xml`,
      `${SITE}/sitemap/2.xml`,
      `${SITE}/sitemap/3.xml`,
      `${SITE}/sitemap/4.xml`,
    ],
    host: SITE,
  };
}
