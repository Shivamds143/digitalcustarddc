import { Inter, Playfair_Display } from "next/font/google";
import { Header, Footer } from "@/components/Chrome";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--serif",
  display: "swap",
  adjustFontFallback: false,
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--sans",
  display: "swap",
});

export const metadata = {
  title: "Digital Custard | AI, IT and Digital Marketing",
  description: "Transforming brands through innovative digital marketing strategies that deliver measurable results.",
  icons: {
    icon: "/images/digital-custard-mark.png",
  }
};

export default function Root({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
