import { SignUpForm } from "@/features/sign-up";
import { AuthShell } from "@/widgets/auth-shell";

const SignUpPage = () => {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Set up in under two minutes."
      body="Create your account, name a workspace, connect a mailbox. Nothing sends until you say so."
    >
      <SignUpForm />
    </AuthShell>
  );
};

export default SignUpPage;
