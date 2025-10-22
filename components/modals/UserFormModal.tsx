"use client"

import { useState, useEffect } from "react"
import { ModalBase } from "./ModalBase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type UserFormData = {
  nombre: string
  correo: string
  rol: "admin" | "ventas" | "almacén"
  active: boolean
}

type UserFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialData?: UserFormData
  onSubmit: (data: UserFormData) => void
}

export function UserFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: UserFormModalProps) {
  const [form, setForm] = useState<UserFormData>({
    nombre: "",
    correo: "",
    rol: "ventas",
    active: true,
  })

  useEffect(() => {
    if (initialData) setForm(initialData)
    else setForm({ nombre: "", correo: "", rol: "ventas", active: true })
  }, [initialData])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "active" ? value === "true" : value,
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <ModalBase
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Agregar Usuario" : "Editar Usuario"}
      description={mode === "create" ? "Completa los campos para registrar un nuevo usuario." : "Modifica los datos del usuario."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">Correo</Label>
          <Input type="email" name="correo" value={form.correo} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rol">Rol</Label>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm shadow-sm"
            required
          >
            <option value="admin">Administrador</option>
            <option value="ventas">Ventas</option>
            <option value="almacén">Almacén</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="active">Estado</Label>
          <select
            name="active"
            value={form.active.toString()}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm shadow-sm"
            required
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div className="flex justify-end gap-8 pt-4">
          <Button type="button" className="px-8 cursor-pointer" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" className="px-8 cursor-pointer">
            {mode === "create" ? "Agregar" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </ModalBase>
  )
}