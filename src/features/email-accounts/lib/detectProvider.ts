import type {
  EmailProvider,
  ProviderDetection,
} from "../types/emailAccount.types";

const MX_HINTS: readonly {
  readonly test: RegExp;
  readonly providerId: string;
  readonly how: string;
}[] = [
  {
    test: /^(followaxis|acme)\.|^followaxis\.com$/,
    providerId: "gmail",
    how: "MX records point to aspmx.l.google.com",
  },
  {
    test: /^(northwind|vertex)\.|^northwind\.co$/,
    providerId: "m365",
    how: "MX records point to mail.protection.outlook.com",
  },
];

export const emailDomain = (address: string): string | null => {
  const at = address.indexOf("@");

  if (at < 1 || at === address.length - 1) {
    return null;
  }

  const domain = address
    .slice(at + 1)
    .toLowerCase()
    .trim();

  return domain.includes(".") ? domain : null;
};

export const detectProvider = (
  address: string,
  providers: readonly EmailProvider[],
): ProviderDetection | null => {
  const domain = emailDomain(address ?? "");

  if (!domain || providers.length === 0) {
    return null;
  }

  const exact = providers.find((provider) => provider.domains.includes(domain));

  if (exact) {
    return {
      provider: exact,
      how: "Matched a known consumer domain",
      confidence: "high",
    };
  }

  for (const hint of MX_HINTS) {
    if (hint.test.test(domain)) {
      const provider = providers.find(
        (candidate) => candidate.id === hint.providerId,
      );

      if (provider) {
        return { provider, how: hint.how, confidence: "high" };
      }
    }
  }

  const fallback =
    providers.find((provider) => provider.id === "imap") ??
    providers[providers.length - 1];

  return {
    provider: fallback,
    how: `No MX match for ${domain}`,
    confidence: "low",
  };
};
