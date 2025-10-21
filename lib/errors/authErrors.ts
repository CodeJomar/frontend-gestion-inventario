/**
 * Traduce los errores de Supabase o red
 *
 * @param err - Error recibido de Supabase o el backend
 * @returns Mensaje para la UI
 */
export function mapAuthError(err: any): string {
  const msg = String(err?.message ?? err).toLowerCase();

  if (msg.includes("invalid credentials") || msg.includes("invalid login")) {
    return "Credenciales incorrectas. Verifica tu email y contraseña.";
  }

  if (msg.includes("user not found") || msg.includes("no user") || msg.includes("not found")) {
    return "Usuario no encontrado.";
  }

  if (msg.includes("invalid token") || msg.includes("session_fail") || msg.includes("no_token")) {
    return "No se pudo establecer la sesión. Intenta de nuevo.";
  }

  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return "Error de conexión. Revisa tu red e intenta nuevamente.";
  }

  return err?.message ?? "Error inesperado al iniciar sesión. Intenta de nuevo.";
}