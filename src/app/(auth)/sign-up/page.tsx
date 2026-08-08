import type { Metadata } from "next";
import { SignUpPage } from "@/views/sign-up";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a Follow Axis account and name your workspace — the shared sending desk for email and WhatsApp outbound.",
};

const SignUpRoute = () => {
  return <SignUpPage />;
};

export default SignUpRoute;
