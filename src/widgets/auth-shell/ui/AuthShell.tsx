import type { ReactNode } from "react";
import AuthBrandPanel from "./AuthBrandPanel";

export interface AuthShellProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly children: ReactNode;
}

const AuthShell = ({ eyebrow, title, body, children }: AuthShellProps) => {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:flex-row lg:overflow-hidden">
      <AuthBrandPanel eyebrow={eyebrow} title={title} body={body} />
      <main className="flex flex-1 flex-col bg-card px-gutter py-10 lg:min-w-0 lg:overflow-y-auto">
        <div className="m-auto w-full max-w-auth-column animate-fa-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthShell;
