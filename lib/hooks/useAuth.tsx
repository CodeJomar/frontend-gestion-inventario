"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { loginWithEmail, logoutFromApp } from "@/lib/services/auth";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** Escucha cambios de autenticación y obtiene el usuario actual */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
    });

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
      listener.subscription.unsubscribe();
    };
  }, []);

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
    setUser(null);
    setSession(null);
  }

  return { user, session, login, logout, loading, error };
}