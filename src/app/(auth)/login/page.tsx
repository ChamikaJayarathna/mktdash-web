import type { Metadata } from "next";
import { LoginPage } from "@/views/login";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Follow Axis — your team's shared sending desk for email and WhatsApp outbound.",
};

const LoginRoute = () => {
  return <LoginPage />;
};

export default LoginRoute;
