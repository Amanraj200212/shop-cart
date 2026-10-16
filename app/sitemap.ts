import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITEMAP_DOCUMENTS_QUERY } from "@/sanity/queries/query";

const siteUrl = "https://kiranadukan.shop";

type SitemapDocument = {
  _type: "product" | "category" | "blog";
  slug: string;
  _updatedAt: string;
};

const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteUrl, changeFrequency: "daily", priority: 1 },
  { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
  { url: `${siteUrl}/deal`, changeFrequency: "daily", priority: 0.8 },
  { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
];

const routeForDocument = (document: SitemapDocument) => {
  switch (document._type) {
    case "product":
      return `/product/${document.slug}`;
    case "category":
      return `/category/${document.slug}`;
    case "blog":
      return `/blog/${document.slug}`;
  }
};

const sitemapEntryForDocument = (
  document: SitemapDocument,
): MetadataRoute.Sitemap[number] => ({
  url: `${siteUrl}${routeForDocument(document)}`,
  lastModified: new Date(document._updatedAt),
  changeFrequency: document._type === "blog" ? "weekly" : "daily",
  priority: document._type === "product" ? 0.8 : 0.7,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const documents = await client.fetch<SitemapDocument[]>(SITEMAP_DOCUMENTS_QUERY);

    return [
      ...staticRoutes,
      ...documents.map(sitemapEntryForDocument),
    ];
  } catch (error) {
    console.error("Unable to generate the sitemap from Sanity", error);
    return staticRoutes;
  }
}
