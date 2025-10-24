import { createClient } from "@/lib/supabase/client"
import type { Producto } from "@/types/products"

const supabase = createClient();

export async function listar_productos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al listar productos:", error)
    return []
  }

  return data || []
}

export async function obtener_producto(id: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error al obtener producto ${id}:`, error)
    return null
  }

  return data
}


export async function crear_producto(data: any): Promise<Producto | null> {
  const { data: nuevo, error } = await supabase
    .from("productos")
    .insert([data])
    .select()

  if (error) {
    console.error("Error al crear producto:", error)
    return null
  }

  return nuevo?.[0] || null
}

export async function actualizar_producto(id: string, data: any): Promise<Producto | null> {
  const { data: actualizado, error } = await supabase
    .from("productos")
    .update(data)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al actualizar producto:", error)
    return null
  }

  return actualizado?.[0] || null
}

export async function eliminar_producto(id: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error al eliminar producto:", error)
    return null
  }

  return data || null
}