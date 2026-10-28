import assert from "node:assert/strict";
import test from "node:test";
import {
  comparisonRowIncludes,
  pricingCapabilityFamilies,
  pricingComparisonSections,
  pricingFaqs,
  pricingPackages,
  pricingSharedLicenseNote,
  type PricingComparisonRow,
  type PricingPackage,
} from "../src/content/pricing";

function packageBySlug(slug: PricingPackage["slug"]): PricingPackage {
  const plan = pricingPackages.find((candidate) => candidate.slug === slug);
  assert.ok(plan, `missing package ${slug}`);
  return plan;
}

const comparisonRows: PricingComparisonRow[] = pricingComparisonSections.flatMap(
  (section): readonly PricingComparisonRow[] => section.rows
);

const allPricingCopy = JSON.stringify({
  pricingCapabilityFamilies,
  pricingPackages,
  pricingComparisonSections,
  pricingSharedLicenseNote,
  pricingFaqs,
});

test("Essential and Advanced are separate single-family packages and Complete Suite licenses both", () => {
  assert.deepEqual(packageBySlug("essential").families, ["documents"]);
  assert.deepEqual(packageBySlug("advanced").families, ["audio"]);
  assert.deepEqual(packageBySlug("complete-suite").families, ["documents", "audio"]);
  assert.equal(packageBySlug("essential").scopeLabel, "Documents");
  assert.equal(packageBySlug("advanced").scopeLabel, "Audio");
  assert.equal(packageBySlug("complete-suite").scopeLabel, "Documents + Audio");
});

test("approved prices and price status are unchanged", () => {
  assert.equal(packageBySlug("essential").annualPriceUsd, 1500);
  assert.equal(packageBySlug("advanced").annualPriceUsd, 2500);
  assert.equal(packageBySlug("complete-suite").annualPriceUsd, 3500);
  assert.equal(packageBySlug("complete-suite").priceStatus, "proposed");
});

test("each card has a concise list of benefits", () => {
  for (const plan of pricingPackages) {
    assert.ok(plan.features.length >= 5 && plan.features.length <= 8, `${plan.slug} has ${plan.features.length} bullets`);
    for (const feature of plan.features) {
      assert.ok(feature.length <= 75, `"${feature}" is too long for a card bullet`);
    }
  }
  assert.ok(packageBySlug("essential").features.length >= 6);
  assert.ok(packageBySlug("advanced").features.length >= 6);
});

test("Essential describes document capabilities only", () => {
  const bullets = packageBySlug("essential").features.join("\n");
  for (const expected of [/PDFs, Word files/, /OCR/, /AI detection/, /pattern-based redaction/, /independently verified/, /PDF, PDF\/A and TIFF/, /redaction reports/]) {
    assert.match(bullets, expected);
  }
  assert.doesNotMatch(bullets, /audio|speech|transcri|voice|waveform/i);
});

test("Advanced describes audio capabilities only", () => {
  const bullets = packageBySlug("advanced").features.join("\n");
  for (const expected of [/audio formats/, /speech-to-text/, /AI detection of spoken/, /transcript/, /Waveform/, /voice disguise/, /redacted audio/]) {
    assert.match(bullets, expected);
  }
  assert.doesNotMatch(bullets, /PDF|OCR|document|Bates|page|verif|report/i);
});

test("Complete Suite summarises both families without exclusive features", () => {
  const bullets = packageBySlug("complete-suite").features.join("\n");
  assert.match(bullets, /Everything in Essential and Advanced/);
  assert.match(bullets, /Document and audio redaction/);
  // Verification is a document capability; it must not read as covering audio.
  assert.match(bullets, /Verified document exports, plus redacted audio/);
});

test("the comparison is short and never credits a package with another family's capability", () => {
  assert.ok(comparisonRows.length >= 8 && comparisonRows.length <= 12, `${comparisonRows.length} comparison rows`);

  for (const row of comparisonRows) {
    const essential = comparisonRowIncludes(packageBySlug("essential"), row);
    const advanced = comparisonRowIncludes(packageBySlug("advanced"), row);
    const suite = comparisonRowIncludes(packageBySlug("complete-suite"), row);
    assert.equal(suite, true, `Complete Suite must include "${row.capability}"`);
    if (row.scope === "documents") assert.deepEqual([essential, advanced], [true, false], row.capability);
    if (row.scope === "audio") assert.deepEqual([essential, advanced], [false, true], row.capability);
  }

  for (const row of comparisonRows.filter((candidate) => candidate.scope === "audio")) {
    assert.doesNotMatch(row.capability, /verif|report|Bates|PDF/i, `audio row "${row.capability}" overclaims`);
  }
  for (const row of comparisonRows.filter((candidate) => candidate.scope === "all")) {
    assert.doesNotMatch(row.capability, /document|audio|OCR|transcri/i, `"${row.capability}" is not package-neutral`);
  }
});

test("pricing copy makes no unsupported or unapproved product claims", () => {
  assert.doesNotMatch(
    allPricingCopy,
    /video|image redaction|\bfaces?\b|licen[cs]e plate|translat|speaker|diariz|\.pst|\.ost|mailbox|email redaction|\.eml|\.msg|cloud storage|quota|unlimited|\bSLA\b|service level|account manager|dedicated support|priority support|integration|API access|collaborat|shared workspace|audit trail|automatic(?:ally)? renew|free trial|self-service/i
  );
  assert.doesNotMatch(allPricingCopy, /audio (?:redaction )?report|verified audio|audio verification/i);
  assert.doesNotMatch(allPricingCopy, /(?:\d+|two|three) devices? per (?:user|license)/i);
  assert.doesNotMatch(allPricingCopy, /(?:\d+|two|three) seats? per license/i);
});

test("detailed formats and requirements live in the FAQ, built from the shared format definitions", () => {
  const formats = pricingFaqs.find((faq) => faq.id === "file-formats");
  assert.ok(formats);
  for (const family of Object.values(pricingCapabilityFamilies)) {
    assert.ok(formats.description.includes(family.inputFormats));
    assert.ok(formats.description.includes(family.outputFormats));
  }

  const requirements = pricingFaqs.find((faq) => faq.id === "requirements");
  assert.ok(requirements);
  assert.match(requirements.description, /LibreOffice/);
  assert.match(requirements.description, /Windows 10 or 11/);
  assert.match(requirements.description, /one active desktop session/);

  // Cards and comparison stay free of technical requirements and long extension lists.
  const cardAndTable = JSON.stringify({ pricingPackages, pricingComparisonSections });
  assert.doesNotMatch(cardAndTable, /LibreOffice|\.docx|AIFF|ALAC|AMR|Opus/);
});
