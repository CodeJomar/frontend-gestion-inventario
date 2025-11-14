import { useEffect, useState } from "react"
import { fetchProducts, activarProducto, desactivarProducto } from "@/lib/api/products"
import { toast } from "sonner"
import type { Producto } from "@/types/products"

export function useProducts() {
  const [productsList, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingIds, setActionLoadingIds] = useState<Record<string, boolean>>({})

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  async function activarProductoById(id: string) {
    setActionLoadingIds(prev => ({ ...prev, [id]: true }))
    try {
      const res = await activarProducto(id)
      toast.success(res?.mensaje || "Producto activado correctamente")
      await loadProducts()
      return res
    } catch (error: any) {
      console.error("activarProductoById error:", error)
      toast.error(error?.message || "Error al activar producto")
      throw error
    } finally {
      setActionLoadingIds(prev => ({ ...prev, [id]: false }))
    }
  }

  async function desactivarProductoById(id: string) {
    setActionLoadingIds(prev => ({ ...prev, [id]: true }))
    try {
      const res = await desactivarProducto(id)
      toast.success(res?.mensaje || "Producto desactivado correctamente")
      await loadProducts()
      return res
    } catch (error: any) {
      console.error("desactivarProductoById error:", error)
      toast.error(error?.message || "Error al desactivar producto")
      throw error
    } finally {
      setActionLoadingIds(prev => ({ ...prev, [id]: false }))
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return { productsList, loading, loadProducts, actionLoadingIds, activarProductoById, desactivarProductoById }
}