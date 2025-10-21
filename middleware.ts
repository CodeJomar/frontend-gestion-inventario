import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware que protege rutas privadas usando la cookie de sesión
 *
 * - Permite rutas públicas /auth/login y /api.
 * - En producción, redirige a /auth/login si no hay token.
 * - Usa la cookie sb_access_token para validar sesión.
 *
 * @param req - Solicitud entrante
 * @returns Redirección o acceso permitido
 */

export async function middleware(req: NextRequest) {
  const publicPaths = ["/auth/login", "/api", "/_next", "/favicon.ico"];
  if (publicPaths.some(p => req.nextUrl.pathname.startsWith(p))) return NextResponse.next();

  if (process.env.NODE_ENV === "development") return NextResponse.next();

  const token = req.cookies.get("sb_access_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|static|api|favicon.ico).*)"] };