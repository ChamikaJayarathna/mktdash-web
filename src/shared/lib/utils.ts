import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "row",
        "stack",
        "card",
        "panel",
        "gutter",
        "rail",
        "context-panel",
        "inspector",
        "list-pane",
        "control",
        "control-sm",
        "nav-row",
        "auth-panel-min",
        "auth-panel-max",
        "auth-column",
      ],
      text: ["3xs", "2xs", "md", "title", "hero"],
      radius: ["pill"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
