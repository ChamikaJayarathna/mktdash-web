const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="min-h-dvh bg-canvas">{children}</div>;
};

export default AuthLayout;
