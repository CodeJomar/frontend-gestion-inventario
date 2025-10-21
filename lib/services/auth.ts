import { supabase } from "@/lib/supabaseClient";
import { mapAuthError } from "@/lib/errors/authErrors";

export async function loginWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const friendly = mapAuthError(error);
      return { data: null, error: friendly };
    }

    const token = data?.session?.access_token;
    if (token) {
      try {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token }),
        });
      } catch {}
    }

    return { data, error: null };
  } catch (err: any) {
    const friendly = mapAuthError(err);
    return { data: null, error: friendly };
  }
}

/**
 * Cierra sesión y limpia la cookie en el backend
 */
export async function logoutFromApp() {
  try {
    await supabase.auth.signOut();
  } catch {}

  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {}
}