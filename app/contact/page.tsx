import { BRAND } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="container-shell py-10">
      <section className="card-luxury p-8 sm:p-12">
        <h1 className="font-heading text-4xl sm:text-5xl">Contact & Enquiry</h1>
        <p className="mt-4 text-sm text-[var(--brand-muted)] sm:text-base">
          Share the product code and your requirement on WhatsApp. Our team will respond with availability and styling guidance.
        </p>
        <a
          href={`https://wa.me/${BRAND.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#1FAF5D] px-6 py-3 text-sm font-semibold text-white"
        >
          Enquire on WhatsApp
        </a>
      </section>
    </div>
  );
}
