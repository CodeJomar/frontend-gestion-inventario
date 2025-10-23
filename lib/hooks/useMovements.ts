import { useState, useEffect } from "react"
import { fetchMovements, createMovement } from "@/lib/api/movements"
import { Movimiento, MovimientoCreado } from "@/types/movements"

export function useMovements() {
  const [movements, setMovements] = useState<Movimiento[]>([])
  const [loading, setLoading] = useState(true)

  async function loadMovements() {
    setLoading(true)
    try {
      const data = await fetchMovements()
      setMovements(data)
    } catch (err) {
      console.error("Error al cargar movimientos", err)
    } finally {
      setLoading(false)
    }
  }

  async function addMovement(data: MovimientoCreado) {
    try {
      const nuevo = await createMovement(data)
      setMovements((prev) => [...prev, nuevo])
    } catch (err) {
      console.error("Error al crear movimiento", err)
    }
  }

  useEffect(() => {
    loadMovements()
  }, [])

  return { movements, loading, loadMovements, addMovement }
}