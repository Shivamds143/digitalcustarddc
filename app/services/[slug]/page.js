import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import FlipCard from "@/components/FlipCard";
import { servicePanels } from "@/lib/servicesContent";
import { getSeoForPage } from "@/lib/seoManager";

export const revalidate = 0;

/* ── Static params for build-time generation ── */
export function generateStaticParams() {
  return servicePanels.map((p) => ({ slug: p.id }));
}

/* ── Dynamic metadata per service managed via Admin SEO ── */
export async function generateMetadata({ params }) {
  const seoKey = `services_${params.slug}`;
  const customSeo = await getSeoForPage(seoKey);
  if (customSeo && customSeo.title) return customSeo;

  const panel = servicePanels.find((p) => p.id === params.slug);
  if (!panel) return {};
  const fullTitle = `${panel.title} ${panel.titleEm}`.replace(/&/g, "&");
  return {
    title: `${fullTitle} | Digital Custard`,
    description: panel.desc,
  };
}

export default function SubServicePage({ params }) {
  const panel = servicePanels.find((p) => p.id === params.slug);
  if (!panel) notFound();

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-h inner-hero">
        <div className="wrap">
          <div className="sp" style={{ alignItems: "center" }}>
            <div>
              <p className="eyebrow">{panel.pill}</p>
              <h1>
                {panel.title} <em>{panel.titleEm}</em>
              </h1>
              <p className="lead mt">{panel.desc}</p>
              <div className="row mt">
                <Link href="/contact" className="btn">
                  Get Started <b>↗</b>
                </Link>
                <Link href="/services" className="btn out">
                  All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Items Detail with Interactive 3D Flip Cards ── */}
      <section>
        <div className="wrap">
          <p className="eyebrow">What We Offer</p>
          <h2>
            Our {panel.title} <em>{panel.titleEm}</em>
          </h2>
          <p className="lead mt">
            Hover or tap any card below to explore full capabilities and get started.
          </p>

          <div className="subservices-grid mt">
            {panel.items.map((item, idx) => (
              <FlipCard
                key={item.title}
                item={item}
                index={idx}
                parentTitle={panel.title}
              />
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="Ready to Get Started?"
        text="Let's discuss how we can help you with the right solutions for your business."
        label="Let's Connect"
        href="/contact"
      />
    </>
  );
}
