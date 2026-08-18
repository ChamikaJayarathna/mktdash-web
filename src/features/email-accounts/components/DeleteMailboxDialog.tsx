"use client";

import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RECOVERY_WINDOW_DAYS } from "../api/emailAccountsService";
import {
  buildDeleteMailboxSchema,
  type DeleteMailboxValues,
} from "../schemas/deleteMailbox.schema";
import type { Mailbox } from "../types/emailAccount.types";

export interface DeleteMailboxDialogProps {
  readonly mailbox: Mailbox | null;
  readonly isDeleting: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (mailbox: Mailbox) => void;
}

const DeleteMailboxDialog = ({
  mailbox,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteMailboxDialogProps) => {
  const confirmationId = useId();
  const errorId = `${confirmationId}-error`;
  const address = mailbox?.address ?? "";

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<DeleteMailboxValues>({
    resolver: zodResolver(buildDeleteMailboxSchema(address)),
    mode: "onChange",
    defaultValues: { confirmation: "" },
  });

  useEffect(() => {
    reset({ confirmation: "" });
  }, [address, reset]);

  const onSubmit = handleSubmit(() => {
    if (mailbox) {
      onConfirm(mailbox);
    }
  });

  return (
    <Dialog open={mailbox !== null} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Disconnect {address}?</DialogTitle>
          <DialogDescription>
            Syncing stops immediately and every scheduled send queued on this
            mailbox is cancelled. The mailbox and its history stay recoverable
            for {RECOVERY_WINDOW_DAYS} days.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2.5 rounded-2xl border border-warning-100 bg-warning-050 px-card py-2.5">
          <TriangleAlert
            aria-hidden
            className="mt-px size-3.5 flex-none text-warning-700"
            strokeWidth={1.8}
          />
          <p className="text-sm leading-normal text-warning-700">
            Anyone granted this mailbox loses it as a sending identity until it
            is reconnected.
          </p>
        </div>

        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-1.5">
          <Label htmlFor={confirmationId}>
            Type <span className="font-mono">{address}</span> to confirm
          </Label>
          <Input
            {...register("confirmation")}
            id={confirmationId}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="font-mono"
            aria-invalid={errors.confirmation ? true : undefined}
            aria-describedby={errors.confirmation ? errorId : undefined}
          />
          {errors.confirmation ? (
            <p id={errorId} role="alert" className="text-sm text-danger-600">
              {errors.confirmation.message}
            </p>
          ) : null}

          <DialogFooter className="mt-3.75">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Keep mailbox
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isValid || isDeleting}
            >
              {isDeleting ? "Disconnecting…" : "Disconnect mailbox"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMailboxDialog;
