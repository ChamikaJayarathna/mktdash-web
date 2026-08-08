import Link from "next/link";
import AuthSequencePreview from "./AuthSequencePreview";

export interface AuthBrandPanelProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
}

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/status", label: "Status" },
] as const;

const AuthBrandPanel = ({ eyebrow, title, body }: AuthBrandPanelProps) => {
  return (
    <aside className="relative flex flex-none flex-col overflow-hidden bg-rail px-11 py-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:grid lg:grid-rows-subgrid lg:py-0">
      <div className="flex flex-none items-center gap-2.75 lg:row-start-1 lg:self-start lg:pt-9.5">
        <span
          aria-hidden
          className="flex size-control items-center justify-center rounded-3xl bg-brand-gradient text-sm font-extrabold text-white"
        >
          FA
        </span>
        <span className="font-heading text-xl leading-flat font-extrabold tracking-tight text-white">
          Follow Axis
        </span>
      </div>

      <div className="hidden flex-col lg:row-start-2 lg:flex lg:self-start lg:py-6">
        <p className="type-eyebrow tracking-widest text-on-dark-eyebrow">
          {eyebrow}
        </p>
        <p className="mt-3.5 max-w-[9.5em] type-hero text-white">{title}</p>
        <p className="mt-3.5 max-w-[26em] text-md leading-loose text-on-dark-body">
          {body}
        </p>
        <div className="mt-8">
          <AuthSequencePreview />
        </div>
      </div>

      <div className="mt-6 hidden flex-none flex-wrap items-center gap-4 text-sm font-medium text-on-dark-muted lg:row-start-3 lg:mt-0 lg:flex lg:self-end lg:pb-9.5">
        <span>&copy; {new Date().getFullYear()} Follow Axis</span>
        {LEGAL_LINKS?.map((link) => (
          <Link
            key={link?.href}
            href={link?.href}
            className="text-on-dark-muted hover:text-on-dark-body"
          >
            {link?.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default AuthBrandPanel;
