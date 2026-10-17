import path from "node:path";
import {
  DEFAULT_BLOG_DIRECTORY,
  DEFAULT_BLOG_MEDIA_DIRECTORY,
  loadArticlesFromDirectory,
  validatePublicationTiming,
} from "../src/lib/blog/content";

async function main() {
  const articles = await loadArticlesFromDirectory(
    DEFAULT_BLOG_DIRECTORY,
    DEFAULT_BLOG_MEDIA_DIRECTORY
  );
  const now = new Date();

  for (const article of articles) validatePublicationTiming(article, now);

  const visible = articles.filter((article) =>
    article.publication === "immediate" ||
    (article.publication === "scheduled" && new Date(article.date) <= now)
  ).length;
  const scheduled = articles.filter(
    (article) => article.publication === "scheduled" && new Date(article.date) > now
  ).length;
  const archived = articles.filter((article) => article.publication === "archived").length;

  console.log(
    `Validated ${articles.length} article files (${visible} visible, ${scheduled} scheduled, ${archived} archived).`
  );

  // Resolve the path before printing it so CI logs identify exactly which tree was validated.
  console.log(`Content root: ${path.resolve(DEFAULT_BLOG_DIRECTORY)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
