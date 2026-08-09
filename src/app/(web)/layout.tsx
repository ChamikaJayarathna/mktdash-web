import type { ReactNode } from "react";
import ThemeProvider from "@/app/providers/ThemeProvider";

const WebLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <ThemeProvider forcedTheme="light">
      <div className="min-h-dvh bg-canvas">{children}</div>
    </ThemeProvider>
  );
};

export default WebLayout;
