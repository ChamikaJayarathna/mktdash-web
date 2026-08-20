export interface VerifyEmailRequest {
  readonly email: string;
  readonly code: string;
}

export type VerifyEmailFailureCode =
  | "invalid-code"
  | "code-expired"
  | "too-many-attempts"
  | "request-failed";

export type VerifyEmailOutcome =
  | { readonly status: "verified"; readonly redirectTo: string }
  | { readonly status: "failed"; readonly code: VerifyEmailFailureCode };

export interface ResendVerificationRequest {
  readonly email: string;
}

export type ResendVerificationFailureCode =
  | "rate-limited"
  | "unknown-address"
  | "request-failed";

export type ResendVerificationOutcome =
  | { readonly status: "sent"; readonly retryAfterSeconds: number }
  | {
      readonly status: "failed";
      readonly code: ResendVerificationFailureCode;
      readonly retryAfterSeconds: number;
    };
