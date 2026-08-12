"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { buildComposerExtensions } from "../lib/composerExtensions";
import { htmlToPlainText } from "../lib/htmlToPlainText";
import { sanitizeEmailHtml } from "../lib/sanitizeEmailHtml";
import type { MergeTagSuggestion } from "./useMergeTagSuggestion";

export interface ComposerEditorBody {
  readonly bodyHtml: string;
  readonly bodyText: string;
}

export interface UseComposerEditorOptions {
  readonly initialHtml: string;
  readonly placeholder: string;
  readonly ariaLabel: string;
  readonly mergeTagSuggestion: MergeTagSuggestion;
  readonly onChange: (body: ComposerEditorBody) => void;
  readonly onSubmitShortcut: () => void;
}

const EDITOR_CLASS_NAME =
  "min-h-40 w-full max-w-none text-base leading-loose text-body outline-none " +
  "[&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border-6 [&_blockquote]:pl-3 [&_blockquote]:text-text-5 " +
  "[&_h1]:mb-2.5 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:text-heading " +
  "[&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:tracking-snug [&_h2]:text-heading " +
  "[&_h3]:mb-1.5 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-heading " +
  "[&_hr]:my-4 [&_hr]:border-border-4 " +
  "[&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-lg " +
  "[&_ol]:my-2.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 " +
  "[&_p]:my-0 [&_p:not(:last-child)]:mb-3.5 " +
  "[&_[data-type=mention]]:rounded-xs [&_[data-type=mention]]:bg-accent-050 [&_[data-type=mention]]:px-1.5 [&_[data-type=mention]]:py-px [&_[data-type=mention]]:font-mono [&_[data-type=mention]]:text-sm [&_[data-type=mention]]:font-semibold [&_[data-type=mention]]:text-accent-700 " +
  "[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-text-9 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]";

export const useComposerEditor = ({
  initialHtml,
  placeholder,
  ariaLabel,
  mergeTagSuggestion,
  onChange,
  onSubmitShortcut,
}: UseComposerEditorOptions): Editor | null => {
  const onChangeRef = useRef(onChange);
  const onSubmitShortcutRef = useRef(onSubmitShortcut);

  useEffect(() => {
    onChangeRef.current = onChange;
    onSubmitShortcutRef.current = onSubmitShortcut;
  }, [onChange, onSubmitShortcut]);

  const extensions = useMemo(
    () =>
      buildComposerExtensions({
        placeholder,
        mergeTagSuggestion: mergeTagSuggestion.options,
      }),
    [placeholder, mergeTagSuggestion.options],
  );

  return useEditor({
    extensions,
    immediatelyRender: false,
    content: sanitizeEmailHtml(initialHtml),
    editorProps: {
      attributes: {
        class: EDITOR_CLASS_NAME,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": ariaLabel,
      },
      handleKeyDown: (_view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          event.preventDefault();
          onSubmitShortcutRef.current();
          return true;
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const bodyHtml = editor.isEmpty ? "" : editor.getHTML();

      onChangeRef.current({
        bodyHtml,
        bodyText: htmlToPlainText(bodyHtml),
      });
    },
  });
};
