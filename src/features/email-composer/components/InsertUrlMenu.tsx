"use client";

import { useId, useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export interface InsertUrlMenuProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly urlLabel: string;
  readonly urlPlaceholder: string;
  readonly secondaryLabel?: string;
  readonly secondaryPlaceholder?: string;
  readonly submitLabel: string;
  readonly onSubmit: (url: string, secondary: string) => void;
}

const InsertUrlMenu = ({
  icon: Icon,
  label,
  urlLabel,
  urlPlaceholder,
  secondaryLabel,
  secondaryPlaceholder,
  submitLabel,
  onSubmit,
}: InsertUrlMenuProps) => {
  const urlId = useId();
  const secondaryId = `${urlId}-secondary`;
  const [url, setUrl] = useState("");
  const [secondary, setSecondary] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (url.trim().length === 0) {
      return;
    }

    onSubmit(url, secondary);
    setUrl("");
    setSecondary("");
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            title={label}
          />
        }
      >
        <Icon aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-72 p-2"
      >
        <DropdownMenuLabel className="type-eyebrow text-eyebrow">
          {label}
        </DropdownMenuLabel>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-1 pb-1">
          <div className="flex flex-col gap-1">
            <Label htmlFor={urlId} className="text-xs">
              {urlLabel}
            </Label>
            <Input
              id={urlId}
              type="url"
              value={url}
              autoFocus
              placeholder={urlPlaceholder}
              onChange={(event) => setUrl(event.target.value)}
              className="h-control-sm text-sm"
            />
          </div>

          {secondaryLabel ? (
            <div className="flex flex-col gap-1">
              <Label htmlFor={secondaryId} className="text-xs">
                {secondaryLabel}
              </Label>
              <Input
                id={secondaryId}
                type="text"
                value={secondary}
                placeholder={secondaryPlaceholder}
                onChange={(event) => setSecondary(event.target.value)}
                className="h-control-sm text-sm"
              />
            </div>
          ) : null}

          <Button type="submit" size="sm" className="self-start">
            {submitLabel}
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InsertUrlMenu;
