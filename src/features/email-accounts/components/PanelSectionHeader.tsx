import type { ReactNode } from "react";

export interface PanelSectionHeaderProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly trailing: ReactNode;
}

const PanelSectionHeader = ({
  icon,
  title,
  trailing,
}: PanelSectionHeaderProps) => {
  return (
    <div className="flex items-center gap-2.5 border-b border-border-2 pb-2.5">
      <span
        aria-hidden
        className="grid size-7.5 flex-none place-items-center rounded-2xl bg-accent-050 text-accent-500"
      >
        {icon}
      </span>
      <h3 className="type-h2 text-heading">{title}</h3>
      {trailing}
    </div>
  );
};

export default PanelSectionHeader;
