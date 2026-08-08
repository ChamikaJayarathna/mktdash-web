import type { SignInCredentials, SignInOutcome } from "../types/signIn.types";

export const signIn = async (
  credentials: SignInCredentials,
): Promise<SignInOutcome> => {
  if (!credentials.email || !credentials.password) {
    return { status: "failed", code: "invalid-credentials" };
  }

  return { status: "failed", code: "not-configured" };
};
