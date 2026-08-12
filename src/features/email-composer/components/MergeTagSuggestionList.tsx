"use client";

import { cn } from "@/shared/lib/utils";
import type { MergeTagSuggestion } from "../hooks/useMergeTagSuggestion";

export interface MergeTagSuggestionListProps {
  readonly suggestion: MergeTagSuggestion;
}

const OFFSET_Y = 22;

const MergeTagSuggestionList = ({
  suggestion,
}: MergeTagSuggestionListProps) => {
  const { state, select, setActiveIndex } = suggestion;

  if (!state.isOpen || !state.anchor) {
    return null;
  }

  return (
    <ul
      role="listbox"
      aria-label="Merge tags"
      className="fixed z-50 max-h-64 w-64 animate-fa-pop overflow-y-auto rounded-3xl border border-border-6 bg-popover p-1 shadow-popover"
      style={{ top: state.anchor.top + OFFSET_Y, left: state.anchor.left }}
    >
      {state.items.map((tag, index) => (
        <li
          key={tag.id}
          role="option"
          aria-selected={index === state.activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseDown={(event) => {
            event.preventDefault();
            select(index);
          }}
          className={cn(
            "flex cursor-pointer items-baseline gap-2 rounded-lg px-2.5 py-1.5",
            index === state.activeIndex && "bg-row-hover",
          )}
        >
          <span className="font-mono text-sm font-semibold text-accent-700">
            {tag.token}
          </span>
          <span className="ml-auto truncate text-xs font-medium text-eyebrow">
            {tag.note}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default MergeTagSuggestionList;
