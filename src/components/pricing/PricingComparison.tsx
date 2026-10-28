import { Icon } from "@/components/ui/Icon";
import {
  comparisonRowIncludes,
  pricingComparisonSections,
  pricingPackages,
} from "@/content/pricing";

export function PricingComparison() {
  return (
    <div className="overflow-hidden rounded-panel border border-border-subtle bg-surface-raised shadow-panel">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">
          Comparison of the capabilities included in Essential, Advanced, and Complete Suite
        </caption>
        <colgroup>
          <col className="w-[43%] sm:w-[52%]" />
          {pricingPackages.map((plan) => (
            <col key={plan.slug} className="w-[19%] sm:w-[16%]" />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-border-subtle bg-surface-active">
            <th scope="col" className="px-4 py-4 align-bottom font-heading text-sm font-semibold text-ink sm:px-6 sm:py-5">
              Capability
            </th>
            {pricingPackages.map((plan) => (
              <th key={plan.slug} scope="col" className="px-0.5 py-4 text-center align-bottom min-[380px]:px-1 sm:px-4 sm:py-5">
                <span className="block font-heading text-[0.6875rem] font-semibold leading-4 text-ink min-[380px]:text-xs sm:text-sm">
                  {plan.shortName}
                </span>
                <span className="mt-1 hidden text-xs font-medium text-ink-muted sm:block">{plan.scopeLabel}</span>
              </th>
            ))}
          </tr>
        </thead>
        {pricingComparisonSections.map((section) => (
          <tbody key={section.title}>
            <tr className="border-b border-border-subtle bg-surface-active/50">
              <th
                scope="colgroup"
                colSpan={pricingPackages.length + 1}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.09em] text-accent-cool sm:px-6"
              >
                {section.title}
              </th>
            </tr>
            {section.rows.map((row) => (
              <tr key={row.capability} className="border-b border-border-subtle last:border-b-0">
                <th scope="row" className="px-4 py-4 text-sm font-medium leading-6 text-ink sm:px-6">
                  {row.capability}
                </th>
                {pricingPackages.map((plan) => {
                  const included = comparisonRowIncludes(plan, row);
                  return (
                    <td key={plan.slug} className="px-1 py-4 text-center sm:px-4">
                      {included ? (
                        <Icon name="check-circle" size={20} className="inline-block text-accent-mint" />
                      ) : (
                        <span aria-hidden="true" className="text-lg leading-none text-ink-muted/60">
                          –
                        </span>
                      )}
                      <span className="sr-only">{included ? "Included" : "Not included"}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
