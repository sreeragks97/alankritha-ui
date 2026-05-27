import Link from "next/link";

interface BannerProps {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}

export function Banner({ title, subtitle, image, ctaText, ctaHref }: BannerProps) {
  return (
    <section
      className="card-luxury relative isolate overflow-hidden p-6 sm:p-10 md:p-12"
      style={{
        backgroundImage: `linear-gradient(110deg, rgba(22, 18, 12, 0.84) 0%, rgba(22, 18, 12, 0.56) 36%, rgba(22, 18, 12, 0.26) 62%, rgba(22, 18, 12, 0.2) 100%), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center 35%",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_90%_at_18%_100%,rgba(242,212,154,0.2)_0%,rgba(242,212,154,0)_64%)]" />
      <div className="relative max-w-xl text-white">
        <p className="eyebrow-chip mb-3 bg-[rgba(246,228,186,0.15)] text-[#f7e6bf]">Signature Edit</p>
        <h1 className="font-heading text-[var(--text-hero)] leading-[1.08] text-[#fffef9]">{title}</h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#fff7e3] sm:text-base">{subtitle}</p>
        <Link
          href={ctaHref}
          className="mt-7 inline-flex rounded-full bg-[#f4ddb0] px-5 py-2.5 text-sm font-semibold text-[#3e2f16] shadow-[0_14px_30px_rgba(23,16,8,0.33)] hover:-translate-y-0.5 hover:bg-[#f1d398]"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
