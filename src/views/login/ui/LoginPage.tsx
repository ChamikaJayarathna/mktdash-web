import Link from "next/link";
import { Lock } from "lucide-react";
import { SignInForm } from "@/features/sign-in";
import { AuthShell } from "@/widgets/auth-shell";

const LoginPage = () => {
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Every outbound touch, attributable."
      body="Email and WhatsApp in one shared inbox, with follow-up that stops the moment someone replies."
    >
      <h1 className="type-title text-heading">Sign in</h1>
      <p className="mt-1.75 text-md leading-normal font-medium text-text-6">
        Use the email address your workspace was set up with.
      </p>

      <div className="mt-6.5">
        <SignInForm />
      </div>

      <p className="mt-6 border-t border-border-2 pt-4.5 text-base leading-normal font-medium text-text-6">
        New to Follow Axis?{" "}
        <Link
          href="/sign-up"
          className="font-bold text-link hover:text-link-hover"
        >
          Create an account
        </Link>
      </p>

      <p className="mt-3 flex items-start gap-2 text-xs leading-normal font-medium text-text-8">
        <Lock
          aria-hidden
          className="mt-0.5 size-3.25 flex-none"
          strokeWidth={1.9}
        />
        <span>
          Were you invited by a colleague? Open the link in your invitation
          email instead — it carries your role.
        </span>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
