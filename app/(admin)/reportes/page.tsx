"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Download, Calendar, Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { ReportesAPI } from "@/lib/api/reportes";

export default function page() {

  const availableReports = [
    {
      name: "Reporte de Productos Activos",
      description: "Estado detallado de todos los productos activos.",
      type: "Excel",
      // lastGenerated: "Hace 2 horas",
      category: "Inventario",
      download: ReportesAPI.productosActivos,
    },
    {
      name: "Reporte de Movimientos de Entrada",
      description: "Resumen de los movimientos de tipo entrada por producto.",
      type: "Excel",
      // lastGenerated: "Ayer",
      category: "Transacciones",
      download: ReportesAPI.movimientosEntrada,
    },
    {
      name: "Reporte de Productos Inactivos",
      description: "Estado detallado de todos los productos inactivos.",
      type: "Excel",
      // lastGenerated: "Hace 1 hora",
      category: "Inventario",
      download: ReportesAPI.productosInactivos,
    },
    {
      name: "Reporte de Movimientos de Salida",
      description: "Resumen de los movimientos de tipo salida por producto.",
      type: "Excel",
      // lastGenerated: "Hace 3 días",
      category: "Transacciones",
      download: ReportesAPI.movimientosSalida,
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="cursor-pointer"
                      onClick={report.download}
                      >
                      <Download className="h-3 w-3 mr-1" />
                      Descargar
                    </Button>
                  </div>
                  {/*<p className="text-xs text-muted-foreground">
                    Última generación: {report.lastGenerated}
                  </p>*/}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}