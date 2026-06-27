import { SocialLinks } from "@/components/common/SocialLinks";
import { getServerServices } from "@/src/services/server";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export default async function ContactPage() {
  const { siteSettingsService } = await getServerServices();
  const settings = await siteSettingsService.getSettings();

  const details: Array<{ label: string; value: string; href?: string }> = [];
  if (settings.contact_phone) {
    details.push({ label: "Phone", value: settings.contact_phone, href: `tel:${digitsOnly(settings.contact_phone)}` });
  }
  if (settings.email) {
    details.push({ label: "Email", value: settings.email, href: `mailto:${settings.email}` });
  }
  if (settings.contact_address) {
    details.push({ label: "Address", value: settings.contact_address });
  }

  return (
    <div className="container-shell py-8 sm:py-10 md:py-12">
      <section className="card-luxury p-5 sm:p-12">
        <p className="kicker">{settings.contact_eyebrow}</p>
        <h1 className="mt-3 font-heading text-[clamp(1.8rem,6.8vw,3rem)] leading-tight">{settings.contact_heading}</h1>
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[var(--brand-muted)] sm:leading-7 sm:text-base">
          {settings.contact_body}
        </p>

        {details.length ? (
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">{detail.label}</dt>
                <dd className="mt-1 text-sm text-[var(--brand-ink)] sm:text-base">
                  {detail.href ? (
                    <a href={detail.href} className="gold-link break-words">
                      {detail.value}
                    </a>
                  ) : (
                    <span className="break-words">{detail.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <SocialLinks settings={settings} className="mt-7 sm:mt-8" />

        {settings.whatsapp_number ? (
          <a
            href={`https://wa.me/${digitsOnly(settings.whatsapp_number)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#1FAF5D] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(31,175,93,0.28)] hover:bg-[#18964f]"
          >
            Enquire on WhatsApp
          </a>
        ) : null}
      </section>
    </div>
  );
}
