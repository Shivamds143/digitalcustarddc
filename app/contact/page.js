import ContactForm from "@/components/ContactForm";
import { brand } from "@/lib/content";

export const metadata = {
  title: "Contact | Digital Custard",
  description: "Ready to transform your digital presence? We'd love to hear about your project and explore how we can help."
};

export default function Contact() {
  return (
    <section className="page-h inner-hero">
      <div className="wrap sp">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1>Let's Start a <em>Conversation.</em></h1>
          <p className="lead mt">
            Ready to transform your digital presence? We'd love to hear about your project and explore how we can help.
          </p>

          <div className="card mt" style={{ display: "grid", gap: 14 }}>
            <h3 style={{ marginBottom: 4 }}>Contact Information</h3>
            <p>
              <strong style={{ color: "var(--ink)" }}>Email:</strong>{" "}
              <a href={`mailto:${brand.email}`} style={{ color: "var(--camel-dark)" }}>
                {brand.email}
              </a>
            </p>
            <p>
              <strong style={{ color: "var(--ink)" }}>Phone:</strong>{" "}
              <a href="tel:+917020763979" style={{ color: "var(--camel-dark)" }}>
                {brand.phone}
              </a>
            </p>
            <p>
              <strong style={{ color: "var(--ink)" }}>WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/917020763979"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--camel-dark)" }}
              >
                +91 7020763979 (Click to Chat)
              </a>
            </p>
            <p>
              <strong style={{ color: "var(--ink)" }}>Business Hours:</strong>{" "}
              {brand.hours}
            </p>
            <p>
              <strong style={{ color: "var(--ink)" }}>Location:</strong>{" "}
              {brand.loc}
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
