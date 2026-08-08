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
    <aside className="relative flex flex-none flex-col overflow-hidden bg-rail px-11 py-6 lg:basis-[44%] lg:px-11 lg:py-9.5 lg:min-w-auth-panel-min lg:max-w-auth-panel-max">
      <div className="flex flex-none items-center gap-2.75">
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

      <div className="hidden min-h-0 flex-1 flex-col justify-center py-6 lg:flex">
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

      <div className="mt-6 hidden flex-none flex-wrap items-center gap-4 text-sm font-medium text-on-dark-muted lg:mt-0 lg:flex">
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
