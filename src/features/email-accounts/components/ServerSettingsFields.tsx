import { useId } from "react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { EmailProvider } from "../types/emailAccount.types";

export interface ServerSettingsFieldsProps {
  readonly provider: EmailProvider;
}

const ServerSettingsFields = ({ provider }: ServerSettingsFieldsProps) => {
  const imapHostId = useId();
  const imapPortId = useId();
  const smtpHostId = useId();
  const smtpPortId = useId();

  return (
    <div className="grid grid-cols-[1fr_96px] gap-2.75">
      <div className="flex flex-col gap-1.25">
        <Label htmlFor={imapHostId}>IMAP host</Label>
        <Input
          id={imapHostId}
          readOnly
          value={provider.imapHost}
          className="truncate font-mono"
        />
      </div>
      <div className="flex flex-col gap-1.25">
        <Label htmlFor={imapPortId}>Port</Label>
        <Input
          id={imapPortId}
          readOnly
          value={provider.imapPort}
          className="font-mono"
        />
      </div>
      <div className="flex flex-col gap-1.25">
        <Label htmlFor={smtpHostId}>SMTP host</Label>
        <Input
          id={smtpHostId}
          readOnly
          value={provider.smtpHost}
          className="truncate font-mono"
        />
      </div>
      <div className="flex flex-col gap-1.25">
        <Label htmlFor={smtpPortId}>Port</Label>
        <Input
          id={smtpPortId}
          readOnly
          value={provider.smtpPort}
          className="font-mono"
        />
      </div>
    </div>
  );
};

export default ServerSettingsFields;
