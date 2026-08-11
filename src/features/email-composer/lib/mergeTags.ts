import type { MergeTag } from "../types/emailComposer.types";

export const MERGE_TAG_TRIGGER = "{";

export const MERGE_TAGS: readonly MergeTag[] = [
  {
    id: "first_name",
    token: "{first_name}",
    label: "First name",
    note: "falls back to “there”",
  },
  {
    id: "last_name",
    token: "{last_name}",
    label: "Last name",
    note: "blank when unknown",
  },
  {
    id: "company",
    token: "{company}",
    label: "Company",
    note: "from the contact record",
  },
  {
    id: "job_title",
    token: "{job_title}",
    label: "Job title",
    note: "from the contact record",
  },
  {
    id: "sender_name",
    token: "{sender_name}",
    label: "Sender name",
    note: "the person sending",
  },
  {
    id: "meeting_link",
    token: "{meeting_link}",
    label: "Meeting link",
    note: "your booking page",
  },
  {
    id: "unsubscribe_url",
    token: "{unsubscribe_url}",
    label: "Unsubscribe link",
    note: "required on sequences",
  },
];

const MERGE_TAGS_BY_ID = new Map(MERGE_TAGS.map((tag) => [tag.id, tag]));

export const getMergeTag = (id: string): MergeTag | null =>
  MERGE_TAGS_BY_ID.get(id) ?? null;

export const filterMergeTags = (query: string): readonly MergeTag[] => {
  const needle = query.trim().toLowerCase();

  if (needle.length === 0) {
    return MERGE_TAGS;
  }

  return MERGE_TAGS.filter(
    (tag) =>
      tag.id.includes(needle) || tag.label.toLowerCase().includes(needle),
  );
};
