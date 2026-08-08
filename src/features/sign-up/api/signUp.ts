import { isBreachedPassword } from "../lib/passwordStrength";
import type { SignUpDetails, SignUpOutcome } from "../types/signUp.types";

export const signUp = async (
  details: SignUpDetails,
): Promise<SignUpOutcome> => {
  if (isBreachedPassword(details.password)) {
    return { status: "failed", code: "password-breached" };
  }

  return { status: "failed", code: "not-configured" };
};
