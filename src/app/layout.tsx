import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SafeRedact | Professional Document Redaction Services",
    template: "%s | SafeRedact",
  },
  description:
    "Professional document redaction services for video, audio, and documents. Secure, accurate, and confidential redaction handled by experts.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saferedact.io",
    siteName: "SafeRedact",
    title: "SafeRedact | Professional Document Redaction Services",
    description:
      "Professional document redaction services for video, audio, and documents. Secure, accurate, and confidential redaction handled by experts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeRedact | Professional Document Redaction Services",
    description:
      "Professional document redaction services for video, audio, and documents. Secure, accurate, and confidential redaction handled by experts.",
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
  metadataBase: new URL("https://saferedact.io"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "SafeRedact",
              description:
                "Professional document redaction services for video, audio, and documents. Secure, accurate, and confidential redaction handled by experts.",
              url: "https://saferedact.io",
              serviceType: "Document Redaction",
              areaServed: "Global",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Redaction Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Video Redaction",
                      description:
                        "Professional video redaction including face blur, license plate removal, and on-screen text redaction.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Audio Redaction",
                      description:
                        "Permanent removal or masking of sensitive audio content from recordings.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Document Redaction",
                      description:
                        "Secure redaction of personal data, financial details, and confidential content from PDFs and documents.",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
