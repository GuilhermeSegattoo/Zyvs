import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thumdra - CRM Inteligente",
  description: "Sistema de CRM com automações para WhatsApp, Instagram e Email",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
