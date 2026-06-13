import { BRAND } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="container-shell py-8 sm:py-10 md:py-12">
      <section className="card-luxury p-5 sm:p-12">
        <p className="kicker">Connect</p>
        <h1 className="mt-3 font-heading text-[clamp(1.8rem,6.8vw,3rem)] leading-tight">Contact & Enquiry</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--brand-muted)] sm:leading-7 sm:text-base">
          Share the product code and your requirement on WhatsApp. Our team will respond with availability and styling guidance.
        </p>
        <a
          href={`https://wa.me/${BRAND.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#1FAF5D] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(31,175,93,0.28)] hover:bg-[#18964f]"
        >
          Enquire on WhatsApp
        </a>
      </section>
    </div>
  );
}
