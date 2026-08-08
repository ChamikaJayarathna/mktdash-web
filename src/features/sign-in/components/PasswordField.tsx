"use client";

import type { ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

export interface PasswordFieldProps extends Omit<
  ComponentProps<"input">,
  "type"
> {
  readonly isVisible: boolean;
  readonly onVisibilityToggle: () => void;
}

const PasswordField = ({
  isVisible,
  onVisibilityToggle,
  className,
  ...inputProps
}: PasswordFieldProps) => {
  return (
    <div className="relative">
      <Input
        {...inputProps}
        type={isVisible ? "text" : "password"}
        className={cn("h-10.5 rounded-2xl pr-10.5 text-md", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        onClick={onVisibilityToggle}
        className="absolute top-1/2 right-1.75 -translate-y-1/2 text-text-7"
      >
        {isVisible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordField;
