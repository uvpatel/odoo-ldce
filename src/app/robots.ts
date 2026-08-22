import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://globetrotter.io"

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/shared/*"],
      disallow: ["/api/*", "/admin/*", "/dashboard/*", "/settings/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
