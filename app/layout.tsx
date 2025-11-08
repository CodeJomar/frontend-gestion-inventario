import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/providers";
import ClientLayout from "@/components/ClientLayout";
import ConditionalHeader from "@/components/ConditionalHeader";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hogarelectric Sistema de Inventario",
  description: "Sistema de gestión de inventario para Hogarelectric",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <ClientLayout>
            <ConditionalHeader />
            {children}
          </ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}