import Link from "next/link";
import { getAllLegalContent } from "@/lib/legalContent";
import { getSeoForPage } from "@/lib/seoManager";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return await getSeoForPage("terms");
}

export default async function TermsOfService() {
  const legal = await getAllLegalContent();
  const page = legal.terms;

  return (
    <section className="page-h inner-hero">
      <div className="wrap" style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p className="eyebrow">{page.eyebrow || "Legal & Compliance"}</p>
        <h1 style={{ marginBottom: 16 }}>
          {page.heading ? (
            <>
              {page.heading.split(" ").slice(0, -1).join(" ")}{" "}
              <em>{page.heading.split(" ").slice(-1)[0]}</em>
            </>
          ) : (
            <>
              Terms of <em>Service</em>
            </>
          )}
        </h1>
        <p className="lead" style={{ marginBottom: 32 }}>
          {page.leadText}
        </p>

        <div style={{ display: "grid", gap: 28, lineHeight: 1.7, color: "var(--ink-secondary)" }}>
          {(page.sections || []).map((section, idx) => (
            <div key={idx}>
              <h2 style={{ fontSize: 20, color: "var(--ink)", marginBottom: 8 }}>
                {section.title}
              </h2>
              <p style={{ whiteSpace: "pre-wrap" }}>{section.content}</p>
            </div>
          ))}

          <div style={{ marginTop: 24 }}>
            <Link href="/" className="btn">
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
