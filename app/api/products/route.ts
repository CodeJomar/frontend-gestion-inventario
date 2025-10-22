import { listar_productos, crear_producto } from "@/lib/services/products"
import { NextResponse } from "next/server"
import { productsErrors } from "@/lib/errors/productsErrors"

export async function GET() {
  const products = await listar_productos()
  if (!products) {
    return NextResponse.json(productsErrors.notFound.body, {
      status: productsErrors.notFound.status
    })
  }
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const newProduct = await crear_producto(body)
  if (!newProduct) {
    return NextResponse.json(productsErrors.createFailed.body, {
      status: productsErrors.createFailed.status
    })
  }
  return NextResponse.json(newProduct)
}