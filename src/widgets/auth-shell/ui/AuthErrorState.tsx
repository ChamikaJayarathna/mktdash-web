"use client";

import { Button } from "@/shared/ui/button";
import AuthShell from "./AuthShell";

export interface AuthErrorStateProps {
  readonly reset: () => void;
}

const AuthErrorState = ({ reset }: AuthErrorStateProps) => {
  return (
    <AuthShell
      eyebrow="Something went wrong"
      title="This screen did not load."
      body="Nothing was signed in, sent or changed. Try again — the rest of Follow Axis is unaffected."
    >
      <h1 className="type-title text-heading">Something went wrong</h1>
      <p className="mt-1.75 text-md leading-normal font-medium text-text-6">
        This screen failed to load. Nothing was signed in or changed, so it is
        safe to try again.
      </p>
      <Button
        type="button"
        onClick={reset}
        className="mt-6.5 h-11 w-full rounded-3xl text-md"
      >
        Try again
      </Button>
    </AuthShell>
  );
};

export default AuthErrorState;
