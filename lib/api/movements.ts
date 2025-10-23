import { MovimientoCreado } from "@/types/movements"

export async function fetchMovements() {
  const res = await fetch("/api/movements")
  if (!res.ok) throw new Error("Error al listar movimientos")
  return res.json()
}

export async function createMovement(data: MovimientoCreado) {
  const res = await fetch("/api/movements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al crear movimiento")
  return res.json()
}