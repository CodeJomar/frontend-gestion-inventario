"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle, Search, Filter, Calendar } from "lucide-react"
import { mockMovimientos } from "@/data/mockMovements"

export function MovementsSection() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMovimientos = mockMovimientos.filter(
    (mov) =>
      mov.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
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
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Movements List */}
      <div className="space-y-4">
        {filteredMovimientos.map((mov) => (
          <Card key={mov.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                    {mov.tipo === "Entrada" ? (
                      <ArrowDownCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <ArrowUpCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{mov.id}</h3>
                      <Badge variant={mov.tipo === "Entrada" ? "default" : "destructive"}>
                        {mov.tipo}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{mov.producto_nombre}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(mov.fecha).toLocaleDateString("es-ES")}
                      </div>
                      <span>{mov.cantidad} unidades</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registrado por: {mov.usuario}
                    </p>
                    {mov.motivo && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        Motivo: {mov.motivo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMovimientos.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ArrowUpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron movimientos</h3>
            <p className="text-muted-foreground mb-4">
              No hay registros que coincidan con tu búsqueda.
            </p>
            <Button>
              Registrar Movimiento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}