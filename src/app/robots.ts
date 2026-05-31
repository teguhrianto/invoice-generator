import type { MetadataRoute } from "next";

/** Base URL for the deployed application. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invoice-generator.teguhrianto.com";

/**
 * Generates the robots.txt configuration for the application.
 *
 * Allows all crawlers to index all routes and points them at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
