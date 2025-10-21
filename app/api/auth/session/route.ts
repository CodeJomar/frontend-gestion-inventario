import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Establece la sesión del usuario después del login con Supabase
 *
 * - Recibe el access_token desde el cliente
 * - Verifica el token consultando Supabase /auth/v1/user
 * - Si es válido, guarda el token como cookie httpOnly
 * - Esta cookie permite proteger rutas desde el middleware
 *
 * @param req - Request con access_token en el body
 * @returns JSON con estado de sesión y cookie establecida
 */

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();
    if (!access_token) return NextResponse.json({ error: "no_token" }, { status: 400 });

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
      return NextResponse.json({ error: "server_config" }, { status: 500 });
    }

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (!userRes.ok) {
      const body = await userRes.json().catch(() => ({}));
      console.error("Supabase /auth/v1/user failed:", body);
      return NextResponse.json({ error: "invalid_token", detail: body }, { status: 401 });
    }

    const user = await userRes.json();

    const maxAge = 60 * 60; // 1h
    const secure = process.env.NODE_ENV === "production";

    const res = NextResponse.json({ ok: true, user }, { status: 200 });
    res.cookies.set("sb_access_token", access_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
      maxAge,
    });

    return res;
  } catch (err) {
    console.error("session route error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}