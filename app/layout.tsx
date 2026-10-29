import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fanfar - Farmácia Online | Rémedios, Medicamentos e muito mais",
  description:
    "Sua farmácia online completa com remédios, medicamentos, itens de saúde, beleza e muito mais com entrega rápida.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
