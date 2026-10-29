"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";

import Footer from "@/components/Footer";
import CartToast from "@/components/CartToast";

const BLACK_WEEK_ROUTES = ["/black-week"];

function ConditionalShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBlackWeek = BLACK_WEEK_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isBlackWeek) {
    // A rota /black-week tem seu próprio layout com header/subheader temáticos
    return <>{children}</>;
  }

  return (
    <>
      <Header />

      <CartToast />
      {children}
      <Footer />
    </>
  );
}

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={children}>
      <ConditionalShellContent>{children}</ConditionalShellContent>
    </Suspense>
  );
}
