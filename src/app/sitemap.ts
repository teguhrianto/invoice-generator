import type { MetadataRoute } from "next";

/** Base URL for the deployed application, read from the environment at build time. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invoice-generator.vercel.app";

/**
 * Generates the static sitemap for the application.
 *
 * Returns the two public routes: the invoice form ("/") and the history page
 * ("/history"). Both pages are equally important and change frequently since
 * they are single-page app shells.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/history`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
