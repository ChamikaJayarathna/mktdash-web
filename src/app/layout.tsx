import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
