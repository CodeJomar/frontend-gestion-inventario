import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TabManager from "@/components/sections/TabManager";

export const metadata: Metadata = {
  title: "Hogarelectric Sistema de Inventario",
  description: "Sistema de gestión de inventario para Hogarelectric",
};

// Valid admin sections
const validTabs = ["dashboard", "productos", "movimientos", "reportes", "usuarios", "proveedores"];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect current segment from the URL path
  if (typeof window !== "undefined") {
    const segment = window.location.pathname.split("/")[1];
    if (segment && !validTabs.includes(segment)) {
      notFound();
    }
  }

  return <TabManager>{children}</TabManager>;
}
