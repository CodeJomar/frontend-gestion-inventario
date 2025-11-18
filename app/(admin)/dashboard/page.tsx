"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, BarChart3, ArrowDownCircle, HandCoins } from "lucide-react"
import { mockProducts } from "@/data/mockProducts"
import { useProducts } from "@/lib/hooks/useProducts"
import { useMovements } from "@/lib/hooks/useMovements"
import { Skeleton } from "@/components/ui/skeleton"


export default function page() {

  const STOCK_MINIMO_GLOBAL = 5
  const { productsList, loading: loadingProducts } = useProducts()
  const { movements, loading: loadingMovements } = useMovements()
  const recentMovements = movements.slice(0, 5)
  const lowStockItems = productsList.filter(p => p.stock < STOCK_MINIMO_GLOBAL)

  function calculatePercentageChange(current: number, previous: number): string {
    if (previous === 0) {
      return current === 0 ? "Sin datos" : "100%";
    }
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(2)}%`;
  }

  function getMovementsByMonth(
    movements: { tipo_movimiento: string; fecha: string }[],
    month: number,
    year: number,
    type: string
  ): number {
    return movements.filter(
      (m) =>
        m.tipo_movimiento === type &&
        new Date(m.fecha).getMonth() === month &&
        new Date(m.fecha).getFullYear() === year
    ).length;
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthEntradas = getMovementsByMonth(movements, currentMonth, currentYear, "entrada");
  const previousMonthEntradas = getMovementsByMonth(movements, previousMonth, previousYear, "entrada");
  const entradasChange = calculatePercentageChange(currentMonthEntradas, previousMonthEntradas);

  const currentMonthSalidas = getMovementsByMonth(movements, currentMonth, currentYear, "salida");
  const previousMonthSalidas = getMovementsByMonth(movements, previousMonth, previousYear, "salida");
  const salidasChange = calculatePercentageChange(currentMonthSalidas, previousMonthSalidas);

  const previousMonthProducts = productsList.filter(
    (product) => new Date(product.created_at).getMonth() === previousMonth &&
                 new Date(product.created_at).getFullYear() === previousYear
  ).length;

  const currentMonthProducts = productsList.filter(
    (product) => new Date(product.created_at).getMonth() === currentMonth &&
                 new Date(product.created_at).getFullYear() === currentYear
  ).length;

  const productsChange = calculatePercentageChange(currentMonthProducts, previousMonthProducts);

  const currentMonthSalesValue = movements
    .filter(
      (m) =>
        m.tipo_movimiento === "salida" &&
        new Date(m.fecha).getMonth() === currentMonth &&
        new Date(m.fecha).getFullYear() === currentYear
    )
    .reduce((total, m) => {
      const product = productsList.find((p) => p.id === m.producto_id);
      return total + (product ? product.precio * m.cantidad : 0);
    }, 0);

  const previousMonthSalesValue = movements
    .filter(
      (m) =>
        m.tipo_movimiento === "salida" &&
        new Date(m.fecha).getMonth() === previousMonth &&
        new Date(m.fecha).getFullYear() === previousYear
    )
    .reduce((total, m) => {
      const product = productsList.find((p) => p.id === m.producto_id);
      return total + (product ? product.precio * m.cantidad : 0);
    }, 0);

  const salesChange = calculatePercentageChange(currentMonthSalesValue, previousMonthSalesValue);

  const stats = [
    {
      title: "Total Productos",
      value: productsList.length.toString(),
      change: productsChange,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Entradas este mes",
      value: currentMonthEntradas.toString(),
      change: entradasChange,
      icon: BarChart3,
      color: "text-accent",
    },
    {
      title: "Salidas este mes",
      value: currentMonthSalidas.toString(),
      change: salidasChange,
      icon: ArrowDownCircle,
      color: "text-chart-3",
    },
    {
      title: "Valor Total de Ventas",
      value: `S/. ${currentMonthSalesValue.toFixed(2)}`,
      change: salesChange,
      icon: HandCoins,
      color: "text-secondary",
    },
  ]

  function getProductName(id: string): string {
    const producto = productsList.find(p => p.id === id)
    return producto?.nombre || "Producto desconocido"
  }

  return (
    <div className="space-y-6">

      {loadingProducts || loadingMovements ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <CardHeader className="flex justify-between items-center pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {loadingProducts || loadingMovements ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
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
        )}

        {loadingMovements ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
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
                    <p className="text-sm font-medium">MOV00-{mov.id.slice(0, 6)}</p>
                    <p className="text-xs text-muted-foreground">{getProductName(mov.producto_id)}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{mov.cantidad} unidades</p>
                    <Badge
                      variant={mov.tipo_movimiento === "entrada" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {mov.tipo_movimiento === "entrada" ? "Entrada" : "Salida"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}