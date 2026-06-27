import { SocialLinks } from "@/components/common/SocialLinks";
import { getServerServices } from "@/src/services/server";

export default async function AboutPage() {
  const { siteSettingsService } = await getServerServices();
  const settings = await siteSettingsService.getSettings();

  return (
    <div className="container-shell py-8 sm:py-10 md:py-12">
      <section className="card-luxury p-5 sm:p-12">
        <p className="kicker">{settings.about_eyebrow}</p>
        <h1 className="mt-3 font-heading text-[clamp(1.85rem,7vw,3.1rem)] leading-tight">{settings.about_heading}</h1>
        <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-[var(--brand-muted)] sm:mt-6 sm:leading-8 sm:text-base">
          {settings.about_body}
        </p>
        <SocialLinks settings={settings} className="mt-7 sm:mt-8" />
      </section>
    </div>
  );
}
