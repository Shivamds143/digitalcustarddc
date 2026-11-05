import { getSeoForPage } from "@/lib/seoManager";
import Cta from "@/components/Cta";
import Link from "next/link";
import ServiceStackSection from "@/components/ServiceStackSection";
import {
  servicesMetadata,
  servicesHeroContent,
  servicesProcessContent,
  servicesCtaContent,
} from "@/lib/servicesContent";

export async function generateMetadata() {
  return await getSeoForPage("services");
}

export default function Services() {
  const { eyebrow, title, titleEm, lead, primaryCta, secondaryCta, visual } =
    servicesHeroContent;
  const { steps } = servicesProcessContent;

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-h inner-hero">
        <div className="wrap">
          <div className="sp" style={{ alignItems: "center" }}>
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>
                {title} <em>{titleEm}</em>
              </h1>
              <p className="lead mt">{lead}</p>
              <div className="row mt">
                <Link href={primaryCta.href} className="btn">
                  {primaryCta.label} <b>↗</b>
                </Link>
                <a href={secondaryCta.href} className="btn out">
                  {secondaryCta.label}
                </a>
              </div>
            </div>

            <div className="inner-visual service-visual">
              <img src={visual.image} alt={visual.alt} />
              <span>
                {visual.badgeLine1}
                <br />
                {visual.badgeLine2}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fullscreen Vertical Page-Stacking Service Section (GSAP ScrollTrigger) ── */}
      <ServiceStackSection />

      {/* ── Process ── */}
      <section className="process-section">
        <div className="wrap">
          <p className="eyebrow">{servicesProcessContent.eyebrow}</p>
          <h2>{servicesProcessContent.title}</h2>
          <p className="lead mt">{servicesProcessContent.lead}</p>
          <div className="grid g4 mt">
            {steps.map((st) => (
              <div className="card process-card" data-r key={st.title}>
                <div className="process-num">{st.num}</div>
                <div className="icon" style={{ marginTop: 16 }}>
                  {st.num.replace(/^0+/, "")}
                </div>
                <h3>{st.title}</h3>
                <p>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title={servicesCtaContent.title}
        text={servicesCtaContent.text}
        label={servicesCtaContent.label}
        href={servicesCtaContent.href}
      />
    </>
  );
}
