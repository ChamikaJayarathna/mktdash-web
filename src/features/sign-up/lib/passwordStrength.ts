import type { PasswordStrength } from "../types/signUp.types";

export const MIN_PASSWORD_LENGTH = 8;
export const RECOMMENDED_PASSWORD_LENGTH = 12;
export const STRONG_PASSWORD_LENGTH = 16;

// TODO: Use Have I Been Pwned (HIBP) Pwned Passwords(Setup the Backend)
const KNOWN_BREACHED_PASSWORDS: ReadonlySet<string> = new Set([
  "password",
  "password123",
  "12345678",
  "qwertyuiop",
  "letmein123",
  "welcome123",
  "follow axis",
]);

export const isBreachedPassword = (password: string): boolean => {
  return KNOWN_BREACHED_PASSWORDS.has((password ?? "").trim().toLowerCase());
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  const length = password?.length ?? 0;

  if (length === 0) {
    return {
      score: 0,
      label: `Use at least ${RECOMMENDED_PASSWORD_LENGTH} characters`,
      tone: "neutral",
      isAcceptable: false,
      isBreached: false,
    };
  }

  if (isBreachedPassword(password)) {
    return {
      score: 1,
      label: "Found in breach lists",
      tone: "danger",
      isAcceptable: false,
      isBreached: true,
    };
  }

  if (length < MIN_PASSWORD_LENGTH) {
    return {
      score: 1,
      label: "Too short",
      tone: "danger",
      isAcceptable: false,
      isBreached: false,
    };
  }

  if (length < RECOMMENDED_PASSWORD_LENGTH) {
    return {
      score: 2,
      label: `Weak — aim for ${RECOMMENDED_PASSWORD_LENGTH} or more`,
      tone: "warning",
      isAcceptable: true,
      isBreached: false,
    };
  }

  if (length < STRONG_PASSWORD_LENGTH) {
    return {
      score: 3,
      label: "Good",
      tone: "success",
      isAcceptable: true,
      isBreached: false,
    };
  }

  return {
    score: 4,
    label: "Strong",
    tone: "success",
    isAcceptable: true,
    isBreached: false,
  };
};
