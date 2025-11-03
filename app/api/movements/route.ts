import { NextResponse } from "next/server"
import { MovementsErrors } from "@/lib/errors/movementsErrors"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FASTAPI_URL = `${API_URL}/movimientos`;

export async function GET() {
  try {
    const res = await fetch(FASTAPI_URL)
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
    const body = await req.json()
    const res = await fetch(FASTAPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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