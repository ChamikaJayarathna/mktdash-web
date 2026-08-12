import type { AnyExtension } from "@tiptap/core";
import { Image } from "@tiptap/extension-image";
import { Mention } from "@tiptap/extension-mention";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";
import type { SuggestionOptions } from "@tiptap/suggestion";
import { getMergeTag } from "./mergeTags";

export const MERGE_TAG_NODE_NAME = "mention";

export const FONT_FAMILIES: readonly { label: string; value: string }[] = [
  { label: "Sans serif", value: "var(--font-sans)" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Fixed width", value: "var(--font-mono)" },
];

export const FONT_SIZES: readonly { label: string; value: string }[] = [
  { label: "Small", value: "11px" },
  { label: "Normal", value: "12.5px" },
  { label: "Large", value: "15px" },
  { label: "Huge", value: "18.5px" },
];

export const TEXT_COLOURS: readonly { label: string; value: string }[] = [
  { label: "Body", value: "var(--text-3)" },
  { label: "Heading", value: "var(--text-1)" },
  { label: "Accent", value: "var(--accent-500)" },
  { label: "Success", value: "var(--success-600)" },
  { label: "Danger", value: "var(--danger-600)" },
  { label: "Warning", value: "var(--warning-700)" },
  { label: "Violet", value: "var(--cat-violet-600)" },
  { label: "Muted", value: "var(--text-7)" },
];

export interface ComposerExtensionsOptions {
  readonly placeholder: string;
  readonly mergeTagSuggestion: Omit<SuggestionOptions, "editor">;
}

const mergeTagLabel = (attrs: Record<string, unknown>): string => {
  const id = typeof attrs.id === "string" ? attrs.id : "";

  return `{${id}}`;
};

export const buildComposerExtensions = ({
  placeholder,
  mergeTagSuggestion,
}: ComposerExtensionsOptions): AnyExtension[] => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
  TextStyle,
  Color,
  FontFamily,
  FontSize,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Image.configure({
    inline: false,
    allowBase64: false,
    HTMLAttributes: { style: "max-width:100%;height:auto" },
  }),
  Placeholder.configure({ placeholder }),
  CharacterCount,
  Mention.configure({
    deleteTriggerWithBackspace: true,
    suggestion: mergeTagSuggestion,
    renderText: ({ node }) => mergeTagLabel(node.attrs),
    renderHTML: ({ node }) => [
      "span",
      {
        "data-type": "mention",
        "data-id": String(node.attrs.id ?? ""),
        "data-label": getMergeTag(String(node.attrs.id ?? ""))?.label ?? "",
      },
      mergeTagLabel(node.attrs),
    ],
  }),
];
