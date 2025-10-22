"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Download, Calendar, Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from "lucide-react"

export function ReportsSection() {
  const reportCards = [
    {
      title: "Movimientos Registrados",
      description: "Entradas y salidas en el último mes",
      value: "245",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "text-chart-1",
    },
    {
      title: "Producto Más Movido",
      description: "Cable HDMI con 45 movimientos",
      value: "Cable HDMI",
      change: "+18%",
      trend: "up",
      icon: Package,
      color: "text-chart-2",
    },
    {
      title: "Stock Crítico",
      description: "Productos por debajo del mínimo",
      value: "23",
      change: "-5%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: "Entradas vs Salidas",
      description: "Balance de flujo de inventario",
      value: "Entrada +120 / Salida -98",
      change: "+22",
      trend: "up",
      icon: ArrowDownCircle,
      color: "text-chart-4",
    },
  ]

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
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendIcon
                    className={`h-3 w-3 mr-1 ${metric.trend === "up" ? "text-chart-4" : "text-destructive"
                      }`}
                  />
                  <span
                    className={
                      metric.trend === "up" ? "text-chart-4" : "text-destructive"
                    }
                  >
                    {metric.change}
                  </span>
                  <span className="ml-1">desde el mes pasado</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

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
                Genera y descarga reportes detallados del sistema
              </CardDescription>
            </div>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Programar Reporte
            </Button>
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
                    <Button variant="outline" size="sm">
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