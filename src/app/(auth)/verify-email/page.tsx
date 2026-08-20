import type { Metadata } from "next";
import { VerifyEmailPage } from "@/views/verify-email";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Enter the six-digit code we sent you to confirm your address and finish setting up your Follow Axis workspace.",
  robots: { index: false, follow: false },
};

interface VerifyEmailRouteProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const VerifyEmailRoute = async ({ searchParams }: VerifyEmailRouteProps) => {
  const { email } = await searchParams;
  const address = Array.isArray(email) ? email[0] : email;

  return <VerifyEmailPage email={address ?? null} />;
};

export default VerifyEmailRoute;
