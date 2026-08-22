export const siteConfig = {
  name: "GlobeTrotter",
  description: "Collaborative travel planning and itinerary management platform.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/placeholders/og.png",
  links: {
    twitter: "https://twitter.com/globetrotter",
    github: "https://github.com/globetrotter",
  },
  nav: {
    marketing: [
      { title: "Features", href: "/#features" },
      { title: "Explore", href: "/explore" },
      { title: "Dashboard", href: "/dashboard" },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
