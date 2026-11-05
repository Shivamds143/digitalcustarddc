import fs from "fs";
import path from "path";
import { getDatabase } from "@/lib/mongodb";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcustarddc.vercel.app";

export const defaultSeoData = {
  home: {
    pageName: "Home Page",
    path: "/",
    title: "Digital Custard | AI, IT and Digital Marketing",
    description: "Transforming brands through innovative digital marketing strategies that deliver measurable results.",
    keywords: "digital marketing, AI services, IT solutions, web development, SEO agency, Nashik",
    ogTitle: "Digital Custard - Digital Strategy, AI & Technology",
    ogDescription: "We craft data-driven marketing strategies that elevate brands, captivate audiences, and deliver measurable growth.",
    ogImage: "/images/dc-hero-monogram.jpg",
  },
  about: {
    pageName: "About Us",
    path: "/about",
    title: "About Us | Digital Custard",
    description: "We are a team of passionate digital experts combining data, creativity, and technology to help businesses thrive.",
    keywords: "about digital custard, digital marketing agency team, Rahul Mogal",
    ogTitle: "About Digital Custard - Strategy & Technology",
    ogDescription: "Passionate team dedicated to brand growth through innovative digital engineering.",
    ogImage: "/images/dc-logo.png",
  },
  services: {
    pageName: "Services",
    path: "/services",
    title: "Services | Digital Custard",
    description: "Explore AI, IT development, web and mobile solutions, branding, and digital marketing services by Digital Custard.",
    keywords: "AI solutions, web development, mobile apps, digital marketing, SEO, PPC",
    ogTitle: "Full-Stack AI, IT & Marketing Services | Digital Custard",
    ogDescription: "We combine smart technology, creative thinking, and digital strategies to help businesses grow.",
    ogImage: "/images/dc-logo.png",
  },
  services_ai: {
    pageName: "Sub-Service: AI Solutions",
    path: "/services/ai",
    title: "AI Services & Smart Solutions | Digital Custard",
    description: "Generative AI, agentic workflows, data intelligence, and AI governance frameworks.",
    keywords: "generative AI, agentic workflows, LLM integration, predictive analytics",
    ogTitle: "AI Services & Smart Solutions | Digital Custard",
    ogDescription: "Simplify workflows and create smarter business solutions with AI.",
    ogImage: "/images/dc-logo.png",
  },
  services_it: {
    pageName: "Sub-Service: IT & Products",
    path: "/services/it",
    title: "IT Solutions & Digital Products | Digital Custard",
    description: "Web development, mobile apps (Android/iOS), UI/UX design, and ERP/CRM systems.",
    keywords: "web development, Next.js, mobile app development, UI UX design, custom ERP",
    ogTitle: "IT Solutions & Scalable Digital Products | Digital Custard",
    ogDescription: "Reliable and scalable digital products that support business growth.",
    ogImage: "/images/dc-logo.png",
  },
  services_marketing: {
    pageName: "Sub-Service: Digital Marketing",
    path: "/services/marketing",
    title: "Digital Marketing & Brand Growth | Digital Custard",
    description: "SEO, Performance marketing, Social media marketing, Content writing, and Brand identity.",
    keywords: "SEO Nashik, Performance ads, Google Ads, Meta Ads, social media growth",
    ogTitle: "Digital Marketing & Brand Growth | Digital Custard",
    ogDescription: "Build a strong online presence and turn engagement into business revenue.",
    ogImage: "/images/dc-logo.png",
  },
  blog: {
    pageName: "Blog & Insights",
    path: "/blog",
    title: "Blog & Insights | Digital Custard",
    description: "Actionable marketing insights, digital strategies, and tips to help your business grow online.",
    keywords: "digital marketing blog, website conversion tips, SEO guide 2026",
    ogTitle: "Digital Custard Blog - Actionable Growth Insights",
    ogDescription: "Articles on conversion rate optimization, digital marketing strategies, and AI search.",
    ogImage: "/images/dc-logo.png",
  },
  contact: {
    pageName: "Contact Us",
    path: "/contact",
    title: "Contact Us | Digital Custard",
    description: "Ready to transform your digital presence? We'd love to hear about your project and explore how we can help.",
    keywords: "contact digital custard, hire marketing agency Nashik, digital marketing consultation",
    ogTitle: "Get in Touch with Digital Custard",
    ogDescription: "Let's start a conversation about growing your business online.",
    ogImage: "/images/dc-logo.png",
  },
};

function getLocalSeoFilePath() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "seo.json");
}

function toAbsoluteUrl(urlStr) {
  if (!urlStr) return `${SITE_URL}/images/dc-hero-monogram.jpg`;
  if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
    return urlStr;
  }
  return `${SITE_URL}${urlStr.startsWith("/") ? "" : "/"}${urlStr}`;
}

// In-memory cache to ensure instant response + automatic refresh
let cachedSeo = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

/**
 * Get all SEO settings from MongoDB or fallback local storage
 */
export async function getAllSeoSettings(forceFresh = false) {
  const now = Date.now();
  if (!forceFresh && cachedSeo && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSeo;
  }

  let dbData = null;

  try {
    const db = await getDatabase();
    if (db) {
      const records = await db.collection("seo").find().toArray();
      if (records && records.length > 0) {
        dbData = {};
        records.forEach((r) => {
          if (r.key) {
            const { _id, ...clean } = r;
            dbData[r.key] = {
              ...clean,
              _id: _id ? _id.toString() : undefined,
            };
          }
        });
      }
    }
  } catch (err) {
    console.warn("[SEO] MongoDB unavailable, loading local fallback:", err.message);
  }

  // If MongoDB returned data, merge with defaults
  if (dbData) {
    const merged = { ...defaultSeoData };
    Object.keys(dbData).forEach((key) => {
      merged[key] = { ...merged[key], ...dbData[key] };
    });
    cachedSeo = merged;
    cacheTimestamp = now;
    return merged;
  }

  // Otherwise check local backup data/seo.json
  const filePath = getLocalSeoFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const local = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const merged = { ...defaultSeoData, ...local };
      cachedSeo = merged;
      cacheTimestamp = now;
      return merged;
    } catch {
      cachedSeo = defaultSeoData;
      cacheTimestamp = now;
      return defaultSeoData;
    }
  }

  cachedSeo = defaultSeoData;
  cacheTimestamp = now;
  return defaultSeoData;
}

/**
 * Get SEO configuration for a specific page key (e.g. 'home', 'services', 'contact')
 * Returns full Next.js App Router metadata with OpenGraph & Twitter cards
 */
export async function getSeoForPage(key) {
  const all = await getAllSeoSettings();
  const page = all[key] || defaultSeoData[key] || defaultSeoData.home;

  const pagePath = page.path || "/";
  const canonicalUrl = `${SITE_URL}${pagePath === "/" ? "" : pagePath}`;
  const title = page.title || "Digital Custard | AI, IT and Digital Marketing";
  const description =
    page.description ||
    "Transforming brands through innovative digital marketing strategies that deliver measurable results.";
  const ogTitle = page.ogTitle || title;
  const ogDescription = page.ogDescription || description;
  const imageUrl = toAbsoluteUrl(page.ogImage);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: page.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "Digital Custard",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [imageUrl],
      creator: "@digitalcustard",
      site: "@digitalcustard",
    },
  };
}

/**
 * Save SEO update for a specific page key to both MongoDB and local backup
 */
export async function saveSeoSetting(key, seoPayload) {
  const payload = {
    ...seoPayload,
    key,
    updatedAt: new Date().toISOString(),
  };

  let savedToMongo = false;

  // Invalidate in-memory cache immediately
  if (cachedSeo) {
    cachedSeo[key] = { ...(cachedSeo[key] || defaultSeoData[key] || {}), ...payload };
    cacheTimestamp = Date.now();
  }

  // 1. Save to MongoDB
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("seo").updateOne(
        { key },
        { $set: payload },
        { upsert: true }
      );
      savedToMongo = true;
    }
  } catch (err) {
    console.warn("[SEO] MongoDB save error, saving locally:", err.message);
  }

  // 2. Save to local fallback file
  try {
    const filePath = getLocalSeoFilePath();
    let current = {};
    if (fs.existsSync(filePath)) {
      try {
        current = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch {
        current = {};
      }
    }
    current[key] = payload;
    fs.writeFileSync(filePath, JSON.stringify(current, null, 2), "utf8");
  } catch (fsErr) {
    console.error("[SEO] Local file write error:", fsErr);
  }

  return { ok: true, savedToMongo, data: payload };
}
