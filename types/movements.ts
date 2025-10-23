export type Movimiento = {
  id: string
  tipo_movimiento: "entrada" | "salida"
  producto_id: string
  cantidad: number
  motivo: string
  usuario: string
  fecha: string
}

export type MovimientoCreado = {
  producto_id: string
  tipo_movimiento: "entrada" | "salida"
  cantidad: number
  motivo: "venta" | "devolución" | "reposición" | "ajuste"
  usuario: string
}
