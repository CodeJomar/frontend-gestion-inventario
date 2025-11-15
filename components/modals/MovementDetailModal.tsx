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

function formatDate(isoDateString: string): string {
  const date = new Date(isoDateString)
  return date.toLocaleString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatMovementId(id: string): string {
  return `MOV00-${id.slice(0, 6)}`
}

export function MovementDetailModal({
  open,
  onOpenChange,
  movimiento,
}: MovementDetailModalProps) {
  if (!movimiento) return null

  const formattedMovementDate = formatDate(movimiento.fecha)

  const textType = movimiento.tipo_movimiento === "entrada" ? "Entrada" : "Salida"
  const iconType = movimiento.tipo_movimiento === "entrada"
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
            <span className="font-medium">ID:</span>
            <span className="text-foreground font-bold">{formatMovementId(movimiento.id)}</span>
          </div>
          <div className="flex items-center gap-2">
            {iconType}
            <span className="font-medium text-muted-foreground">Tipo:</span>{" "}
            {textType}
          </div>
        </div>

        <div className="ml-5 space-y-3">

          <div className="flex items-center gap-2">
            <PackageOpen className="h-4 w-4" />
            <span className="font-medium text-muted-foreground">Producto:</span>{" "}
            {movimiento.producto_nombre || movimiento.producto_id}
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
            {movimiento.created_by || "Desconocido"}
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium text-muted-foreground">Fecha:</span>{" "}
            {formattedMovementDate}
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