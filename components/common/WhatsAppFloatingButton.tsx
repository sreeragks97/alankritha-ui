import { BRAND } from "@/lib/constants";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${BRAND.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-[max(0.65rem,env(safe-area-inset-bottom))] left-2 right-2 z-40 flex min-h-[var(--touch-target)] items-center justify-center rounded-full bg-[#1FAF5D] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(20,110,62,0.38)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#18964f] sm:left-3 sm:right-3 md:bottom-6 md:left-auto md:right-6 md:w-auto md:min-w-[220px] md:px-6"
      aria-label="Enquire on WhatsApp"
    >
      Enquire on WhatsApp
    </a>
  );
}
