import { actualizar_producto, eliminar_producto, obtener_producto } from "@/lib/services/products"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Producto } from "@/types/products"
import { productsErrors } from "@/lib/errors/productsErrors"


export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const productItem: Producto | null = await obtener_producto(params.id)
  if (!productItem) {
    return NextResponse.json(productsErrors.notFound.body, {
      status: productsErrors.notFound.status
    })
  }
  return NextResponse.json(productItem)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const updatedProduct = await actualizar_producto(params.id, body)
  if (!updatedProduct) {
    return NextResponse.json(productsErrors.updateFailed.body, {
      status: productsErrors.updateFailed.status
    })
  }
  return NextResponse.json(updatedProduct)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const deletedProduct = await eliminar_producto(params.id)
  if (!deletedProduct) {
    return NextResponse.json(productsErrors.deleteFailed.body, {
      status: productsErrors.deleteFailed.status
    })
  }
  return NextResponse.json(deletedProduct)
}

