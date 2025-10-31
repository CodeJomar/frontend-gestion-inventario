"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle, Search, Filter, Calendar, Eye, Download, Plus } from "lucide-react"
import { MovementFormModal } from "@/components/modals/MovementFormModal"
import { Movimiento, MovimientoCreado } from "@/types/movements"
import { MovementDetailModal } from "@/components/modals/MovementDetailModal"
import { useProducts } from "@/lib/hooks/useProducts"
import { createMovement } from "@/lib/api/movements"
import { useMovements } from "@/lib/hooks/useMovements"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"


export default function page() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("")
  const { productsList } = useProducts()
  const { movements, loading, loadMovements } = useMovements()

  const filteredMovements = movements.filter((mov) =>
    mov.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProductName(mov.producto_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedMovement, setSelectedMovement] = useState<Movimiento | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  function handleAddMovement() {
    setModalMode("create")
    setSelectedMovement(null)
    setModalOpen(true)
  }

  function getProductName(id: string): string {
    const producto = productsList.find(p => p.id === id)
    return producto?.nombre || "Producto desconocido"
  }

  function formatMovementId(id: string): string {
    return `MOV00-${id.slice(0, 6)}`
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar movimientos..."
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
        <Button className="cursor-pointer" onClick={handleAddMovement}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar movimiento
        </Button>
      </div>
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow p-2 animate-pulse">
              <CardContent>
                <div className="flex items-center justify-between px-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-32 mb-1" />
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 gap-6">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredMovements.length > 0 && (
        <div className="space-y-4">
          {filteredMovements.map((mov) => (
            <Card key={mov.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-2">
                <div className="flex items-center justify-between px-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                      {mov.tipo_movimiento === "entrada" ? (
                        <ArrowDownCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <ArrowUpCircle className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{formatMovementId(mov.id)}</h3>
                        <Badge variant={mov.tipo_movimiento === "entrada" ? "default" : "destructive"}>
                          {mov.tipo_movimiento === "entrada" ? "Entrada" : "Salida"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{getProductName(mov.producto_id)}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {mov.fecha ? new Date(mov.fecha).toLocaleDateString("es-ES") : "Fecha desconocida"}
                        </div>
                        <span>{mov.cantidad} unidades</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-4 gap-6">
                    <Button onClick={() => {
                      const nameMovement = {
                        ...mov,
                        producto_nombre: getProductName(mov.producto_id)
                      }
                      setDetailOpen(true);
                      setSelectedMovement(nameMovement);
                    }} variant="outline" size="sm" className="w-full cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm" className="w-full cursor-pointer" disabled>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredMovements.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ArrowUpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron movimientos</h3>
            <p className="text-muted-foreground mb-4">
              No hay registros que coincidan con tu búsqueda.
            </p>
          </CardContent>
        </Card>
      )}
      <MovementFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        productos={productsList.map(p => ({ id: p.id, nombre: p.nombre }))}
        onSubmit={async (data: MovimientoCreado) => {
          if (modalMode === "create") {
            try {
              await createMovement(data)
              await loadMovements()
              setModalOpen(false)
            } catch (err) {
              console.error("Error al crear movimiento", err)
            }
          }
        }}
        setActiveTab={(page: string) => {router.push(`/${page}`)}}
      />
      <MovementDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        movimiento={selectedMovement}
      />

    </div>
  )
}