import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { productsErrors } from "@/lib/errors/productsErrors"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FASTAPI_URL = `${API_URL}/productos/{id}`;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(FASTAPI_URL.replace("{id}", params.id))
    if (!res.ok) {
      console.error("FastAPI GET error:", await res.text())
      return NextResponse.json(productsErrors.notFound.body, {
        status: productsErrors.notFound.status
      })
    }
    const productItem = await res.json()

    if (!productItem || !productItem.id) {
      return NextResponse.json(productsErrors.notFound.body, {
        status: productsErrors.notFound.status
      })
    }

    return NextResponse.json(productItem)
  } catch (error) {
    console.error("GET /api/products/[id] error:", error)
    return NextResponse.json(productsErrors.notFound.body, {
      status: productsErrors.notFound.status
    })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const res = await fetch(FASTAPI_URL.replace("{id}", params.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error("FastAPI PUT error:", await res.text())
      return NextResponse.json(productsErrors.updateFailed.body, {
        status: productsErrors.updateFailed.status
      })
    }
    const updatedProduct = await res.json()
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error)
    return NextResponse.json(productsErrors.updateFailed.body, {
      status: productsErrors.updateFailed.status
    })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(FASTAPI_URL.replace("{id}", params.id), {
      method: "DELETE",
    })
    if (!res.ok) {
      console.error("FastAPI DELETE error:", await res.text())
      return NextResponse.json(productsErrors.deleteFailed.body, {
        status: productsErrors.deleteFailed.status
      })
    }
    const deletedProduct = await res.json()
    return NextResponse.json(deletedProduct)
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error)
    return NextResponse.json(productsErrors.deleteFailed.body, {
      status: productsErrors.deleteFailed.status
    })
  }
}