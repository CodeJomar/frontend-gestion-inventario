import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware que protege rutas privadas usando Supabase Auth
 *
 * - Permite rutas públicas /auth/login y /api.
 * - Verifica la sesión directamente con Supabase
 * - Redirige a /auth/login si no hay sesión activa
 *
 * @param req - Solicitud entrante
 * @returns Redirección o acceso permitido
 */

export async function middleware(req: NextRequest) {
  // rutas publicas
  const publicPaths = ["/auth/login", "/api", "/_next", "/favicon.ico"]
  const isPublicPath = publicPaths.some(p => req.nextUrl.pathname.startsWith(p));

  if (isPublicPath) {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(req);

  if (!user) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/auth/login"
    redirectUrl.searchParams.set("redirectedTo", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse
}

export const config = { matcher: ["/((?!_next|static|api|favicon.ico).*)"] };