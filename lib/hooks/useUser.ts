"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js";

/**
 * Obtiene usuario actual desde Supabase
 * 
 * @returns { user, loading } - Usuario actual y estado de carga
 */
export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data?.user ?? null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));

    return () => {
      try {
        listener?.subscription?.unsubscribe?.();
      } catch {}
    };
  }, []);

  return { user, loading };
}