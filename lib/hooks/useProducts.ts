import { useEffect, useState } from "react"
import { fetchProducts } from "@/lib/api/products"
import type { Producto } from "@/types/products"

export function useProducts() {
  const [productsList, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    setLoading(true)
    const data = await fetchProducts()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return { productsList, loading, loadProducts }
}