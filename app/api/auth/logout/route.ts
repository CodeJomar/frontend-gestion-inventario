import { NextResponse } from "next/server";

/**
 * Elimina la cookie sb_access_token para cerrar sesión en servidor
 */
export async function POST() {
  return NextResponse.json(
    { message: "Sesión cerrada" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "sb_access_token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
      },
    }
  );
}