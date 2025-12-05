"use client";

import React, { useState } from "react";
import { ModalBase } from "./ModalBase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type CategoriaFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialValue?: string;
  onSubmit: (nombre: string) => boolean;
};

export function CategoriaFormModal({
  open,
  onOpenChange,
  mode,
  initialValue = "",
  onSubmit,
}: CategoriaFormModalProps) {
  const [nombre, setNombre] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const success = onSubmit(nombre);
    if (success) {
      setNombre("");
      onOpenChange(false);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setNombre("");
    }
    onOpenChange(isOpen);
  }

  // Actualizar el valor cuando cambie initialValue
  React.useEffect(() => {
    setNombre(initialValue);
  }, [initialValue, open]);

  return (
    <ModalBase
      open={open}
      onOpenChange={handleOpenChange}
      title={mode === "create" ? "Agregar Categoría" : "Editar Categoría"}
      description={
        mode === "create"
          ? "Ingresa el nombre de la nueva categoría."
          : "Modifica el nombre de la categoría."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la categoría</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Electrodomésticos, Hogar, etc."
            required
            autoFocus
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            {mode === "create" ? "Agregar" : "Guardar"}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}