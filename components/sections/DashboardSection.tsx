"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, ShoppingCart, AlertTriangle, DollarSign, } from "lucide-react"

export function DashboardSection() {
  const stats = [
    {
      title: "Total Productos",
      value: "1,234",
      change: "+12%",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Órdenes Pendientes",
      value: "89",
      change: "+5%",
      icon: ShoppingCart,
      color: "text-accent",
    },
    {
      title: "Ingresos del Mes",
      value: "$45,231",
      change: "+18%",
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      title: "Stock Bajo",
      value: "23",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-destructive",
    },
  ]

  const lowStockItems = [
    { name: "Laptop Dell XPS 13", stock: 5, min: 10 },
    { name: "Mouse Logitech MX", stock: 3, min: 15 },
    { name: "Teclado Mecánico", stock: 2, min: 8 },
    { name: 'Monitor 24"', stock: 1, min: 5 },
  ]

  const recentOrders = [
    { id: "ORD-001", customer: "Empresa ABC", total: "$2,340", status: "Pendiente" },
    { id: "ORD-002", customer: "Tech Solutions", total: "$1,890", status: "Procesando" },
    { id: "ORD-003", customer: "StartUp XYZ", total: "$3,450", status: "Enviado" },
    { id: "ORD-004", customer: "Corp Industries", total: "$890", status: "Entregado" },
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
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={(item.stock / item.min) * 100} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {item.stock}/{item.min}
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

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Órdenes Recientes
            </CardTitle>
            <CardDescription>
              Últimas órdenes procesadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{order.total}</p>
                  <Badge
                    variant={
                      order.status === "Entregado"
                        ? "default"
                        : order.status === "Enviado"
                          ? "secondary"
                          : order.status === "Procesando"
                            ? "outline"
                            : "destructive"
                    }
                    className="text-xs"
                  >
                    {order.status}
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