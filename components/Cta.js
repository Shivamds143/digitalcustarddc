import Link from "next/link";
export default function Cta({ title, text, label, href = "/contact" }) {
  return (
    <section className="wrap"><div className="cta" data-r>
      <h2>{title}</h2><p>{text}</p><Link href={href} className="btn">{label}</Link>
    </div></section>
  );
}
