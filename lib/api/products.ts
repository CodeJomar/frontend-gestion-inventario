import type { Producto } from "@/types/products"
import { createApiClient } from "@/lib/services/axios"

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

// Activar producto (PUT /productos/{id}/activar)
export async function activarProducto(id: string): Promise<any> {
  try {
    const api = await createApiClient()
    const { data } = await api.put(`/productos/${id}/activar`)
    return data
  } catch (error: any) {
    console.error("Error activarProducto:", error?.response || error)
    throw new Error(error?.response?.data?.mensaje || "Error al activar producto")
  }
}

// Desactivar producto (PUT /productos/{id}/desactivar)
export async function desactivarProducto(id: string): Promise<any> {
  try {
    const api = await createApiClient()
    const { data } = await api.put(`/productos/${id}/desactivar`)
    return data
  } catch (error: any) {
    console.error("Error desactivarProducto:", error?.response || error)
    throw new Error(error?.response?.data?.mensaje || "Error al desactivar producto")
  }
}
