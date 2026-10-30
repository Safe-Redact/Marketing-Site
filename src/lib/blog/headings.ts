import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { ArticleHeading } from "./types";

type MarkdownNode = {
  type?: string;
  value?: unknown;
  alt?: unknown;
  children?: readonly MarkdownNode[];
};

function readableNodeText(node: MarkdownNode): string {
  if ((node.type === "text" || node.type === "inlineCode") && typeof node.value === "string") {
    return node.value;
  }
  if (node.type === "image" && typeof node.alt === "string") return node.alt;
  return node.children?.map(readableNodeText).join("") ?? "";
}

function headingSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

export function extractArticleHeadings(markdown: string): readonly ArticleHeading[] {
  const tree = unified().use(remarkParse).parse(markdown);
  const headings: ArticleHeading[] = [];
  const slugCounts = new Map<string, number>();

  visit(tree, "heading", (node) => {
    if (node.depth !== 2 && node.depth !== 3) return;

    const text = readableNodeText(node as MarkdownNode).trim().replace(/\s+/g, " ");
    if (!text) return;

    const baseId = headingSlug(text);
    const count = (slugCounts.get(baseId) ?? 0) + 1;
    slugCounts.set(baseId, count);
    headings.push({
      id: count === 1 ? baseId : `${baseId}-${count}`,
      depth: node.depth,
      text,
    });
  });

  return headings;
}
