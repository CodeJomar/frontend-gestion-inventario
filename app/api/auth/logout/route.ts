import { NextResponse } from "next/server";

/**
 * Elimina la cookie sb_access_token para cerrar sesión en servidor
 */
export async function POST() {
  const res = NextResponse.json(
    { message: "Sesión cerrada" },
    { status: 200 })
  res.cookies.set("sb_access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: true,
    sameSite: "lax",
  })
  return res
}