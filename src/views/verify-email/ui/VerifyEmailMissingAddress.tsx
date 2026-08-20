import Link from "next/link";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

const VerifyEmailMissingAddress = () => {
  return (
    <div className="mt-6 rounded-4xl border border-border-2 bg-surface-1 px-panel py-3.5">
      <p className="type-eyebrow text-text-8">Nothing to verify</p>
      <p className="mt-2.25 text-base leading-normal font-medium text-text-6">
        We do not know which address to confirm. Open the link from your
        confirmation email, or create your account again — nothing was sent
        until an address was recorded.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "solid" }), "rounded-2xl")}
        >
          Create your account
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "ghost" }), "rounded-2xl")}
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailMissingAddress;
