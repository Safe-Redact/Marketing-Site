# Legacy Preservation Plan

## Canonical baseline

Commit `31a4305` (`31a43055b08a27333c0ec8d9663f691e7f329e5b`) is the canonical pre-revamp legacy baseline. It remains unchanged in Git history. The marketing migration does not create a second Next.js application, duplicate the old source tree, or expose a `/legacy` route.

The current Phase 1, Phase 2, and marketing-only work remains uncommitted in the existing working tree on `feat/saferedact-marketing-revamp`. No reset, checkout-overwrite, rebase, history rewrite, or cleanup operation is part of this plan.

## Preserved legacy implementation

The baseline commit retains the original homepage, section components, content modules, styling, configuration, and contact implementation. In the current working tree, legacy-only components and content that are not imported by `src/app/page.tsx` also remain available. In particular:

- `src/components/sections/SoftwareAlternative.tsx`
- `src/content/software.ts`
- `src/components/sections/WhyRedaction.tsx`
- `src/content/why-redaction.ts`
- `src/components/sections/QualitySecurity.tsx`
- `src/content/quality.ts`

Some preserved legacy modules contain historical download-oriented wording or destinations. They are intentionally not imported by the active homepage and are covered by the active-import audit. They must not be reintroduced without a new product and architecture decision.

## Non-destructive recovery

Use Git object reads when a historical file is needed. These commands do not alter the working tree:

```powershell
git show 31a4305:src/app/page.tsx
git show 31a4305:src/components/layout/Header.tsx
git ls-tree -r --name-only 31a4305
```

To create an external snapshot without changing active routes or files:

```powershell
git archive --format=zip --output saferedact-legacy-31a4305.zip 31a4305
```

If an editable legacy checkout is ever needed, create it in a separate, explicitly chosen worktree after the current uncommitted work has been safely preserved. Do not switch or reset this working tree to the legacy commit.

## Recovery guarantees and limits

- Git commit `31a4305` is the authoritative recovery point for the pre-revamp site.
- Current uncommitted Phase 1/2 work is preserved only in this working tree until the repository owner chooses an approved persistence step.
- No generated archive is stored inside the application repository, avoiding source duplication and accidental production imports.
- No legacy page is reachable from navigation, the sitemap, or a public route.
