import type { Editor } from "@tiptap/core";
import { MERGE_TAG_NODE_NAME } from "./composerExtensions";
import { sanitizeEmailHtml } from "./sanitizeEmailHtml";
import type { MergeTag } from "../types/emailComposer.types";

export const insertMergeTag = (editor: Editor, tag: MergeTag): void => {
  editor
    .chain()
    .focus()
    .insertContent([
      {
        type: MERGE_TAG_NODE_NAME,
        attrs: { id: tag.id, label: tag.label },
      },
      { type: "text", text: " " },
    ])
    .run();
};

export const insertSanitisedHtml = (editor: Editor, html: string): void => {
  editor.chain().focus().insertContent(sanitizeEmailHtml(html)).run();
};

export const replaceWithSanitisedHtml = (
  editor: Editor,
  html: string,
): void => {
  editor.chain().focus().setContent(sanitizeEmailHtml(html)).run();
};

export const applyLink = (editor: Editor, href: string): void => {
  const trimmed = href.trim();

  if (trimmed.length === 0) {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: trimmed })
    .run();
};

export const insertImageByUrl = (
  editor: Editor,
  src: string,
  alt: string,
): void => {
  const trimmed = src.trim();

  if (trimmed.length === 0) {
    return;
  }

  editor.chain().focus().setImage({ src: trimmed, alt }).run();
};

export const clearFormatting = (editor: Editor): void => {
  editor.chain().focus().unsetAllMarks().clearNodes().run();
};
