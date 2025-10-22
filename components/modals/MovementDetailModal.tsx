"use client"

import { ModalBase } from "@/components/modals/ModalBase"
import { Button } from "@/components/ui/button"
import type { Movimiento } from "@/types/movements"
import { PackageOpen, ArrowDownCircle, ArrowUpCircle, CalendarDays, User, ClipboardList, Printer } from "lucide-react"

type MovementDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  movimiento: Movimiento | null
}

function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO)
  return fecha.toLocaleString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function MovementDetailModal({
  open,
  onOpenChange,
  movimiento,
}: MovementDetailModalProps) {
  if (!movimiento) return null

  const fechaFormateada = formatearFecha(movimiento.fecha)

  const tipoIcon = movimiento.tipo === "Entrada"
    ? <ArrowDownCircle className="h-5 w-5 text-green-600" />
    : <ArrowUpCircle className="h-5 w-5 text-red-600" />

  return (
    <ModalBase
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Movimiento"
      description="Información completa del registro seleccionado."
    >
      <div className="rounded-md border p-6 bg-muted/30 space-y-4 text-sm shadow-sm">
        
        <div className="border-b pb-2 mb-6 flex justify-between items-center ">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">ID de Movimiento:</span>
            <span className="text-foreground font-bold">{movimiento.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {tipoIcon}
            <span className="font-medium text-muted-foreground">Tipo:</span>{" "}
            {movimiento.tipo}
          </div>
        </div>

        <div className="ml-5 space-y-3">

          <div className="flex items-center gap-2">
            <PackageOpen className="h-4 w-4" />
            <span className="font-medium text-muted-foreground">Producto:</span>{" "}
            {movimiento.producto_nombre}
          </div>

          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="font-medium text-muted-foreground">Cantidad:</span>{" "}
            {movimiento.cantidad}
          </div>

          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="font-medium text-muted-foreground">Motivo:</span>{" "}
            {movimiento.motivo}
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium text-muted-foreground">Usuario:</span>{" "}
            {movimiento.usuario}
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium text-muted-foreground">Fecha:</span>{" "}
            {fechaFormateada}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button className="flex-1 cursor-pointer" variant="outline" onClick={() => onOpenChange(false)} disabled>
            <Printer className="h-4 w-4 mr-2" />
                    Imprimir
          </Button>
        </div>
      </div>
    </ModalBase>
  )
}