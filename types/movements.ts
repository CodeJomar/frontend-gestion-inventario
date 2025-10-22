export type Movimiento = {
  id: string
  tipo: "Entrada" | "Salida"
  producto_id: string
  producto_nombre: string
  cantidad: number
  fecha: string // formato ISO
  usuario: string
  motivo: string
}