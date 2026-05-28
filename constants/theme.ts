export const THEME_TOKENS = {
  colors: {
    ivory: "#f9f6ef",
    cream: "#f5f1e8",
    sand: "#e7dfcf",
    gold: "#b08b46",
    goldDeep: "#8f6f35",
    goldSoft: "#cfb57d",
    ink: "#1d1a16",
    muted: "#6f6659",
    card: "#fffdf9",
    stone: "#cfc2a9",
  },
  radius: {
    soft: "1rem",
    card: "1.25rem",
    pill: "9999px",
  },
  shadow: {
    soft: "0 10px 30px rgba(29, 26, 22, 0.08)",
    card: "0 16px 36px rgba(35, 31, 24, 0.1)",
    hover: "0 22px 48px rgba(35, 31, 24, 0.14)",
  },
  spacing: {
    sectionY: "clamp(3.5rem, 6vw, 6rem)",
    sectionYTight: "clamp(2.5rem, 4vw, 4rem)",
  },
  typography: {
    hero: "clamp(2rem, 5vw, 4rem)",
    title: "clamp(1.35rem, 2.2vw, 2.15rem)",
    body: "clamp(0.975rem, 1.2vw, 1.05rem)",
  },
  motion: {
    easeLuxury: "cubic-bezier(0.22, 1, 0.36, 1)",
    durationFast: "180ms",
    durationBase: "260ms",
    durationSlow: "420ms",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;
