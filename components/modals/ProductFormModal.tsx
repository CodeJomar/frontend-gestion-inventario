"use client"

import { useState, useEffect } from "react"
import { ModalBase } from "./ModalBase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"


type ProductFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialData?: {
    sku?: string
    nombre: string
    marca: string
    descripcion: string
    precio: number
    stock: number
    tipo: string
    categoria: string
    imagen_url?: string
  }
  categorias: string[]
  tipos: string[]
  onSubmit: (data: any) => void
}

export function ProductFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  categorias,
  tipos,
  onSubmit,
}: ProductFormModalProps) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    skuSecuencia: "",
    marca: "",
    categoria: "",
    precio: 0,
    stock: 0,
    imagen_url: "",
  })
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }))
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        tipo: "",
        skuSecuencia: "",
        marca: "",
        categoria: "",
        precio: 0,
        stock: 0,
        imagen_url: "",
      })
    }
  }, [initialData])

  function getSkuPrefix(tipo: string) {
    switch (tipo) {
      case "electrodomestico": return "ELE-"
      case "accesorio": return "ACC-"
      case "consumible": return "CON-"
      default: return "GEN-"
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      nombre: form.nombre,
      marca: form.marca,
      categoria: form.categoria,
      descripcion: form.descripcion,
      precio: form.precio,
      stock: form.stock,
      imagen_url: form.imagen_url,
    }

    onSubmit(payload)
    onOpenChange(false)
  }

  return (
    <ModalBase
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Agregar Producto" : "Editar Producto"}
      description={mode === "create" ? "Completa los campos para registrar un nuevo producto." : "Modifica los datos del producto."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select onValueChange={(value) => setForm((prev) => ({ ...prev, tipo: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skuSecuencia">SKU</Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {getSkuPrefix(form.tipo)}
              </p>
              <Input
                name="skuSecuencia"
                value={form.skuSecuencia}
                onChange={handleChange}
                placeholder="001"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select onValueChange={(value) => setForm((prev) => ({ ...prev, categoria: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full gap-4">
          <div className="space-y-2 w-1/2">
            <Label htmlFor="marca">Marca</Label>
            <Input
              name="marca"
              value={form.marca}
              onChange={handleChange}
              placeholder="Ej. Samsung, Oster, Mabe"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-1/2">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imagen_url">URL de Imagen</Label>
          <Input name="imagen_url" value={form.imagen_url} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-8 pt-4">
          <Button className="cursor-pointer px-8" type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="cursor-pointer px-8" type="submit">
            {mode === "create" ? "Agregar" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </ModalBase>
  )
}