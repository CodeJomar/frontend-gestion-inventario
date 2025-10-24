import { createClient } from "@/lib/supabase/client"
import type { Movimiento } from "@/types/movements"

const supabase = createClient();

export async function listar_movimientos(): Promise<Movimiento[]> {
  const { data, error } = await supabase
    .from("movimientos")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error al listar movimientos:", error)
    return []
  }
  return data || []
}

export async function crear_movimiento(data: any): Promise<Movimiento | null> {
  const { data: nuevoMovimiento, error } = await supabase
    .from("movimientos")
    .insert(data)
    .select()

  if (error) {
    console.error("Error al crear movimiento:", error)
    return null
  }
  return nuevoMovimiento?.[0] || null
}
