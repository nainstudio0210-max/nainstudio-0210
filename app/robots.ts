import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

// Served at /robots.txt. Nothing here is private, so the only real job is
// pointing crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
