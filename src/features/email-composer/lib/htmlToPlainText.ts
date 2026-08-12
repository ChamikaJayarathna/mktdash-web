const BLOCK_CLOSE =
  /<\/(p|div|h[1-6]|li|ul|ol|blockquote|pre|tr|table|section)\s*>/gi;

const LINE_BREAK = /<br\s*\/?>/gi;

const LIST_ITEM_OPEN = /<li[^>]*>/gi;

const ANCHOR = /<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;

const IMAGE = /<img\b[^>]*alt=["']([^"']*)["'][^>]*>/gi;

const ANY_TAG = /<[^>]+>/g;

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

const decodeEntities = (value: string): string =>
  value
    .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;|&apos;/g, (entity) =>
      entity in ENTITIES ? ENTITIES[entity] : entity,
    )
    .replace(/&#(\d+);/g, (_match, code: string) =>
      String.fromCodePoint(Number(code)),
    );

export const htmlToPlainText = (html: string): string =>
  decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      .replace(ANCHOR, (_match, href: string, text: string) => {
        const label = text.replace(ANY_TAG, "").trim();

        return label.length === 0 || label === href
          ? href
          : `${label} (${href})`;
      })
      .replace(IMAGE, (_match, alt: string) => (alt ? `[${alt}]` : "[image]"))
      .replace(LINE_BREAK, "\n")
      .replace(LIST_ITEM_OPEN, "- ")
      .replace(BLOCK_CLOSE, "\n")
      .replace(ANY_TAG, ""),
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const countLinks = (html: string): number =>
  (html.match(/<a\b[^>]*href=/gi) ?? []).length;

export const countImages = (html: string): number =>
  (html.match(/<img\b/gi) ?? []).length;

export const isEmptyEditorHtml = (html: string): boolean =>
  htmlToPlainText(html).length === 0 && countImages(html) === 0;
