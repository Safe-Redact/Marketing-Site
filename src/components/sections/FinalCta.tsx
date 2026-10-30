"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { finalCtaContent } from "@/content/final-cta";
import { pricingPackages, type PricingPackageSlug } from "@/content/pricing";
import { publicSupportEmail } from "@/content/site";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The single demo enquiry form. /contact and /book-a-demo both render this
 * component, so validation, the honeypot, and delivery feedback cannot drift between them.
 * The "panel" variant renders the form alone; the page then supplies the element with
 * id="demo-enquiry-heading" that names the form.
 */
export function DemoEnquiry({
  className,
  initialPackage = "",
  variant = "split",
}: {
  className?: string;
  initialPackage?: PricingPackageSlug | "";
  variant?: "split" | "panel";
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    packageInterest: initialPackage,
    licenseCount: "",
    fileType: "",
    message: "",
  });
  // Honeypot. Hidden from sight, from the accessibility tree and from the tab order,
  // so only an unattended submitter fills it in.
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (isSubmitted) successHeadingRef.current?.focus();
  }, [isSubmitted]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");
    setHasError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          packageInterest: formData.packageInterest || undefined,
          licenseCount: formData.licenseCount ? Number(formData.licenseCount) : undefined,
          kind: "demo",
          website,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        delivered?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setHasError(true);
        setStatusMessage(
          result.error ??
            `The site could not accept the submission. Please try again or email ${publicSupportEmail} directly.`
        );
        return;
      }

      setIsSubmitted(true);
      setStatusMessage(
        result.delivered
          ? "Your demo enquiry has been delivered. We will reply to the address you provided."
          : `Your demo enquiry was validated, but delivery is not yet switched on, so nobody has received it. Please email ${publicSupportEmail} directly.`
      );
    } catch {
      setHasError(true);
      setStatusMessage(
        `The site could not reach the server. Please try again or email ${publicSupportEmail} directly.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = finalCtaContent.form;
  const fieldClass =
    "w-full rounded-[10px] border border-ink-muted/55 bg-canvas/70 px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 transition-colors hover:border-ink-muted/75 focus:border-accent-cool focus:outline-none focus:ring-1 focus:ring-accent-cool motion-reduce:transition-none";

  const panel = (
    <div className={cn("rounded-[18px] border border-border-subtle/60 bg-surface-raised/80 p-5 shadow-panel backdrop-blur-sm sm:p-8", variant === "panel" && "rounded-[24px] border-[rgb(28_25_23/0.06)] bg-white/90 shadow-[0_30px_80px_-36px_rgb(120_40_12/0.35)] sm:p-9")}>
      <p
        id="contact-form-status"
        role={hasError ? "alert" : "status"}
        aria-live={hasError ? "assertive" : "polite"}
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </p>
      {isSubmitted ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-accent-warm/30 bg-accent-warm/10 text-accent-ink">
            <Icon name="check-circle" size={30} />
          </span>
          <h3 ref={successHeadingRef} tabIndex={-1} className="mt-6 font-heading text-2xl font-semibold text-ink outline-none">Enquiry validated</h3>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-muted">{statusMessage}</p>
          <a href={`mailto:${publicSupportEmail}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink hover:text-accent-ink-hover">
            <Icon name="send" size={16} />
            Email {publicSupportEmail} when delivery matters
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} aria-labelledby="demo-enquiry-heading" aria-describedby="contact-form-delivery contact-form-status" aria-busy={isSubmitting}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={form.nameLabel} htmlFor="name">
              <input id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder={form.namePlaceholder} className={fieldClass} />
            </Field>
            <Field label={form.emailLabel} htmlFor="email">
              <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} placeholder={form.emailPlaceholder} className={fieldClass} />
            </Field>
            <Field label={form.orgLabel} htmlFor="organization">
              <input id="organization" name="organization" type="text" autoComplete="organization" maxLength={120} value={formData.organization} onChange={(event) => setFormData((current) => ({ ...current, organization: event.target.value }))} placeholder={form.orgPlaceholder} className={fieldClass} />
            </Field>
            <Field label={form.packageLabel} htmlFor="packageInterest">
              <select id="packageInterest" name="packageInterest" value={formData.packageInterest} onChange={(event) => setFormData((current) => ({ ...current, packageInterest: event.target.value as PricingPackageSlug | "" }))} className={cn(fieldClass, !formData.packageInterest && "text-ink-muted")}>
                <option value="">{form.packagePlaceholder}</option>
                {pricingPackages.map((plan) => <option key={plan.slug} value={plan.slug} className="bg-surface-active text-ink">{plan.name}</option>)}
              </select>
            </Field>
            <Field label={form.licenseCountLabel} htmlFor="licenseCount">
              <input id="licenseCount" name="licenseCount" type="number" inputMode="numeric" min={1} max={1000} step={1} value={formData.licenseCount} onChange={(event) => setFormData((current) => ({ ...current, licenseCount: event.target.value }))} placeholder={form.licenseCountPlaceholder} className={fieldClass} />
            </Field>
            <Field label={form.fileTypeLabel} htmlFor="fileType">
              <select id="fileType" name="fileType" required value={formData.fileType} onChange={(event) => setFormData((current) => ({ ...current, fileType: event.target.value }))} className={cn(fieldClass, !formData.fileType && "text-ink-muted")}>
                <option value="" disabled>Select file type</option>
                {form.fileTypeOptions.map((option) => <option key={option} value={option} className="bg-surface-active text-ink">{option}</option>)}
              </select>
            </Field>
            <Field label={form.messageLabel} htmlFor="message" className="sm:col-span-2">
              <textarea id="message" name="message" rows={4} required minLength={10} maxLength={2000} value={formData.message} onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))} placeholder={form.messagePlaceholder} className={cn(fieldClass, "resize-none")} />
            </Field>
          </div>
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>
          <p id="contact-form-delivery" className="mt-5 flex items-start gap-2 text-xs leading-5 text-ink-muted">
            <Icon name="info" size={15} className="mt-0.5 shrink-0 text-accent-cool" />
            {form.deliveryNotice}
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p aria-hidden="true" className={cn("text-sm leading-5", hasError ? "text-accent-ink" : "text-ink-muted")}>{statusMessage}</p>
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="shrink-0 sm:min-w-44">
              {isSubmitting ? form.submittingLabel : form.submitLabel}
              {!isSubmitting && <Icon name="send" size={17} />}
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  if (variant === "panel") {
    return (
      <div id="demo-enquiry" data-scroll-target className={className}>
        {panel}
      </div>
    );
  }

  return (
    <div id="demo-enquiry" data-scroll-target className={cn("grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20", className)}>
      <AnimateOnScroll>
        <p className="type-eyebrow">Evaluate your workflow</p>
        <h2 id="demo-enquiry-heading" className="type-h2 mt-4 max-w-[18ch] text-balance">{finalCtaContent.headline}</h2>
        <p className="type-body mt-5 max-w-md">{finalCtaContent.subheadline}</p>
        <ul className="mt-8 border-t border-border-subtle/60">
          {["Describe the source formats", "Share the review steps", "Use email when delivery matters"].map((item) => (
            <li key={item} className="flex items-center gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] text-ink-muted">
              <Icon name="check-circle" size={17} className="text-accent-ink" />
              {item}
            </li>
          ))}
        </ul>
        <a href={`mailto:${publicSupportEmail}`} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover motion-reduce:transition-none">
          <Icon name="send" size={16} />
          {publicSupportEmail}
        </a>
      </AnimateOnScroll>

      <AnimateOnScroll delay={100}>{panel}</AnimateOnScroll>
    </div>
  );
}

function Field({ label, htmlFor, children, className }: { label: string; htmlFor: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}
