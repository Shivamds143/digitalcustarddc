import { SITE_URL } from "@/lib/seoManager";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

