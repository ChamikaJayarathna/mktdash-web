let fallbackCounter = 0;

export const createId = (prefix: string): string => {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return `${prefix}_${cryptoApi.randomUUID()}`;
  }

  fallbackCounter += 1;

  return `${prefix}_${Date.now().toString(36)}${fallbackCounter.toString(36)}`;
};
