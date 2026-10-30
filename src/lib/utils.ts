import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The custom `fontSize` keys defined in tailwind.config.ts. tailwind-merge only knows
 * Tailwind's built-in sizes, so without this list it files `text-body-sm` and the rest
 * under text colour and drops whichever of the size or the colour comes first.
 * tests/cn-merge.test.ts keeps this list in step with the Tailwind config.
 */
export const customFontSizes = [
  "display-lg",
  "display",
  "display-sm",
  "heading-xl",
  "heading-lg",
  "heading",
  "heading-sm",
  "body-xl",
  "body-lg",
  "body",
  "body-sm",
  "caption",
] as const;

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: [...customFontSizes] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
