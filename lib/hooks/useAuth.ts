"use client";
import { useEffect, useState } from "react";
import { loginWithEmail, logoutFromApp } from "@/lib/services/auth";
import type { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client";

/**
 * Hook de autenticación
 * Expone usuario actual, sesión, estados de carga y error
 */
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Escucha cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
    });

    // Obtiene sesión actual
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(data?.session?.user ?? null);
        setSession(data?.session ?? null);
      })
      .catch(() => {
        setUser(null);
        setSession(null);
      })
      .finally(() => setLoading(false));

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);

    const { data, error } = await loginWithEmail(email, password);
    if (error) setError(error);

    setUser(data?.user ?? null);
    setSession(data?.session ?? null);
    setLoading(false);

    return { data, error };
  }

  async function logout() {
    await logoutFromApp();
  }

  return { user, session, login, logout, loading, error };
}