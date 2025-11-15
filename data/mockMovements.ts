import type { Movimiento } from "@/types/movements"

export const mockMovements: Movimiento[] = [
  {
    id: "MOV-001",
    tipo_movimiento: "entrada",
    producto_id: "PROD-001",
    producto_nombre: "Licuadora Oster",
    cantidad: 10,
    fecha: "2025-10-20T10:30:00",
    created_by: "admin@gmail.com",
    motivo: "ajuste",
  },
  {
    id: "MOV-002",
    tipo_movimiento: "salida",
    producto_id: "PROD-005",
    producto_nombre: "Cable HDMI",
    cantidad: 5,
    fecha: "2025-10-19T14:15:00",
    created_by: "admin@gmail.com",
    motivo: "ajuste",
  },
]