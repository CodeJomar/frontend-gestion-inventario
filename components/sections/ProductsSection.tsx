"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Edit, Trash2, Package, PinOff } from "lucide-react"
import { mockProducts } from "@/data/mockProducts"
import { ProductFormModal } from "@/components/modals/ProductFormModal"

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

export function ProductsSection() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  function handleAddProduct() {
    setModalMode("create")
    setSelectedProduct(null)
    setModalOpen(true)
  }

  function handleEditProduct(product: any) {
    setModalMode("edit")
    setSelectedProduct(product)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
        <Button className="cursor-pointer" onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const status =
            product.stock === 0
              ? "Agotado"
              : product.stock < 10
                ? "Bajo Stock"
                : "En Stock"

          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.imagen_url || "/images/default-product.jpg"}
                      alt={product.nombre}
                      className="w-12 h-12 rounded-lg object-cover bg-muted"
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
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-6">
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
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent cursor-pointer py-5" disabled>
                    <PinOff className="h-4 w-4 mr-2" />
                    Deshabilitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground mb-4">No hay productos que coincidan con tu búsqueda.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Producto
            </Button>
          </CardContent>
        </Card>
      )}
      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedProduct || undefined}
        categorias={categorias}
        tipos={tipos}
        onSubmit={(data) => {
          if (modalMode === "create") {
            // TODO: agregar producto a Supabase
          } else {
            // TODO: actualizar producto en Supabase
          }
        }}

      />
    </div>
  )
}