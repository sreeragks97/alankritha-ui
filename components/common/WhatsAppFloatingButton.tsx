import { BRAND } from "@/lib/constants";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${BRAND.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-3 left-3 right-3 z-40 flex h-12 items-center justify-center rounded-full bg-[#1FAF5D] px-4 text-sm font-semibold text-white shadow-lg md:bottom-6 md:left-auto md:right-6 md:w-auto"
    >
      Enquire on WhatsApp
    </a>
  );
}
