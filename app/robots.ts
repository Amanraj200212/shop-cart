import type { MetadataRoute } from "next";

const siteUrl = "https://kiranadukan.shop";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/__clerk/",
        "/_next/",
        "/addresses",
        "/admin/",
        "/api/",
        "/cart",
        "/orders",
        "/search",
        "/sign-in",
        "/sign-up",
        "/studio/",
        "/success",
        "/wishlist",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
