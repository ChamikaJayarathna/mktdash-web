"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps,
} from "@tiptap/suggestion";
import { MERGE_TAG_TRIGGER, filterMergeTags } from "../lib/mergeTags";
import type { MergeTag } from "../types/emailComposer.types";

interface MergeTagAttrs {
  readonly id: string;
  readonly label: string;
}

type MergeTagSuggestionProps = SuggestionProps<MergeTag, MergeTagAttrs>;

export interface MergeTagSuggestionState {
  readonly isOpen: boolean;
  readonly items: readonly MergeTag[];
  readonly activeIndex: number;
  readonly anchor: { readonly top: number; readonly left: number } | null;
}

export interface MergeTagSuggestion {
  readonly options: Omit<SuggestionOptions<MergeTag, MergeTagAttrs>, "editor">;
  readonly state: MergeTagSuggestionState;
  readonly select: (index: number) => void;
  readonly setActiveIndex: (index: number) => void;
}

const CLOSED_STATE: MergeTagSuggestionState = {
  isOpen: false,
  items: [],
  activeIndex: 0,
  anchor: null,
};

const anchorFrom = (
  clientRect: MergeTagSuggestionProps["clientRect"],
): MergeTagSuggestionState["anchor"] => {
  const rect = clientRect?.();

  return rect ? { top: rect.top, left: rect.left } : null;
};

export const useMergeTagSuggestion = (): MergeTagSuggestion => {
  const [state, setState] = useState<MergeTagSuggestionState>(CLOSED_STATE);
  const propsRef = useRef<MergeTagSuggestionProps | null>(null);
  const activeIndexRef = useRef(0);
  const itemsRef = useRef<readonly MergeTag[]>([]);

  const applyIndex = useCallback((index: number) => {
    activeIndexRef.current = index;
    setState((current) => ({ ...current, activeIndex: index }));
  }, []);

  const commit = useCallback((index: number) => {
    const item = itemsRef.current[index];

    if (!item || !propsRef.current) {
      return;
    }

    propsRef.current.command({ id: item.id, label: item.label });
  }, []);

  const options = useMemo<
    Omit<SuggestionOptions<MergeTag, MergeTagAttrs>, "editor">
  >(
    () => ({
      char: MERGE_TAG_TRIGGER,
      allowSpaces: false,
      startOfLine: false,
      items: ({ query }) => [...filterMergeTags(query)],
      render: () => ({
        onStart: (props) => {
          propsRef.current = props;
          itemsRef.current = props.items;
          activeIndexRef.current = 0;
          setState({
            isOpen: props.items.length > 0,
            items: props.items,
            activeIndex: 0,
            anchor: anchorFrom(props.clientRect),
          });
        },
        onUpdate: (props) => {
          propsRef.current = props;
          itemsRef.current = props.items;
          activeIndexRef.current = Math.min(
            activeIndexRef.current,
            Math.max(props.items.length - 1, 0),
          );
          setState({
            isOpen: props.items.length > 0,
            items: props.items,
            activeIndex: activeIndexRef.current,
            anchor: anchorFrom(props.clientRect),
          });
        },
        onKeyDown: ({ event }: SuggestionKeyDownProps) => {
          const total = itemsRef.current.length;

          if (total === 0) {
            return false;
          }

          const handled = ((): boolean => {
            if (event.key === "ArrowDown") {
              applyIndex((activeIndexRef.current + 1) % total);
              return true;
            }

            if (event.key === "ArrowUp") {
              applyIndex((activeIndexRef.current + total - 1) % total);
              return true;
            }

            if (event.key === "Enter" || event.key === "Tab") {
              commit(activeIndexRef.current);
              return true;
            }

            if (event.key === "Escape") {
              setState(CLOSED_STATE);
              return true;
            }

            return false;
          })();

          if (handled) {
            event.stopPropagation();
          }

          return handled;
        },
        onExit: () => {
          propsRef.current = null;
          itemsRef.current = [];
          setState(CLOSED_STATE);
        },
      }),
    }),
    [applyIndex, commit],
  );

  return { options, state, select: commit, setActiveIndex: applyIndex };
};
