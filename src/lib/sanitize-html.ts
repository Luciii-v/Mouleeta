import "server-only";
import sanitizeHtml from "sanitize-html";

export type SanitizedProductHtml = string & { readonly __sanitizedProductHtml: unique symbol };

/** Sanitize once on the server before HTML crosses the client boundary. */
export function sanitizeProductHtml(input: string): SanitizedProductHtml {
  return sanitizeHtml(input, {
    allowedTags: [
      "p", "br", "hr", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "strong", "b", "em", "i", "u", "s", "blockquote", "a",
      "table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td",
    ],
    allowedAttributes: {
      "*": ["class"],
      a: ["href", "title"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    enforceHtmlBoundary: true,
  }) as SanitizedProductHtml;
}
