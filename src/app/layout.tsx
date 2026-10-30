import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { contentSecurityPolicyNonce } from "@/lib/csp";
import { SupportChat } from "@/components/support/SupportChat";
import {
  publicSiteUrl,
  publicSupportEmail,
  siteConfig,
} from "@/content/site";
import { resolveChatwootPublicConfig } from "@/lib/support/chatwoot-config";
import "@/components/support/chatwoot-widget.css";
import "./globals.css";

// Geist (SIL Open Font License), self-hosted at build time by next/font.
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

/**
 * Every document on the public site carries a per-request nonce from src/middleware.ts.
 * A prerendered document would be served with a freshly minted nonce in its header and
 * none on its inline scripts, so nothing below this layout may be prerendered.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "OpenRedakt | AI-Powered Redaction Software",
    template: "%s | OpenRedakt",
  },
  description:
    "Windows redaction software with AI-assisted workflows for documents and audio.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: publicSiteUrl,
    siteName: siteConfig.name,
    title: "OpenRedakt | AI-Powered Redaction Software",
    description:
      "Windows redaction software with AI-assisted workflows for documents and audio.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenRedakt | AI-Powered Redaction Software",
    description:
      "Windows redaction software with AI-assisted workflows for documents and audio.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(publicSiteUrl),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = await contentSecurityPolicyNonce();
  const chatwootConfig = resolveChatwootPublicConfig(process.env);

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: siteConfig.name,
              description:
                "Windows redaction software with AI-assisted workflows for documents and audio.",
              url: publicSiteUrl,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Windows",
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {chatwootConfig ? (
          <SupportChat config={chatwootConfig} fallbackEmail={publicSupportEmail} />
        ) : null}
      </body>
    </html>
  );
}
