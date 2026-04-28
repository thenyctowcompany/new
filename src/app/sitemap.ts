import type { MetadataRoute } from "next";
import { STATES } from "@/data/cities";
import { SERVICES } from "@/data/services";
import { CUSTOMER_TYPES } from "@/data/customer-types";
import { BLOG_POSTS } from "@/data/blog-posts";

const SITE = "https://www.thenyctowingservice.com";

// Chunk indices — each generated sitemap stays well under Google's 50,000-URL limit.
const CHUNKS = ["core", "locations", "city-services", "who-we-serve", "careers"] as const;
type Chunk = (typeof CHUNKS)[number];

export async function generateSitemaps() {
  return CHUNKS.map((id, i) => ({ id: i }));
}

function coreEntries(now: Date): MetadataRoute.Sitemap {
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
    entries.push({
      url: `${SITE}/services/${service.slug}/tips`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
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
  return entries;
}

function locationEntries(now: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const state of STATES) {
    entries.push({
      url: `${SITE}/locations/${state.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    for (const city of state.cities) {
      entries.push({
        url: `${SITE}/locations/${state.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
      entries.push({
        url: `${SITE}/locations/${state.slug}/${city.slug}/towing-in-${city.slug}-guide-and-pricing`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }
  return entries;
}

function cityServiceEntries(now: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const state of STATES) {
    for (const city of state.cities) {
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
  return entries;
}

function whoWeServeEntries(now: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
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

function careersEntries(now: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const state of STATES) {
    entries.push({
      url: `${SITE}/careers/${state.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
    for (const city of state.cities) {
      entries.push({
        url: `${SITE}/careers/${state.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
  }
  return entries;
}

const BUILDERS: Record<Chunk, (now: Date) => MetadataRoute.Sitemap> = {
  core: coreEntries,
  locations: locationEntries,
  "city-services": cityServiceEntries,
  "who-we-serve": whoWeServeEntries,
  careers: careersEntries,
};

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const chunk = CHUNKS[id];
  if (!chunk) return [];
  return BUILDERS[chunk](new Date());
}
