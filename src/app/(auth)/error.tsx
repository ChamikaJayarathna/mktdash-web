"use client";

import { AuthErrorState } from "@/widgets/auth-shell";

const AuthError = ({ reset }: { error: Error; reset: () => void }) => {
  return <AuthErrorState reset={reset} />;
};

export default AuthError;
