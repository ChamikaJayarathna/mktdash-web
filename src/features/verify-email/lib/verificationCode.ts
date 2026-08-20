export const VERIFICATION_CODE_LENGTH = 6;

export const RESEND_COOLDOWN_SECONDS = 60;

export const MAX_VERIFICATION_ATTEMPTS = 5;

export const sanitiseVerificationCode = (raw: string): string =>
  raw.replace(/\D/gu, "").slice(0, VERIFICATION_CODE_LENGTH);

export const isCompleteVerificationCode = (code: string): boolean =>
  sanitiseVerificationCode(code).length === VERIFICATION_CODE_LENGTH;

export const toVerificationCodeSlots = (code: string): readonly string[] => {
  const digits = sanitiseVerificationCode(code);

  return Array.from(
    { length: VERIFICATION_CODE_LENGTH },
    (_, index) => digits[index] ?? "",
  );
};

export const formatCooldown = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.trunc(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

export const isLikelyEmailAddress = (value: string): boolean => {
  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed.length > 254 || /\s/u.test(trimmed)) {
    return false;
  }

  return /^[^@]+@[^@.]+(\.[^@.]+)+$/u.test(trimmed);
};
