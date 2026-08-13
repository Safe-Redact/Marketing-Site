# SafeRedact Service Landing Page

Professional document redaction services website built with Next.js.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Runtime:** React 19

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          Root layout (fonts, metadata, JSON-LD)
│   ├── page.tsx            Homepage
│   ├── globals.css         Global styles, animations, utilities
│   ├── api/contact/route.ts  Contact form API endpoint
│   ├── sitemap.ts          SEO sitemap
│   └── robots.ts           Robots.txt
├── components/
│   ├── ui/                 Reusable UI primitives
│   │   ├── AnimateOnScroll   Scroll-triggered animations
│   │   ├── Badge             Label component
│   │   ├── Button            Button with variants
│   │   ├── Card              Card component
│   │   ├── Heading           Semantic headings
│   │   ├── Icon              SVG icon library (26 icons)
│   │   └── SectionWrapper    Section container
│   ├── layout/             Layout components
│   │   ├── Header            Fixed navigation
│   │   ├── MobileNav         Mobile slide-in menu
│   │   └── Footer            Site footer
│   └── sections/           Page sections
│       ├── Hero              Landing hero with visual
│       ├── TrustBar          Trust indicators
│       ├── Services          Service offerings
│       ├── WhyRedaction      Why professional redaction matters
│       ├── HowItWorks        3-step process
│       ├── Industries        Industry use cases
│       ├── WhySafeRedact     Differentiators
│       ├── QualitySecurity   Security & quality handling
│       ├── SoftwareAlternative  Desktop software CTA
│       ├── Faq               FAQ accordion
│       └── FinalCta          Contact form & CTA
├── content/                Content data (separated from components)
├── lib/
│   └── utils.ts            cn() utility (clsx + tailwind-merge)
└── types/
    └── index.ts            Shared TypeScript types
```

## Content

All website copy lives in `src/content/` as structured TypeScript files. This separates content from presentation and makes future CMS integration straightforward.

## Contact Form

The contact form posts to `/api/contact`. The API route currently logs submissions to the console. To integrate with a backend, edit `src/app/api/contact/route.ts` and replace the `console.log` with your preferred service (email, CRM, database, webhook).

## Deployment

Build and deploy to any Next.js-compatible platform:

```bash
npm run build
npm run start
```

The site is statically generated and can be deployed as a Node.js server or exported as static HTML.
