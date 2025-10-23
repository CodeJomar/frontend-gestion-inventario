"use client"

import { useState, useEffect } from "react"
import { ModalBase } from "./ModalBase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { mockUsers } from "@/data/mockUsers"

type MovementFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productos: { id: string; nombre: string }[]
  onSubmit: (data: any) => void
}

export function MovementFormModal({
  open,
  onOpenChange,
  productos,
  onSubmit,
}: MovementFormModalProps) {
  const [form, setForm] = useState({
    producto_id: "",
    tipo_movimiento: "",
    cantidad: 1,
    motivo: "",
    usuario: "",
  })

  const motivosEntrada = [
    { label: "Compra de proveedor", value: "reposición" },
    { label: "Devolución de cliente", value: "devolución" },
    { label: "Ajuste por error", value: "ajuste" },
  ]

  const motivosSalida = [
    { label: "Venta directa", value: "venta" },
    { label: "Ajuste por error", value: "ajuste" },
  ]

  const motivos = form.tipo_movimiento === "entrada"
    ? motivosEntrada
    : form.tipo_movimiento === "salida"
      ? motivosSalida
      : []

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const now = new Date()
    const payload = {
      ...form,
      fecha: now.toISOString(),
      dia: now.getUTCDate(),
      mes: now.getUTCMonth() + 1,
      anio: now.getUTCFullYear(),
      hora: now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
    }

    onSubmit(payload)
    onOpenChange(false)
  }

  return (
    <ModalBase
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar Movimiento"
      description="Completa los campos para registrar una entrada o salida de producto."
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-2">
          <Label htmlFor="producto_id">Producto</Label>
          <select
            name="producto_id"
            value={form.producto_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-sm shadow-sm"
          >
            <option value="">Selecciona un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_movimiento">Tipo</Label>
            <select
              name="tipo_movimiento"
              value={form.tipo_movimiento}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm shadow-sm"
            >
              <option value="">Selecciona tipo</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivo">Motivo</Label>
          <select
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-sm shadow-sm"
          >
            <option value="">Selecciona motivo</option>
            {motivos.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="usuario">Usuario</Label>
          <select
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-sm shadow-sm"
          >
            <option value="">Selecciona usuario</option>
            {mockUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-8 pt-4">
          <Button className="cursor-pointer px-8" type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="cursor-pointer px-8" type="submit">Registrar</Button>
        </div>
      </form>
    </ModalBase>
  )
}