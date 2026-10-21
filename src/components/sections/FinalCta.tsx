"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { finalCtaContent } from "@/content/final-cta";
import { publicSupportEmail } from "@/content/site";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
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
        body: JSON.stringify({ ...formData, kind: "demo", website }),
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
    "w-full rounded-control border border-border-subtle bg-surface-active px-4 py-3 text-base text-ink placeholder:text-ink-muted/55 transition-colors focus:border-accent-cool focus:outline-none focus:ring-1 focus:ring-accent-cool";

  return (
    <section id="contact" className="relative overflow-hidden bg-canvas pb-20 pt-section text-ink lg:pb-28">
      <Container>
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-panel bg-[linear-gradient(115deg,#72ead9_0%,#52c8f0_48%,#398cf4_100%)] px-6 py-10 text-canvas shadow-[0_12px_46px_rgba(51,183,255,0.24)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(8,9,20,0.35)_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-canvas/70">Windows redaction software</p>
                <h2 className="mt-4 max-w-[16ch] font-heading text-[clamp(2rem,4.2vw,3.35rem)] font-bold leading-[1.08] tracking-[-0.025em] text-canvas text-balance">
                  Bring reviewed redaction into one workspace
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-canvas/75 sm:text-lg">
                  Explore how OpenRedakt supports your source formats, review decisions, and redacted-output workflow.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#demo-enquiry" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-canvas px-6 py-3 font-semibold text-ink transition-colors hover:bg-surface-active">
                    Request a Demo
                    <Icon name="arrow" size={17} />
                  </a>
                  <a href={`mailto:${publicSupportEmail}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-canvas/30 bg-white/20 px-6 py-3 font-semibold text-canvas transition-colors hover:bg-white/30">
                    Direct Contact
                    <Icon name="send" size={17} />
                  </a>
                </div>
              </div>
              <div className="relative mx-auto hidden h-52 w-full max-w-sm lg:block" aria-hidden="true">
                <div className="absolute right-6 top-1/2 h-40 w-64 -translate-y-1/2 rotate-[-4deg] rounded-[2rem] bg-white/55 shadow-xl" />
                <div className="absolute right-14 top-[38%] h-5 w-48 rounded-md bg-canvas/80" />
                <div className="absolute right-1 top-[51%] h-5 w-56 rounded-md bg-accent-warm" />
                <div className="absolute right-20 top-[64%] h-5 w-40 rounded-md bg-canvas/80" />
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div id="demo-enquiry" data-scroll-target className="mt-16 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <AnimateOnScroll>
            <p className="font-heading text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-accent-cool">Evaluate your workflow</p>
            <h2 id="demo-enquiry-heading" className="mt-4 font-heading text-display font-bold text-ink text-balance">{finalCtaContent.headline}</h2>
            <p className="mt-5 text-base leading-7 text-ink-muted">{finalCtaContent.subheadline}</p>
            <div className="mt-8 space-y-4 border-t border-border-subtle pt-7">
              {["Describe the source formats", "Share the review steps", "Use email when delivery matters"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-ink-muted">
                  <Icon name="check-circle" size={17} className="text-accent-mint" />
                  {item}
                </div>
              ))}
            </div>
            <a href={`mailto:${publicSupportEmail}`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-warm hover:text-accent-warm-hover">
              <Icon name="send" size={16} />
              {publicSupportEmail}
            </a>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <div className="rounded-panel border border-border-subtle bg-surface-raised p-5 shadow-panel sm:p-8">
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
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-accent-mint/30 bg-accent-mint/10 text-accent-mint">
                    <Icon name="check-circle" size={30} />
                  </span>
                  <h3 ref={successHeadingRef} tabIndex={-1} className="mt-6 font-heading text-2xl font-semibold text-ink outline-none">Enquiry validated</h3>
                  <p className="mt-4 max-w-md text-base leading-7 text-ink-muted">{statusMessage}</p>
                  <a href={`mailto:${publicSupportEmail}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-warm hover:text-accent-warm-hover">
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
                    <p aria-hidden="true" className={cn("text-sm leading-5", hasError ? "text-accent-warm" : "text-ink-muted")}>{statusMessage}</p>
                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="shrink-0 sm:min-w-44">
                      {isSubmitting ? form.submittingLabel : form.submitLabel}
                      {!isSubmitting && <Icon name="send" size={17} />}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
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
