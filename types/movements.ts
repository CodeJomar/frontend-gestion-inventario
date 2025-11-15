export type Movimiento = {
  id: string
  tipo_movimiento: "entrada" | "salida"
  producto_id: string
  producto_nombre?: string
  cantidad: number
  motivo: "venta" | "devolución" | "reposición" | "ajuste"
  // usuario: string
  fecha: string
  created_at?: string
  modified_at?: string
  created_by?: string
}

export type MovimientoCreado = {
  producto_id: string
  tipo_movimiento: "entrada" | "salida"
  cantidad: number
  motivo: "venta" | "devolución" | "reposición" | "ajuste"
  // usuario: string
  created_by: string
}
