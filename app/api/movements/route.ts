import { NextResponse } from "next/server"
import { MovementsErrors } from "@/lib/errors/movementsErrors"
import { createClient } from "@/lib/supabase/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FASTAPI_URL = `${API_URL}/movimientos`;

async function getAccessToken() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}

async function getUserEmail() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data?.user?.email ?? null;
}

export async function GET() {
  try {

    const token = await getAccessToken();

    const res = await fetch(FASTAPI_URL, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      console.error("FastAPI GET error:", await res.text())
      return NextResponse.json(MovementsErrors.notFound.body, {
        status: MovementsErrors.notFound.status,
      })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/movements error:", error)
    return NextResponse.json(MovementsErrors.notFound.body, {
      status: MovementsErrors.notFound.status,
    })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getAccessToken();
    const email = await getUserEmail();
    const body = await req.json()

    body.created_by = email || "desconocido";

    const res = await fetch(FASTAPI_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), 
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error("FastAPI POST error:", await res.text())
      return NextResponse.json(MovementsErrors.createFailed.body, {
        status: MovementsErrors.createFailed.status,
      })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("POST /api/movements error:", error)
    return NextResponse.json(MovementsErrors.createFailed.body, {
      status: MovementsErrors.createFailed.status,
    })
  }
}