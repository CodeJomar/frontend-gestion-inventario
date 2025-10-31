"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Download, Calendar, Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from "lucide-react"

export default function page() {

  const availableReports = [
    {
      name: "Reporte de Inventario Completo",
      description: "Estado detallado de todos los productos en stock",
      type: "PDF",
      lastGenerated: "Hace 2 horas",
      category: "Inventario",
    },
    {
      name: "Análisis de Movimientos Mensual",
      description: "Resumen de entradas y salidas por producto",
      type: "Excel",
      lastGenerated: "Ayer",
      category: "Inventario",
    },
    {
      name: "Productos con Bajo Stock",
      description: "Lista de productos que requieren reabastecimiento",
      type: "PDF",
      lastGenerated: "Hace 1 hora",
      category: "Alertas",
    },
    {
      name: "Historial de Movimientos",
      description: "Registro completo de entradas y salidas",
      type: "CSV",
      lastGenerated: "Hace 3 días",
      category: "Inventario",
    },
    {
      name: "Reporte de Proveedores",
      description: "Evaluación de rendimiento de proveedores",
      type: "PDF",
      lastGenerated: "Hace 2 días",
      category: "Proveedores",
    },
  ]

  return (
    <div className="space-y-6">

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Reportes Disponibles
              </CardTitle>
              <CardDescription>
                Genera y descarga reportes detallados de inventario y movimientos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availableReports.map((report, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-primary/20 hover:border-l-primary transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{report.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {report.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {report.type}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Download className="h-3 w-3 mr-1" />
                      Descargar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última generación: {report.lastGenerated}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}