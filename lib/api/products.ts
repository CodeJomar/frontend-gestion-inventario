import type { Producto } from "@/types/products"

export async function fetchProducts(): Promise<Producto[]> {
  const res = await fetch("/api/products")
  return await res.json()
}

export async function createProduct(data: any): Promise<Producto | null> {
  const res = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return await res.json()
}

export async function updateProduct(id: string, data: any): Promise<Producto | null> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
  return await res.json()
}

export async function deleteProduct(id: string): Promise<Producto | null> {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
  return await res.json()
}