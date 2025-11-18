"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, Edit, Trash2, Package, PinOff } from "lucide-react"
import { ProductFormModal } from "@/components/modals/ProductFormModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Loader2Icon } from "lucide-react"
import { createProduct, fetchProducts, updateProduct } from "@/lib/api/products"
import { Producto } from "@/types/products"
import { useProducts } from "@/lib/hooks/useProducts"
import { Skeleton } from "@/components/ui/skeleton"


export const categorias = [
  "Cocina",
  "Limpieza",
  "Lavandería",
  "Climatización",
  "Belleza Personal",
  "Cuidado del Hogar",
  "Electrodomésticos Pequeños",
  "Entretenimiento",
  "Oficina y Tecnología",
  "Otros"
]

export const tipos = ["electrodomestico", "accesorio", "consumible"]

export default function page() {
  const { productsList, loading, loadProducts, actionLoadingIds, activarProductoById, desactivarProductoById } = useProducts()
  const [searchTerm, setSearchTerm] = useState("");

  const [filterEstado, setFilterEstado] = useState<"activo" | "inactivo" | "todos">("todos");
  const [filterCategoria, setFilterCategoria] = useState<string>("todos");

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmProduct, setConfirmProduct] = useState<Producto | null>(null)
  const [confirmAction, setConfirmAction] = useState<"desactivar" | "activar" | null>(null)

  const filteredProducts = productsList.filter((product) => {
    const matchesSearchTerm =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      filterEstado === "todos" ||
      (filterEstado === "activo" && product.estado !== false) ||
      (filterEstado === "inactivo" && product.estado === false);

    const matchesCategoria =
      filterCategoria === "todos" || product.categoria === filterCategoria;

    return matchesSearchTerm && matchesEstado && matchesCategoria;
  });

  function handleAddProduct() {
    setModalMode("create")
    setSelectedProduct(null)
    setModalOpen(true)
  }

  function handleEditProduct(product: Producto) {
    setModalMode("edit")
    setSelectedProduct(product)
    setModalOpen(true)
  }

  function openConfirm(product: Producto, action: "desactivar" | "activar") {
    setConfirmProduct(product)
    setConfirmAction(action)
    setConfirmOpen(true)
  }

  async function handleConfirmAction() {
    if (!confirmProduct || !confirmAction) return
    try {
      if (confirmAction === "desactivar") {
        await desactivarProductoById(confirmProduct.id)
      } else {
        await activarProductoById(confirmProduct.id)
      }
    } catch (error) {
      console.error("Confirm action error:", error)
    } finally {
      setConfirmOpen(false)
      setConfirmProduct(null)
      setConfirmAction(null)
    }
  }

  return (
    <div className="space-y-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-6">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select onValueChange={(value) => setFilterEstado(value as "activo" | "inactivo" | "todos")}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilterCategoria(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorías</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setFilterEstado("todos");
                setFilterCategoria("todos");
                setSearchTerm("");
              }}
            >
              Ver Todo
            </Button>
          </div>
        </div>
        <Button className="cursor-pointer" onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-4 animate-pulse">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-full" />
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const status =
            product.stock === 0
              ? "Agotado"
              : product.stock < 10
                ? "Bajo Stock"
                : "En Stock"

          return (
            <Card
              key={product.id}
              className={`hover:shadow-md transition-shadow ${((product as any).estado === false) ? 'opacity-60 filter grayscale' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.imagen_url || "/images/default-product.jpg"}
                      alt={product.nombre}
                      className={`w-25 h-25 rounded-lg object-cover bg-muted ${((product as any).estado === false) ? 'opacity-60' : ''}`}
                    />
                    <div>
                      <CardTitle className="text-base">{product.nombre}</CardTitle>
                      <CardDescription>{product.categoria}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      status === "Agotado"
                        ? "destructive"
                        : status === "Bajo Stock"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">S/. {product.precio}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock} unidades</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent cursor-pointer py-5" onClick={() => handleEditProduct(product)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent cursor-pointer py-5"
                    onClick={() => openConfirm(product, (product as any).estado === false ? "activar" : "desactivar")}
                    disabled={!!actionLoadingIds[product.id]}
                  >
                    {actionLoadingIds[product.id] ? (
                      <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <PinOff className="h-4 w-4 mr-2" />
                    )}
                    {(product as any).estado === false ? "Activar" : "Desactivar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!loading && filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground mb-4">No hay productos que coincidan con tu búsqueda.</p>
          </CardContent>
        </Card>
      )}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction === "desactivar" ? "Desactivar producto" : "Activar producto"}</DialogTitle>
            <DialogDescription>
              {confirmProduct ? `¿Deseas ${confirmAction} el producto "${confirmProduct.nombre}"?` : "¿Continuar?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleConfirmAction}
                disabled={confirmProduct ? !!actionLoadingIds[confirmProduct.id] : false}
              >
                {confirmProduct && actionLoadingIds[confirmProduct.id] ? (
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {confirmAction === "desactivar" ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedProduct || undefined}
        categorias={categorias}
        tipos={tipos}
        onSubmit={async (data) => {
          try {
            if (modalMode === "create") {
              await createProduct(data)
            } else if (selectedProduct) {
              await updateProduct(selectedProduct.id, data)
            }
            await loadProducts()
          } catch (error) {
            console.error("Error al guardar producto:", error)
          } finally {
            setModalOpen(false)
          }
        }}

      />
    </div>
  )
}