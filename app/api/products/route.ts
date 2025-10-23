import { NextResponse } from "next/server"
import { productsErrors } from "@/lib/errors/productsErrors"

const FASTAPI_URL = "http://127.0.0.1:8000/productos"

export async function GET() {
  try {
    const res = await fetch(FASTAPI_URL)
    if (!res.ok) {
      console.error("FastAPI GET error:", await res.text())
      return NextResponse.json(productsErrors.notFound.body, {
        status: productsErrors.notFound.status,
      })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json(productsErrors.notFound.body, {
      status: productsErrors.notFound.status,
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
      return NextResponse.json(productsErrors.createFailed.body, {
        status: productsErrors.createFailed.status
      })
    }
    const newProduct = await res.json()
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json(productsErrors.createFailed.body, {
      status: productsErrors.createFailed.status
    })
  }
}
