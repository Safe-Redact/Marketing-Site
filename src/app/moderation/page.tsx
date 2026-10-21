import type { Metadata } from "next";
import { ModerationPanel } from "@/components/moderation/ModerationPanel";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Comment moderation",
  // A staff tool. It is never linked from the public site and never indexed, and
  // the page itself grants nothing: every action is authorized server side.
  robots: { index: false, follow: false },
};

export default function ModerationPage() {
  return (
    <main id="main-content" className="min-h-screen bg-canvas text-ink">
      <Container className="max-w-[60rem] py-14 sm:py-16">
        <Eyebrow>OpenRedakt staff</Eyebrow>
        <h1 className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
          Comment moderation
        </h1>
        <p className="mt-4 max-w-2xl text-body-sm leading-6 text-ink-muted">
          Comments are held for review before they appear. Every action here is
          recorded against your verified GitHub identity.
        </p>
        <div className="mt-10">
          <ModerationPanel />
        </div>
      </Container>
    </main>
  );
}
