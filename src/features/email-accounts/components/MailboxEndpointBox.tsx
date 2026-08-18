export interface MailboxEndpointBoxProps {
  readonly label: string;
  readonly value: string;
}

const MailboxEndpointBox = ({ label, value }: MailboxEndpointBoxProps) => {
  return (
    <div className="min-w-0 rounded-2xl border border-border-2 bg-surface-1 px-2.75 py-2.25">
      <dt className="font-mono text-3xs font-semibold tracking-wide text-eyebrow">
        {label}
      </dt>
      <dd className="mt-0.75 truncate font-mono text-xs font-semibold text-body">
        {value}
      </dd>
    </div>
  );
};

export default MailboxEndpointBox;
