import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "@/app/providers/QueryProvider";
import { env } from "@/shared/config/env";
import { cn } from "@/shared/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
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
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={cn("h-full", plusJakartaSans.variable, ibmPlexMono.variable)}
    >
      <body className="min-h-full bg-background font-sans text-base text-foreground antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
