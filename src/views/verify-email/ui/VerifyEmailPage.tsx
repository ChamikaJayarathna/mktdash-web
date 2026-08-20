import { Mail } from "lucide-react";
import {
  VerifyEmailForm,
  VERIFICATION_CODE_LENGTH,
  isLikelyEmailAddress,
} from "@/features/verify-email";
import { AuthShell } from "@/widgets/auth-shell";
import VerifyEmailMissingAddress from "./VerifyEmailMissingAddress";

export interface VerifyEmailPageProps {
  readonly email: string | null;
}

const VerifyEmailPage = ({ email }: VerifyEmailPageProps) => {
  const address = email && isLikelyEmailAddress(email) ? email.trim() : null;

  return (
    <AuthShell
      eyebrow="Almost there"
      title="One code from your inbox."
      body="Confirming your address is what lets us send on your behalf later."
    >
      <div className="mb-5 flex size-13 items-center justify-center rounded-5xl bg-accent-050">
        <Mail
          aria-hidden
          className="size-6 text-accent-500"
          strokeWidth={1.8}
        />
      </div>

      <h1 className="type-title text-heading">Check your email</h1>

      {address ? (
        <>
          <p className="mt-2.25 text-md leading-normal font-medium text-text-6">
            We have sent a {VERIFICATION_CODE_LENGTH}-digit verification code to{" "}
            <span className="font-mono text-base font-semibold text-heading">
              {address}
            </span>
            . Enter it below and confirm your email to finish setting up your
            workspace — the code is good for 15 minutes.
          </p>

          <VerifyEmailForm email={address} />
        </>
      ) : (
        <>
          <p className="mt-2.25 text-md leading-normal font-medium text-text-6">
            Verification codes are tied to the address you signed up with.
          </p>

          <VerifyEmailMissingAddress />
        </>
      )}
    </AuthShell>
  );
};

export default VerifyEmailPage;
