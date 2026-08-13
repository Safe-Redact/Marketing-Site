import { siteConfig } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <a href="#" className="mb-4 inline-block text-xl font-bold">
              <span className="text-accent">Safe</span>Redact
            </a>
            <p className="mt-3 max-w-xs text-body-sm text-white/50">
              Professional document redaction services for video, audio, and
              documents. Secure, accurate, and confidential handling.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-heading-sm font-semibold text-white">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#services"
                  className="text-body-sm text-white/50 transition-colors hover:text-white"
                >
                  Video Redaction
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-body-sm text-white/50 transition-colors hover:text-white"
                >
                  Audio Redaction
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-body-sm text-white/50 transition-colors hover:text-white"
                >
                  Document Redaction
                </a>
              </li>
              <li>
                <a
                  href="https://saferedact.io/download"
                  className="text-body-sm text-white/50 transition-colors hover:text-white"
                >
                  Desktop Software
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-heading-sm font-semibold text-white">
              Get in Touch
            </h3>
            <p className="mb-4 text-body-sm text-white/50">
              Contact us to discuss your redaction needs and get a personalized
              solution.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 text-body-sm font-medium text-accent transition-colors hover:text-accent-light"
            >
              <Icon name="send" size={16} />
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-caption text-white/30">
            {siteConfig.name} &copy; {new Date().getFullYear()} All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-caption text-white/30 transition-colors hover:text-white/60"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="#"
              className="text-caption text-white/30 transition-colors hover:text-white/60"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
