import { supabase } from "@/lib/supabaseClient";

/**
 * Realiza una solicitud HTTP con token de Supabase.
 *
 * @param path - Ruta del endpoint (ej. "/productos")
 * @param options - Opciones para fetch (método, body, etc.)
 * @returns Respuesta JSON del servidor
 * @throws Error si la respuesta no es exitosa
 */

export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(base + path, { ...options, headers });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}