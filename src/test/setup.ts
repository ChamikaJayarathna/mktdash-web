import { afterAll, afterEach, beforeAll, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { server } from "./handlers/server";

expect.extend(toHaveNoViolations);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });

  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }

  const globalWithObserver = globalThis as typeof globalThis & {
    IntersectionObserver?: typeof IntersectionObserver;
  };

  if (!globalWithObserver.IntersectionObserver) {
    class NoopIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly scrollMargin = "";
      readonly thresholds: readonly number[] = [];
      observe = () => {};
      unobserve = () => {};
      disconnect = () => {};
      takeRecords = (): IntersectionObserverEntry[] => [];
    }

    globalWithObserver.IntersectionObserver = NoopIntersectionObserver;
  }

  if (!Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => new DOMRect();
  }

  if (!Range.prototype.getClientRects) {
    Range.prototype.getClientRects = () =>
      Object.assign([], {
        item: () => null,
      }) as unknown as DOMRectList;
  }
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
