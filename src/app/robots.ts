import type { MetadataRoute } from "next";

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
      "https://www.thenyctowingservice.com/sitemap/0.xml",
      "https://www.thenyctowingservice.com/sitemap/1.xml",
      "https://www.thenyctowingservice.com/sitemap/2.xml",
    ],
    host: "https://www.thenyctowingservice.com",
  };
}
