import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SafeRedact | AI-Powered Redaction Software",
    template: "%s | SafeRedact",
  },
  description:
    "Windows redaction software with AI-assisted workflows for documents, images, audio, and video.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saferedact.io",
    siteName: "SafeRedact",
    title: "SafeRedact | AI-Powered Redaction Software",
    description:
      "Windows redaction software with AI-assisted workflows for documents, images, audio, and video.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeRedact | AI-Powered Redaction Software",
    description:
      "Windows redaction software with AI-assisted workflows for documents, images, audio, and video.",
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SafeRedact",
              description:
                "Windows redaction software with AI-assisted workflows for documents, images, audio, and video.",
              url: "https://saferedact.io",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Windows",
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
