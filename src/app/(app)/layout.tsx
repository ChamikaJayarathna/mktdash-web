import type { ReactNode } from "react";
import ThemeProvider from "@/app/providers/ThemeProvider";
import { Toaster } from "@/shared/ui/sonner";

const AppLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="bottom-center" closeButton />
    </ThemeProvider>
  );
};

export default AppLayout;
