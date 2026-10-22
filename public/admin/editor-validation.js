(function registerSafeRedactEditorialControls(global) {
  "use strict";

  const articleTypes = new Set(["article", "news", "product-update", "guide"]);
  const publications = new Set(["immediate", "scheduled", "archived"]);
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const imagePattern = /^\/images\/blog\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;

  function cleanText(value) {
    return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
  }

  function collapseRepeatedText(value) {
    const cleaned = cleanText(value);
    if (typeof cleaned !== "string") return cleaned;
    const separatedDuplicate = /^(.{2,}?)\s+\1$/iu.exec(cleaned);
    if (separatedDuplicate) return separatedDuplicate[1];
    if (cleaned.length < 4 || cleaned.length % 2 !== 0) {
      return cleaned;
    }
    const middle = cleaned.length / 2;
    return cleaned.slice(0, middle).toLowerCase() === cleaned.slice(middle).toLowerCase()
      ? cleaned.slice(0, middle)
      : cleaned;
  }

  function tagSlug(value) {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeTags(value) {
    const tags = Array.isArray(value) ? value : [];
    const seen = new Set();
    const normalized = [];
    for (const candidate of tags) {
      const tag = collapseRepeatedText(candidate);
      if (typeof tag !== "string" || !tag) continue;
      const slug = tagSlug(tag);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      normalized.push(tag);
    }
    return normalized;
  }

  function normalizeEntryData(data) {
    return {
      ...data,
      title: collapseRepeatedText(data.title),
      slug: cleanText(data.slug),
      excerpt: cleanText(data.excerpt),
      author: cleanText(data.author),
      category: cleanText(data.category),
      tags: normalizeTags(data.tags),
      featuredImage: cleanText(data.featuredImage),
      imageAlt: cleanText(data.imageAlt),
      seoDescription: cleanText(data.seoDescription),
    };
  }

  function requireLength(data, field, minimum, maximum) {
    const value = data[field];
    if (typeof value !== "string" || value.length < minimum || value.length > maximum) {
      throw new Error(`${field} must contain ${minimum} to ${maximum} characters.`);
    }
  }

  function validateEntryData(rawData) {
    const data = normalizeEntryData(rawData);
    requireLength(data, "title", 5, 120);
    requireLength(data, "slug", 3, 100);
    requireLength(data, "excerpt", 40, 240);
    requireLength(data, "author", 2, 80);
    requireLength(data, "category", 2, 60);
    requireLength(data, "seoDescription", 50, 170);

    if (!slugPattern.test(data.slug)) {
      throw new Error("slug must use lowercase letters, numbers, and single hyphens only.");
    }
    if (!articleTypes.has(data.type)) throw new Error("Content type is not approved.");
    if (!publications.has(data.publication)) throw new Error("Publication intent is not approved.");
    if (!Array.isArray(data.tags) || data.tags.length > 6) throw new Error("Use no more than six tags.");
    for (const tag of data.tags) {
      if (tag.length < 2 || tag.length > 30 || !tagSlug(tag)) {
        throw new Error("Each tag must contain 2 to 30 characters and produce a URL slug.");
      }
    }

    const publicationTime = Date.parse(data.date);
    if (!Number.isFinite(publicationTime)) throw new Error("Publication time must be a valid date.");
    if (data.publication === "immediate" && publicationTime > Date.now() + 5 * 60 * 1000) {
      throw new Error("Immediate publication cannot use a future time; choose scheduled publication.");
    }
    if (data.updatedDate && !Number.isFinite(Date.parse(data.updatedDate))) {
      throw new Error("Updated time must be a valid date.");
    }
    if (data.updatedDate && Date.parse(data.updatedDate) < publicationTime) {
      throw new Error("Updated time cannot be earlier than the publication time.");
    }

    if (data.featuredImage) {
      if (!imagePattern.test(data.featuredImage) || data.featuredImage.includes("..")) {
        throw new Error("Featured images must be uploaded under /images/blog/.");
      }
      requireLength(data, "imageAlt", 2, 180);
    } else if (data.imageAlt) {
      throw new Error("Image alt text requires a featured image.");
    }

    if (typeof data.body !== "string" || !data.body.trim()) {
      throw new Error("Article content cannot be empty.");
    }
    if (/^#\s+/m.test(data.body)) {
      throw new Error("The page supplies the article title; start the body below heading level one.");
    }
    if (/<[a-z][^>]*>/i.test(data.body)) throw new Error("Raw HTML is not permitted.");
    for (const match of data.body.matchAll(/(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
      const image = match[1] === "!";
      const label = match[2].trim();
      const target = match[3];
      if (image) {
        if (!label) throw new Error("Every article image requires alt text.");
        if (!imagePattern.test(target) || target.includes("..")) {
          throw new Error("Article images must be uploaded under /images/blog/.");
        }
      } else if (!/^(?:https?:\/\/|mailto:|#|\/(?!\/))/.test(target) || target.includes("..")) {
        throw new Error("Article links must use HTTPS, email, an anchor, or a safe local path.");
      }
    }

    return data;
  }

  function updateImmutableData(data, normalized) {
    return Object.entries(normalized).reduce(
      (current, pair) => current.set(pair[0], pair[1]),
      data
    );
  }

  const api = { collapseRepeatedText, normalizeTags, normalizeEntryData, validateEntryData };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.SafeRedactCmsValidation = api;

  if (!global.CMS) return;

  global.CMS.registerEventListener({
    name: "preSave",
    handler: function ({ entry }) {
      const current = entry.get("data");
      const normalized = validateEntryData(current.toJS());
      return updateImmutableData(current, normalized);
    },
  });

  global.CMS.registerEventListener({
    name: "prePublish",
    handler: function ({ entry }) {
      validateEntryData(entry.get("data").toJS());
    },
  });

  if (global.createClass && global.h) {
    const Preview = global.createClass({
      getInitialState: function () {
        return { live: null };
      },
      checkLive: function () {
        const slug = this.props.entry.getIn(["data", "slug"]);
        if (!slug || !slugPattern.test(slug)) return this.setState({ live: false });
        fetch(`/blog/${encodeURIComponent(slug)}`, { method: "HEAD", cache: "no-store" })
          .then((response) => this.setState({ live: response.ok }))
          .catch(() => this.setState({ live: false }));
      },
      componentDidMount: function () {
        this.checkLive();
      },
      componentDidUpdate: function (previous) {
        if (previous.entry.getIn(["data", "slug"]) !== this.props.entry.getIn(["data", "slug"])) {
          this.checkLive();
        }
      },
      render: function () {
        const entry = this.props.entry;
        const slug = entry.getIn(["data", "slug"]);
        const title = entry.getIn(["data", "title"]) || "Untitled article";
        const body = entry.getIn(["data", "body"]) || "";
        const status = this.state.live === null
          ? "Checking the current release…"
          : this.state.live
            ? "This article is available in the current release."
            : "This draft is not in the current release. It becomes public only after review, merge, and a successful release.";
        const children = [
          global.h("p", { key: "status" }, status),
          global.h("h1", { key: "title" }, title),
          global.h("pre", { key: "body", style: { whiteSpace: "pre-wrap", fontFamily: "inherit" } }, body),
        ];
        if (this.state.live && slug) {
          children.splice(1, 0, global.h(
            "a",
            { key: "link", href: `/blog/${encodeURIComponent(slug)}`, target: "_blank", rel: "noreferrer" },
            "Open the deployed article"
          ));
        }
        return global.h("article", { style: { maxWidth: "760px", margin: "32px auto", padding: "24px" } }, children);
      },
    });
    global.CMS.registerPreviewTemplate("articles", Preview);
  }
})(typeof window !== "undefined" ? window : globalThis);
