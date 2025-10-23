import type { Producto } from "@/types/products"

export async function fetchProducts(): Promise<Producto[]> {
  const res = await fetch("/api/products")
  if (!res.ok) throw new Error("Error al listar productos")
  return await res.json()
}

export async function createProduct(data: any): Promise<Producto | string | null> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorText = await res.text()
    console.error("FastAPI error:", errorText)
    throw new Error("Error al crear producto")
  }
  const contentType = res.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await res.json()
  } else {
    return await res.text()
  }
}

export async function updateProduct(id: string, data: any): Promise<Producto | string | null> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorText = await res.text()
    console.error("FastAPI error:", errorText)
    throw new Error("Error al actualizar producto")
  }
  const contentType = res.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await res.json()
  } else {
    return await res.text()
  }
}

export async function deleteProduct(id: string): Promise<string | null> {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const errorText = await res.text()
    console.error("FastAPI error:", errorText)
    throw new Error("Error al eliminar producto")
  }
  const contentType = res.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await res.json()
  } else {
    return await res.text()
  }
}
