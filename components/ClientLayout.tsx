"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import type { ThemeProviderProps } from "next-themes";

export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <></>;
  }
  return (
  <NextThemesProvider {...props}>
    {children}
    <Toaster richColors position="top-right" />
  </NextThemesProvider>);
}