import Image from "next/image";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { isSafeArticleLink, isSafeBlogImagePath } from "@/lib/blog/content";

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        urlTransform={(url, key) => {
          if (key === "src") return isSafeBlogImagePath(url) ? url : "";
          if (key === "href") return isSafeArticleLink(url) ? url : "";
          return defaultUrlTransform(url);
        }}
        components={{
          a: ({ href = "", children, ...props }) => {
            const external = /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...props}
                {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              >
                {children}
              </a>
            );
          },
          img: ({ src = "", alt = "" }) => {
            if (typeof src !== "string" || !isSafeBlogImagePath(src)) return null;
            return (
              <span className="relative my-8 block aspect-[16/10] overflow-hidden rounded-card border border-border-subtle">
                <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 740px" className="object-cover" />
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
