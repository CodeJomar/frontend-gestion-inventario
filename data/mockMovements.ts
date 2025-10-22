import type { Movimiento } from "@/types/movements"

export const mockMovements: Movimiento[] = [
  {
    id: "MOV-001",
    tipo: "Entrada",
    producto_id: "PROD-001",
    producto_nombre: "Licuadora Oster",
    cantidad: 10,
    fecha: "2025-10-20T10:30:00",
    usuario: "admin@hogarelectric.pe",
    motivo: "Reabastecimiento mensual",
  },
  {
    id: "MOV-002",
    tipo: "Salida",
    producto_id: "PROD-005",
    producto_nombre: "Cable HDMI",
    cantidad: 5,
    fecha: "2025-10-19T14:15:00",
    usuario: "ventas@hogarelectric.pe",
    motivo: "Venta por TikTok Live",
  },
]