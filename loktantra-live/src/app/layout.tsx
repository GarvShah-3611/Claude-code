import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Newsreader } from "next/font/google";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import "./globals.css";

/* Display: a grotesk with enough optical irregularity to read editorial
   rather than corporate. Variable width axis is used at 90% for headlines. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  /* latin-ext carries the dotless i (U+0131) the wordmark is built on. */
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* Body/UI: neutral and dense at small sizes. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/* Reserved for pull quotes and story deks only — the "this is journalism"
   signal works because it stays rare. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Indian democracy",
    "youth journalism",
    "student activism",
    "ground reports",
    "policy explainers",
    "campus news India",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0e0e12",
  colorScheme: "dark",
};

/* Declares the publication to search engines as a news organisation. */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: site.name,
  url: site.url,
  description: site.description,
  sameAs: ["https://instagram.com/loktantralive"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`no-js ${bricolage.variable} ${geist.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Drops `no-js` before first paint so reveal elements start hidden
            for JS users, but stay visible if the bundle never arrives. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-violet focus:px-5 focus:py-2.5 focus:font-medium focus:on-violet"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <CustomCursor />
      </body>
    </html>
  );
}
