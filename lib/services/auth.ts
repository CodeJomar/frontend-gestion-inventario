import { mapAuthError } from "@/lib/errors/authErrors";
import { createClient } from "@/lib/supabase/client"


/**
 * Inicia sesión con email y password usando Supabase Auth
 * La sesión se guarda automáticamente en localStorage por Supabase
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const message = mapAuthError(error);
      return { data: null, error: message };
    }

    return { data, error: null };
  } catch (err: any) {
    const message = mapAuthError(err);
    return { data: null, error: message };
  }
}

/**
 * Cierra sesión del usuario actual
 * Elimina la sesión de localStorage automáticamente
 */
export async function logoutFromApp() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}