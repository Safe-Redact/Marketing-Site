import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL;
const routeTest = baseUrl ? test : test.skip;

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

routeTest("public marketing presents document and audio redaction without unfinished formats", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);

  const html = await response.text();
  const text = visibleText(html);

  assert.match(text, /Document redaction/i);
  assert.match(text, /Audio redaction/i);
  assert.doesNotMatch(
    text,
    /Video redaction|Image redaction|Video review controls|Documents & images|common image formats|Video files|Scanned images/i
  );
  assert.match(html, /href="\/pricing"/);
  assert.match(html, /format-documents\.png/i);
  assert.doesNotMatch(html, /step-open\.png|format-video\.png/i);
});

routeTest("pricing route makes package scope and annual per-license billing unambiguous", async () => {
  const response = await fetch(`${baseUrl}/pricing`);
  assert.equal(response.status, 200);

  const html = await response.text();
  const text = visibleText(html);

  assert.match(text, /Redaction software that fits the work you do/i);
  assert.match(text, /OpenRedakt Essential/);
  assert.match(text, /\$1,500/);
  assert.match(text, /\$125/);
  assert.match(text, /OpenRedakt Advanced/);
  assert.match(text, /\$2,500/);
  assert.match(text, /\$208\.33/);
  assert.match(text, /OpenRedakt Complete Suite/);
  assert.match(text, /\$3,500/);
  assert.match(text, /\$291\.67/);
  assert.match(text, /proposed/i);
  assert.match(text, /pending (?:business )?confirmation/i);
  assert.match(text, /Contact Sales/);
  assert.match(text, /Per license\. Billed annually\./i);
  assert.match(text, /Essential and Advanced are separate, capability-specific packages/i);
  assert.match(text, /Compare packages/i);
  assert.match(text, /Not included/i);
  assert.match(text, /one-year term/i);
  assert.match(text, /named-user license/i);
  assert.match(text, /assigned by email/i);
  assert.match(text, /Control Center/i);
  assert.match(text, /owner\/admin/i);
  assert.match(text, /view and release/i);
  assert.match(text, /Confirmed in (?:your )?quote/i);
  assert.match(text, /How licensing works/i);
  assert.match(text, /OpenRedakt provisions/i);
  assert.match(text, /signs in on the Windows desktop/i);
  assert.match(text, /signed, device-bound license/i);
  assert.doesNotMatch(text, /self-service (?:checkout|purchase)|instant provisioning|automatically renews|automatic renewal/i);
  assert.doesNotMatch(text, /(?:^|\D)2 devices per (?:user|license)|two devices per (?:user|license)/i);
  assert.match(html, /<table/);
  assert.match(html, /<caption/);
  assert.match(html, /id="demo-enquiry"/);
  assert.match(html, /name="packageInterest"/);
  assert.match(html, /name="licenseCount"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/saferedact\.io\/pricing"/);
});

function packageCard(html, slug) {
  const match = html.match(new RegExp(`<article[^>]*aria-labelledby="package-${slug}"[\\s\\S]*?</article>`));
  assert.ok(match, `missing ${slug} package card`);
  return match[0];
}

function comparisonRows(html) {
  const match = html.match(/<table[\s\S]*?<\/table>/);
  assert.ok(match, "missing comparison table");
  return [...match[0].matchAll(/<tr[^>]*>\s*<th scope="row"[^>]*>([\s\S]*?)<\/th>([\s\S]*?)<\/tr>/g)].map(
    ([, capability, cells]) => ({
      capability: visibleText(capability),
      included: [...cells.matchAll(/<td[\s\S]*?<\/td>/g)].map(([cell]) => visibleText(cell) === "Included"),
    })
  );
}

function cardBullets(card) {
  return [...card.matchAll(/<li(?:\s[^>]*)?>[\s\S]*?<\/li>/g)].map(([item]) => visibleText(item));
}

routeTest("pricing cards give a concise, correctly scoped summary of each package", async () => {
  const response = await fetch(`${baseUrl}/pricing`);
  assert.equal(response.status, 200);
  const html = await response.text();

  const cards = Object.fromEntries(
    ["essential", "advanced", "complete-suite"].map((slug) => {
      const card = packageCard(html, slug);
      return [slug, { text: visibleText(card), bullets: cardBullets(card) }];
    })
  );

  for (const [slug, card] of Object.entries(cards)) {
    assert.ok(card.bullets.length >= 5 && card.bullets.length <= 8, `${slug} shows ${card.bullets.length} bullets`);
    assert.doesNotMatch(card.text, /not included|more capabilities|full comparison|Every license includes/i);
  }

  const essential = cards.essential.text;
  assert.match(essential, /OpenRedakt Essential Documents/);
  assert.match(essential, /OCR/);
  assert.match(essential, /On-device AI detection/);
  assert.match(essential, /independently verified/);
  assert.match(essential, /PDF, PDF\/A and TIFF export/);
  assert.doesNotMatch(essential, /speech|Voice disguise|Waveform|transcript/i);

  const advanced = cards.advanced.text;
  assert.match(advanced, /OpenRedakt Advanced Audio/);
  assert.match(advanced, /On-device speech-to-text/);
  assert.match(advanced, /AI detection of spoken/);
  assert.match(advanced, /transcript synchronized with playback/);
  assert.match(advanced, /voice disguise/);
  assert.match(advanced, /Export redacted audio and redacted transcripts/);
  assert.doesNotMatch(advanced, /OCR|PDF|Bates|verif|report|document/i);

  const suite = cards["complete-suite"].text;
  assert.match(suite, /OpenRedakt Complete Suite Documents \+ Audio/);
  assert.match(suite, /Everything in Essential and Advanced/);
  assert.match(suite, /Document and audio redaction/);
  assert.match(suite, /Verified document exports, plus redacted audio and transcripts/);

  const pageText = visibleText(html);
  assert.match(pageText, /named-user license assigned by email, managed by your owners and admins in the Control Center/);
});

routeTest("the comparison table is short and agrees with the package scope on each card", async () => {
  const response = await fetch(`${baseUrl}/pricing`);
  const html = await response.text();
  const rows = comparisonRows(html);

  assert.ok(rows.length >= 8 && rows.length <= 12, `${rows.length} comparison rows`);
  for (const row of rows) {
    assert.equal(row.included.length, 3, row.capability);
    assert.equal(row.included[2], true, `Complete Suite must include "${row.capability}"`);
    // A row held by only one single-family package must be about that package's format.
    if (row.included[0] !== row.included[1]) {
      const documentRow = row.included[0];
      assert.equal(/audio|speech|transcri|voice/i.test(row.capability), !documentRow, row.capability);
    }
  }

  const advancedDocumentRows = rows.filter((row) => /document|OCR|Bates/i.test(row.capability) && row.included[1]);
  assert.deepEqual(advancedDocumentRows, [], "Advanced must not be credited with document capabilities");
  const essentialAudioRows = rows.filter((row) => /audio|speech|transcri/i.test(row.capability) && row.included[0]);
  assert.deepEqual(essentialAudioRows, [], "Essential must not be credited with audio capabilities");
  assert.ok(rows.some((row) => /Control Center/.test(row.capability) && row.included.every(Boolean)));

  const table = visibleText(html.match(/<table[\s\S]*?<\/table>/)[0]);
  assert.doesNotMatch(table, /LibreOffice|AIFF|ALAC|\.docx/);
});

routeTest("supported formats and technical requirements are answered in the FAQ", async () => {
  const response = await fetch(`${baseUrl}/pricing`);
  const text = visibleText(await response.text());

  assert.match(text, /Which file formats does each package support\?/);
  assert.match(text, /What are the technical requirements\?/);
});

routeTest("pricing page advertises no unsupported or unapproved capabilities", async () => {
  const response = await fetch(`${baseUrl}/pricing`);
  const text = visibleText(await response.text());

  assert.doesNotMatch(
    text,
    /video redaction|image redaction|face detection|license plates?|translation|translate|speaker identification|diarization|Outlook|\.pst|mailbox|email redaction|cloud storage|storage quota|unlimited|\bSLA\b|dedicated account|account manager|priority support|integrations?\b|collaboration|audit trail|free trial/i
  );
});

routeTest("pricing navigation and sitemap expose one canonical pricing destination", async () => {
  const [homeResponse, pricingResponse, sitemapResponse] = await Promise.all([
    fetch(baseUrl),
    fetch(`${baseUrl}/pricing`),
    fetch(`${baseUrl}/sitemap.xml`),
  ]);

  assert.equal(homeResponse.status, 200);
  assert.equal(pricingResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);

  const home = await homeResponse.text();
  const pricing = await pricingResponse.text();
  const sitemap = await sitemapResponse.text();

  assert.match(home, /href="\/pricing"[^>]*>Pricing</);
  assert.match(pricing, /href="\/pricing"[^>]*aria-current="page"/);
  assert.match(sitemap, /<loc>https:\/\/saferedact\.io\/pricing<\/loc>/);
  assert.equal((sitemap.match(/https:\/\/saferedact\.io\/pricing<\/loc>/g) ?? []).length, 1);
});

routeTest("pricing CTA query context preselects only a recognized package", async () => {
  const [recognizedResponse, unknownResponse] = await Promise.all([
    fetch(`${baseUrl}/pricing?package=advanced`),
    fetch(`${baseUrl}/pricing?package=starter`),
  ]);
  assert.equal(recognizedResponse.status, 200);
  assert.equal(unknownResponse.status, 200);

  const recognized = await recognizedResponse.text();
  const unknown = await unknownResponse.text();

  assert.match(recognized, /<option[^>]*value="advanced"[^>]*selected=""[^>]*>OpenRedakt Advanced<\/option>/);
  assert.doesNotMatch(unknown, /<option[^>]*value="[^"]+"[^>]*selected=""[^>]*>OpenRedakt/);
});

