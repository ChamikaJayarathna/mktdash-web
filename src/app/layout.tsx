import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Marketing Dashboard",
    template: "%s · Marketing Dashboard",
  },
  description:
    "A shared sending desk with a memory — scheduled, attributable email and WhatsApp outbound for teams.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
