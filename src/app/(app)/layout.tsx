import type { ReactNode } from "react";
import ThemeProvider from "@/app/providers/ThemeProvider";

const AppLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default AppLayout;
