import type { ReactNode } from "react";
import type { SiteSettings } from "@/src/types/database";

interface SocialLinksProps {
  settings: SiteSettings;
  className?: string;
}

interface Channel {
  label: string;
  href: string;
  icon: ReactNode;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function SocialLinks({ settings, className }: SocialLinksProps) {
  const channels: Channel[] = [];

  if (settings.whatsapp_number) {
    channels.push({
      label: "WhatsApp",
      href: `https://wa.me/${digitsOnly(settings.whatsapp_number)}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.21.85 5.75 2.39a8.08 8.08 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.13 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.07 8.07 0 0 1-1.24-4.29c0-4.48 3.65-8.12 8.12-8.12Zm-2.55 3.6c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.47-.4-.4-.55-.41-.14-.01-.3-.01-.46-.01Z" />
        </svg>
      ),
    });
  }

  if (settings.facebook_url) {
    channels.push({
      label: "Facebook",
      href: settings.facebook_url,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
        </svg>
      ),
    });
  }

  if (settings.email) {
    channels.push({
      label: "Email",
      href: `mailto:${settings.email}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.01L12 11l8-4.99V6H4Zm16 2.24-7.47 4.66a1 1 0 0 1-1.06 0L4 8.24V18h16V8.24Z" />
        </svg>
      ),
    });
  }

  if (settings.instagram_url) {
    channels.push({
      label: "Instagram",
      href: settings.instagram_url,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
          <path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.16.56.55.9 1.11 1.16 1.77.25.64.42 1.36.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.16 1.77c-.55.56-1.11.9-1.77 1.16-.64.25-1.36.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.16 4.9 4.9 0 0 1-1.16-1.77c-.25-.64-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.79.47-2.43.26-.66.6-1.22 1.16-1.77.55-.56 1.11-.9 1.77-1.16.64-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.51.21-1.86.35-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.31.88-.35 1.86-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.98.21 1.51.35 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.31 1.86.35 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.51-.21 1.86-.35.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.31-.88.35-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.21-1.51-.35-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.35-.14-.88-.31-1.86-.35-1.05-.05-1.37-.06-4.04-.06Zm0 3.07a5.13 5.13 0 1 1 0 10.26 5.13 5.13 0 0 1 0-10.26Zm0 1.8a3.33 3.33 0 1 0 0 6.66 3.33 3.33 0 0 0 0-6.66Zm5.34-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
        </svg>
      ),
    });
  }

  if (channels.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
      {channels.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          target="_blank"
          rel="noreferrer"
          aria-label={channel.label}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#cfbf9f] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-gold-deep)] shadow-[0_8px_16px_rgba(38,31,22,0.08)] transition-transform hover:-translate-y-0.5 hover:bg-[#f7f0e1]"
        >
          {channel.icon}
          <span>{channel.label}</span>
        </a>
      ))}
    </div>
  );
}
