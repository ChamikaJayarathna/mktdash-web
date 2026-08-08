export interface SignInCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

export type SignInFailureCode = "invalid-credentials" | "not-configured";

export type SignInOutcome =
  | { readonly status: "signed-in"; readonly redirectTo: string }
  | { readonly status: "failed"; readonly code: SignInFailureCode };
