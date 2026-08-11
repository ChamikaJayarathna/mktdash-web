"use client";

import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  ChevronDown,
  Eraser,
  Indent,
  List,
  ListOrdered,
  type LucideIcon,
  Minus,
  Outdent,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  FONT_FAMILIES,
  FONT_SIZES,
  TEXT_COLOURS,
} from "../lib/composerExtensions";
import { clearFormatting, insertMergeTag } from "../lib/editorCommands";
import { MERGE_TAGS } from "../lib/mergeTags";
import ToolbarButton from "./ToolbarButton";

export interface ComposerToolbarProps {
  readonly editor: Editor;
}

type AlignmentValue = "left" | "center" | "right" | "justify";

const ALIGNMENTS: readonly {
  value: AlignmentValue;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "left", label: "Left", icon: AlignLeft },
  { value: "center", label: "Centre", icon: AlignCenter },
  { value: "right", label: "Right", icon: AlignRight },
  { value: "justify", label: "Justify", icon: AlignJustify },
];

const PARAGRAPH_STYLES: readonly {
  id: string;
  label: string;
  level: 1 | 2 | 3 | null;
}[] = [
  { id: "body", label: "Body", level: null },
  { id: "h1", label: "Heading 1", level: 1 },
  { id: "h2", label: "Heading 2", level: 2 },
  { id: "h3", label: "Heading 3", level: 3 },
];

const TRIGGER_CLASSNAME =
  "inline-flex h-control-sm flex-none items-center gap-1.25 rounded-lg px-2 text-sm font-bold text-text-4 transition-colors duration-(--dur-hover) ease-out outline-none hover:bg-surface-5 hover:text-text-3 focus-visible:ring-2 focus-visible:ring-ring/50 aria-expanded:bg-surface-5";

const ToolbarDivider = () => (
  <span aria-hidden className="mx-1 h-5 w-px flex-none bg-border-6" />
);

interface ToolbarIconButtonProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly shortcut?: string;
  readonly isActive?: boolean;
  readonly isDisabled?: boolean;
  readonly onClick: () => void;
}

const ToolbarIconButton = ({
  icon: Icon,
  label,
  shortcut,
  isActive,
  isDisabled,
  onClick,
}: ToolbarIconButtonProps) => (
  <ToolbarButton
    label={label}
    shortcut={shortcut}
    isActive={isActive}
    isDisabled={isDisabled}
    onClick={onClick}
    className="w-control-sm px-0"
  >
    <Icon aria-hidden className="size-3.75" strokeWidth={1.9} />
  </ToolbarButton>
);

interface ToolbarGlyphButtonProps {
  readonly label: string;
  readonly shortcut?: string;
  readonly glyph: string;
  readonly glyphClassName: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

const ToolbarGlyphButton = ({
  label,
  shortcut,
  glyph,
  glyphClassName,
  isActive,
  onClick,
}: ToolbarGlyphButtonProps) => (
  <ToolbarButton
    label={label}
    shortcut={shortcut}
    isActive={isActive}
    onClick={onClick}
    className="w-control-sm px-0"
  >
    <span aria-hidden className={cn("font-serif text-md", glyphClassName)}>
      {glyph}
    </span>
  </ToolbarButton>
);

const ComposerToolbar = ({ editor }: ComposerToolbarProps) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
      isBold: current.isActive("bold"),
      isItalic: current.isActive("italic"),
      isUnderline: current.isActive("underline"),
      isStrike: current.isActive("strike"),
      isBulletList: current.isActive("bulletList"),
      isOrderedList: current.isActive("orderedList"),
      isBlockquote: current.isActive("blockquote"),
      canSink: current.can().sinkListItem("listItem"),
      canLift: current.can().liftListItem("listItem"),
      headingLevel: ([1, 2, 3] as const).find((level) =>
        current.isActive("heading", { level }),
      ),
      alignment: ALIGNMENTS.find(({ value }) =>
        current.isActive({ textAlign: value }),
      )?.value,
      fontFamily: current.getAttributes("textStyle").fontFamily as
        | string
        | undefined,
      fontSize: current.getAttributes("textStyle").fontSize as
        | string
        | undefined,
      colour: current.getAttributes("textStyle").color as string | undefined,
    }),
  });

  const activeParagraphStyle =
    PARAGRAPH_STYLES.find((style) => style.level === state.headingLevel) ??
    PARAGRAPH_STYLES[0];
  const activeFont =
    FONT_FAMILIES.find((font) => font.value === state.fontFamily) ??
    FONT_FAMILIES[0];
  const activeSize =
    FONT_SIZES.find((size) => size.value === state.fontSize) ?? FONT_SIZES[1];
  const ActiveAlignmentIcon =
    ALIGNMENTS.find(({ value }) => value === state.alignment)?.icon ??
    AlignLeft;

  const setParagraphStyle = (level: 1 | 2 | 3 | null): void => {
    if (level === null) {
      editor.chain().focus().setParagraph().run();
      return;
    }

    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      aria-orientation="horizontal"
      className="mx-panel my-2.5 flex flex-none flex-wrap items-center gap-0.5 rounded-4xl bg-surface-7 px-2 py-1"
    >
      <ToolbarIconButton
        icon={Undo2}
        label="Undo"
        shortcut="⌘Z"
        isDisabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarIconButton
        icon={Redo2}
        label="Redo"
        shortcut="⌘⇧Z"
        isDisabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      />

      <ToolbarDivider />

      <DropdownMenu>
        <DropdownMenuTrigger
          className={TRIGGER_CLASSNAME}
          aria-label={`Font — ${activeFont.label}`}
        >
          {activeFont.label}
          <ChevronDown aria-hidden className="size-3 text-meta" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="w-44">
          {FONT_FAMILIES.map((font) => (
            <DropdownMenuItem
              key={font.value}
              onClick={() =>
                editor.chain().focus().setFontFamily(font.value).run()
              }
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={TRIGGER_CLASSNAME}
          aria-label={`Text size — ${activeSize.label}`}
        >
          {activeSize.label}
          <ChevronDown aria-hidden className="size-3 text-meta" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="w-36">
          {FONT_SIZES.map((size) => (
            <DropdownMenuItem
              key={size.value}
              onClick={() =>
                editor.chain().focus().setFontSize(size.value).run()
              }
            >
              {size.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={TRIGGER_CLASSNAME}
          aria-label={`Paragraph style — ${activeParagraphStyle.label}`}
        >
          {activeParagraphStyle.label}
          <ChevronDown aria-hidden className="size-3 text-meta" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="w-40">
          {PARAGRAPH_STYLES.map((style) => (
            <DropdownMenuItem
              key={style.id}
              onClick={() => setParagraphStyle(style.level)}
            >
              {style.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolbarDivider />

      <ToolbarGlyphButton
        label="Bold"
        shortcut="⌘B"
        glyph="B"
        glyphClassName="font-extrabold"
        isActive={state.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarGlyphButton
        label="Italic"
        shortcut="⌘I"
        glyph="I"
        glyphClassName="italic"
        isActive={state.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarGlyphButton
        label="Underline"
        shortcut="⌘U"
        glyph="U"
        glyphClassName="underline"
        isActive={state.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarGlyphButton
        label="Strikethrough"
        glyph="S"
        glyphClassName="line-through"
        isActive={state.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          className={TRIGGER_CLASSNAME}
          aria-label="Text colour"
        >
          <Baseline aria-hidden className="size-3.75" strokeWidth={1.9} />
          <span
            aria-hidden
            className="h-1 w-3 rounded-xs"
            style={{ background: state.colour ?? "var(--text-3)" }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="w-auto p-2"
        >
          <div className="grid grid-cols-4 gap-1.5">
            {TEXT_COLOURS.map((colour) => (
              <button
                key={colour.value}
                type="button"
                aria-label={colour.label}
                onClick={() =>
                  editor.chain().focus().setColor(colour.value).run()
                }
                className="size-6 rounded-lg ring-1 ring-border-4 transition-shadow duration-(--dur-hover) ease-out hover:ring-2 hover:ring-accent-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                style={{ background: colour.value }}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolbarDivider />

      <DropdownMenu>
        <DropdownMenuTrigger
          className={TRIGGER_CLASSNAME}
          aria-label="Text alignment"
        >
          <ActiveAlignmentIcon
            aria-hidden
            className="size-3.75"
            strokeWidth={1.9}
          />
          <ChevronDown aria-hidden className="size-3 text-meta" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="w-36">
          {ALIGNMENTS.map((alignment) => (
            <DropdownMenuItem
              key={alignment.value}
              onClick={() =>
                editor.chain().focus().setTextAlign(alignment.value).run()
              }
            >
              <alignment.icon aria-hidden className="size-3.5" />
              {alignment.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolbarIconButton
        icon={ListOrdered}
        label="Numbered list"
        isActive={state.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarIconButton
        icon={List}
        label="Bulleted list"
        isActive={state.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarIconButton
        icon={Outdent}
        label="Decrease indent"
        isDisabled={!state.canLift}
        onClick={() => editor.chain().focus().liftListItem("listItem").run()}
      />
      <ToolbarIconButton
        icon={Indent}
        label="Increase indent"
        isDisabled={!state.canSink}
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
      />

      <ToolbarDivider />

      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex h-control-sm flex-none items-center rounded-lg bg-accent-100 px-2 font-mono text-sm font-bold text-accent-700 transition-colors duration-(--dur-hover) ease-out outline-none hover:bg-accent-150 focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="Insert merge tag"
        >
          {"{ }"}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="w-68">
          {/* Base UI requires a group label to sit inside its group. */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="type-eyebrow text-eyebrow">
              Merge tags
            </DropdownMenuLabel>
            {MERGE_TAGS.map((tag) => (
              <DropdownMenuItem
                key={tag.id}
                onClick={() => insertMergeTag(editor, tag)}
              >
                <span className="font-mono text-sm font-semibold text-accent-700">
                  {tag.token}
                </span>
                <span className="ml-auto text-xs text-eyebrow">{tag.note}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-0.5">
        <ToolbarIconButton
          icon={Quote}
          label="Block quote"
          isActive={state.isBlockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarIconButton
          icon={Minus}
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
        <ToolbarIconButton
          icon={Eraser}
          label="Clear formatting"
          onClick={() => clearFormatting(editor)}
        />
      </div>
    </div>
  );
};

export default ComposerToolbar;
