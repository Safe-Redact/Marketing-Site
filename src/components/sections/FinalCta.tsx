"use client";

import { useState, type FormEvent } from "react";
import { finalCtaContent } from "@/content/final-cta";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    fileType: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setIsSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again or email us directly at support@saferedact.io");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const form = finalCtaContent.form;

  if (isSubmitted) {
    return (
      <section id="contact" className="relative overflow-hidden cta-gradient py-section text-white">
        <div className="absolute inset-0 dot-pattern text-white/[0.02] pointer-events-none" />
        <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 mx-auto">
              <Icon name="check-circle" size={32} className="text-success" />
            </div>
            <Heading className="text-white">Thank You</Heading>
            <p className="mt-4 text-body-lg text-white/60">
              Your inquiry has been received. We will review your project details
              and respond within one business day.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative overflow-hidden cta-gradient py-section text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-accent/[0.06] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-accent/[0.04] blur-3xl" />
        <div className="absolute inset-0 dot-pattern text-white/[0.02]" />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Content */}
          <div>
            <AnimateOnScroll>
              <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
                Get Started
              </p>
              <Heading className="text-white">
                {finalCtaContent.headline}
              </Heading>
              <p className="mt-4 text-body-lg text-white/60">
                {finalCtaContent.subheadline}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="mt-8 space-y-4">
                {[
                  "No commitment required",
                  "Response within one business day",
                  "Tailored quote for your project",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-body text-white/70">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Icon name="check-circle" size={14} className="text-accent" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="mt-10 flex items-center gap-4 rounded-xl bg-white/[0.05] p-4 ring-1 ring-white/[0.08]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                  <Icon name="send" size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-body-sm font-medium text-white/80">Prefer email?</div>
                  <a href="mailto:support@saferedact.io" className="text-body-sm text-accent hover:text-accent-light transition-colors">
                    support@saferedact.io
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Form */}
          <AnimateOnScroll delay={100}>
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white/[0.05] p-6 sm:p-8 ring-1 ring-white/[0.08] backdrop-blur-sm">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-body-sm font-medium text-white/70">
                    {form.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={form.namePlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-body text-white placeholder-white/25 transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-body-sm font-medium text-white/70">
                    {form.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={form.emailPlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-body text-white placeholder-white/25 transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="mb-1.5 block text-body-sm font-medium text-white/70">
                    {form.orgLabel}
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder={form.orgPlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-body text-white placeholder-white/25 transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="fileType" className="mb-1.5 block text-body-sm font-medium text-white/70">
                    {form.fileTypeLabel}
                  </label>
                  <select
                    id="fileType"
                    name="fileType"
                    required
                    value={formData.fileType}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-body transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
                      !formData.fileType && "text-white/25"
                    )}
                  >
                    <option value="" disabled>Select file type</option>
                    {form.fileTypeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-primary-800 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-body-sm font-medium text-white/70">
                    {form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={form.messagePlaceholder}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-body text-white placeholder-white/25 transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? form.submittingLabel : form.submitLabel}
                  {!isSubmitting && <Icon name="send" size={18} />}
                </Button>
              </div>
            </form>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
