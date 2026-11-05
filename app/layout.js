import { Inter, Playfair_Display } from "next/font/google";
import { Header, Footer } from "@/components/Chrome";
import DomGuard from "@/components/DomGuard";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--serif",
  display: "swap",
  style: ["normal", "italic"],
  adjustFontFallback: false,
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--sans",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcustarddc.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Digital Custard | AI, IT and Digital Marketing",
    template: "%s | Digital Custard",
  },
  description:
    "Transforming brands through innovative digital marketing strategies that deliver measurable results.",
  keywords: [
    "digital marketing",
    "AI services",
    "IT solutions",
    "web development",
    "SEO agency",
    "Nashik",
  ],
  authors: [{ name: "Digital Custard", url: SITE_URL }],
  creator: "Digital Custard",
  publisher: "Digital Custard",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/dc-logo.png",
    shortcut: "/images/dc-logo.png",
    apple: "/images/dc-logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Digital Custard",
    title: "Digital Custard | AI, IT and Digital Marketing",
    description:
      "Transforming brands through innovative digital marketing strategies that deliver measurable results.",
    images: [
      {
        url: `${SITE_URL}/images/dc-hero-monogram.jpg`,
        width: 1200,
        height: 630,
        alt: "Digital Custard - Digital Strategy, AI & Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Custard | AI, IT and Digital Marketing",
    description:
      "Transforming brands through innovative digital marketing strategies that deliver measurable results.",
    images: [`${SITE_URL}/images/dc-hero-monogram.jpg`],
    creator: "@digitalcustard",
    site: "@digitalcustard",
  },
};

export default function Root({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <head>
        <DomGuard />
      </head>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
