"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, BarChart3, ArrowDownCircle, } from "lucide-react"
import { mockProducts } from "@/data/mockProducts"


export function DashboardSection() {

  const STOCK_MINIMO_GLOBAL = 5
  const lowStockItems = mockProducts.filter(p => p.stock < STOCK_MINIMO_GLOBAL)

  const stats = [
    {
      title: "Total Productos",
      value: mockProducts.reduce((acc, p) => acc + p.stock, 0).toString(),
      change: "+12%",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Movimientos del Mes",
      value: "245",
      change: "+22%",
      icon: BarChart3,
      color: "text-accent",
    },
    {
      title: "Entradas vs Salidas",
      value: "Entrada +120 / Salida -98",
      change: "+22",
      icon: ArrowDownCircle,
      color: "text-chart-3",
    },
    {
      title: "Stock Crítico",
      value: lowStockItems.length.toString(),
      change: "-8%",
      icon: AlertTriangle,
      color: "text-destructive",
    },
  ]


  const recentMovements = [
    {
      id: "MOV-001",
      tipo: "Entrada",
      producto: "Licuadora Oster",
      cantidad: 10,
      fecha: "2025-10-20",
      usuario: "admin@hogarelectric.pe",
    },
    {
      id: "MOV-002",
      tipo: "Salida",
      producto: "Cable HDMI",
      cantidad: 5,
      fecha: "2025-10-19",
      usuario: "ventas@hogarelectric.pe",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-chart-4">{stat.change}</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Productos con Stock Bajo
            </CardTitle>
            <CardDescription>
              Productos que necesitan reabastecimiento urgente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.nombre}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={(item.stock / STOCK_MINIMO_GLOBAL) * 100} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {item.stock}/{STOCK_MINIMO_GLOBAL}
                    </span>
                  </div>
                </div>
                <Badge variant="destructive" className="text-xs">
                  Crítico
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Movimientos Recientes
            </CardTitle>
            <CardDescription>Últimas entradas y salidas registradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMovements.map((mov, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{mov.id}</p>
                  <p className="text-xs text-muted-foreground">{mov.producto}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{mov.cantidad} unidades</p>
                  <Badge
                    variant={mov.tipo === "Entrada" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {mov.tipo}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}