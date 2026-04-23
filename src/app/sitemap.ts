import type { MetadataRoute } from "next";
import { STATES } from "@/data/cities";
import { SERVICES } from "@/data/services";
import { CUSTOMER_TYPES } from "@/data/customer-types";
import { BLOG_POSTS } from "@/data/blog-posts";

const SITE = "https://www.thenyctowingservice.com";

const CHUNK_SIZE = 25000;

function buildAllEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const staticPages = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/faq",
    "/contact-nyc-towing-today",
    "/book-towing-service-today",
    "/apply-for-towing-job",
    "/commercial",
    "/franchise",
    "/blog",
    "/careers",
    "/locations",
    "/who-we-serve",
  ];

  for (const path of staticPages) {
    entries.push({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "" ? 1.0 : 0.8,
    });
  }

  for (const post of BLOG_POSTS) {
    entries.push({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const service of SERVICES) {
    entries.push({
      url: `${SITE}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const customer of CUSTOMER_TYPES) {
    entries.push({
      url: `${SITE}/who-we-serve/${customer.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const state of STATES) {
    entries.push({
      url: `${SITE}/locations/${state.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    entries.push({
      url: `${SITE}/careers/${state.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });

    for (const city of state.cities) {
      entries.push({
        url: `${SITE}/locations/${state.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
      entries.push({
        url: `${SITE}/careers/${state.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.4,
      });
      entries.push({
        url: `${SITE}/locations/${state.slug}/${city.slug}/towing-in-${city.slug}-guide-and-pricing`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });

      for (const service of SERVICES) {
        entries.push({
          url: `${SITE}/locations/${state.slug}/${city.slug}/${service.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  }

  for (const ct of CUSTOMER_TYPES) {
    for (const state of STATES) {
      entries.push({
        url: `${SITE}/who-we-serve/${ct.slug}/${state.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });

      for (const city of state.cities) {
        entries.push({
          url: `${SITE}/who-we-serve/${ct.slug}/${state.slug}/${city.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }

    for (const service of SERVICES) {
      entries.push({
        url: `${SITE}/who-we-serve/${ct.slug}/${service.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}

export async function generateSitemaps() {
  const total = buildAllEntries().length;
  const count = Math.ceil(total / CHUNK_SIZE);
  return Array.from({ length: count }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const all = buildAllEntries();
  const start = id * CHUNK_SIZE;
  return all.slice(start, start + CHUNK_SIZE);
}
