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
      className="card-luxury relative overflow-hidden p-6 sm:p-10"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(28, 24, 17, 0.75), rgba(28, 24, 17, 0.3)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-xl text-white">
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#f0d9a9]">Signature Edit</p>
        <h1 className="font-heading text-3xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-[#fff9ea] sm:text-base">{subtitle}</p>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex rounded-full bg-[#f5ddb0] px-5 py-2 text-sm font-semibold text-[#3e2f16] transition hover:bg-[#f1d398]"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
