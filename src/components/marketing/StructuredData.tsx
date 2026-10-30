import React from "react";
import { contentSecurityPolicyNonce } from "@/lib/csp";
import { serializeJsonLd } from "@/lib/seo/structured-data";

export async function StructuredData({ data }: { data: unknown }) {
  const nonce = await contentSecurityPolicyNonce();
  return <script type="application/ld+json" suppressHydrationWarning nonce={nonce} dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}

