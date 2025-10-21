"use client";
import { usePathname } from "next/navigation";
import HeaderClient from "@/components/HeaderClient";

export default function ConditionalHeader() {
  const pathname = usePathname() ?? "";

  if (pathname === "/auth" || pathname.startsWith("/auth/")) return null;

  return <HeaderClient />;
}