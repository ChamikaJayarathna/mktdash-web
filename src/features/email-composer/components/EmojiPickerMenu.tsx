"use client";

import { useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { EmojiStyle, Theme, type EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

const PICKER_HEIGHT = 340;
const PICKER_WIDTH = 300;

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-label="Loading emoji"
      className="h-85 w-75 animate-pulse rounded-2xl bg-surface-5"
    />
  ),
});

const PICKER_TOKEN_STYLE = {
  "--epr-bg-color": "var(--surface-0)",
  "--epr-text-color": "var(--text-3)",
  "--epr-picker-border-color": "var(--border-6)",
  "--epr-picker-border-radius": "var(--radius-3xl)",
  "--epr-search-input-bg-color": "var(--surface-3)",
  "--epr-search-input-bg-color-active": "var(--surface-0)",
  "--epr-search-input-text-color": "var(--text-3)",
  "--epr-search-input-placeholder-color": "var(--text-9)",
  "--epr-search-border-color": "var(--accent-500)",
  "--epr-search-input-border-color": "var(--border-5)",
  "--epr-hover-bg-color": "var(--surface-2)",
  "--epr-focus-bg-color": "var(--accent-075)",
  "--epr-highlight-color": "var(--accent-500)",
  "--epr-category-label-bg-color": "var(--surface-0)",
  "--epr-category-label-text-color": "var(--text-7)",
  "--epr-category-icon-active-color": "var(--accent-500)",
  "--epr-category-icon-color": "var(--text-7)",
  "--epr-preview-text-color": "var(--text-7)",
  "--epr-preview-border-color": "var(--border-2)",
  "--epr-emoji-size": "22px",
} as CSSProperties;

export interface EmojiPickerMenuProps {
  readonly onSelect: (emoji: string) => void;
}

const EmojiPickerMenu = ({ onSelect }: EmojiPickerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData): void => {
    onSelect(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Insert emoji"
            title="Insert emoji"
          />
        }
      >
        <Smile aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-auto overflow-hidden border-0 p-0"
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          emojiStyle={EmojiStyle.NATIVE}
          theme={Theme.LIGHT}
          style={PICKER_TOKEN_STYLE}
          height={PICKER_HEIGHT}
          width={PICKER_WIDTH}
          searchPlaceholder="Search emoji"
          previewConfig={{ showPreview: false }}
          skinTonesDisabled
          lazyLoadEmojis={false}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmojiPickerMenu;
