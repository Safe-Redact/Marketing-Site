import Image from "next/image";
import React from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { isSafeArticleLink, isSafeBlogImagePath } from "@/lib/blog/content";
import { extractArticleHeadings } from "@/lib/blog/headings";

export function ArticleBody({ content }: { content: string }) {
  const headings = extractArticleHeadings(content);
  let headingIndex = 0;

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
          h2: ({ children, node: _node, ...props }) => {
            const heading = headings[headingIndex++];
            return <h2 id={heading?.id} tabIndex={-1} {...props}>{children}</h2>;
          },
          h3: ({ children, node: _node, ...props }) => {
            const heading = headings[headingIndex++];
            return <h3 id={heading?.id} tabIndex={-1} {...props}>{children}</h3>;
          },
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
              <span className="relative my-10 block aspect-[16/10] overflow-hidden rounded-[16px] border border-border-subtle">
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
