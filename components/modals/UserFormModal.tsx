"use client";

import { useState, useEffect } from "react";
import { ModalBase } from "./ModalBase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type UserFormData = {
  id: string;
  email: string;
  nombres: string;
  apellidos: string | null;
  usuario: string | null;
  dni: string | null;
  celular: string | null;
  rol: string;
  active: boolean;
  password?: string;
};

type UserFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
};

export function UserFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: UserFormModalProps) {
  const [form, setForm] = useState<UserFormData>({
    id: "",
    nombres: "",
    apellidos: null,
    usuario: null,
    dni: null,
    celular: null,
    email: "",
    rol: "Empleado",
    active: true,
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: "",
        nombres: "",
        apellidos: null,
        usuario: null,
        dni: null,
        celular: null,
        email: "",
        rol: "Empleado",
        active: true,
        password: "",
      });
    }
  }, [initialData, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "dni") {
      // Only allow digits and limit to 8 characters
      const digitsOnly = value.replace(/\D/g, "").slice(0, 8);
      setForm((prev) => ({
        ...prev,
        dni: digitsOnly === "" ? null : digitsOnly,
      }));
      return;
    }

    if (name === "celular") {
      // Only allow digits for phone numbers
      const digitsOnly = value.replace(/\D/g, "");
      setForm((prev) => ({
        ...prev,
        celular: digitsOnly === "" ? null : digitsOnly,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "active"
          ? value === "true"
          : value === "" ? null : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate DNI if provided
    if (form.dni && form.dni.length !== 8) {
      alert("El DNI debe tener exactamente 8 dígitos");
      return;
    }
    
    // Validate password for new users
    if (mode === "create" && (!form.password || form.password.length < 6)) {
      alert("La contraseña es requerida y debe tener al menos 6 caracteres");
      return;
    }
    
    onSubmit(form);
  }

  return (
    <ModalBase
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Agregar Usuario" : "Editar Usuario"}
      description={
        mode === "create"
          ? "Completa los campos para registrar un nuevo usuario."
          : "Modifica los datos del usuario."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombres">Nombres *</Label>
          <Input
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            name="apellidos"
            value={form.apellidos ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="usuario">Usuario</Label>
          <Input
            name="usuario"
            value={form.usuario ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dni">DNI (8 dígitos)</Label>
          <Input
            name="dni"
            type="text"
            inputMode="numeric"
            pattern="\d{8}"
            value={form.dni ?? ""}
            onChange={handleChange}
            placeholder="12345678"
            maxLength={8}
          />
          {form.dni && form.dni.length > 0 && form.dni.length < 8 && (
            <p className="text-xs text-red-600">
              El DNI debe tener 8 dígitos ({form.dni.length}/8)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="celular">Celular</Label>
          <Input
            name="celular"
            type="text"
            inputMode="numeric"
            value={form.celular ?? ""}
            onChange={handleChange}
            placeholder="999999999"
            maxLength={9}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            readOnly={mode === "edit"}
            className={mode === "edit" ? "bg-gray-100 cursor-not-allowed" : ""}
          />
        </div>

        {mode === "create" && (
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              type="password"
              name="password"
              value={form.password ?? ""}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="rol">Rol *</Label>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm shadow-sm"
            required
          >
            <option value="Admin">Administrador</option>
            <option value="Empleado">Empleado</option>
          </select>
        </div>

        {mode === "edit" && (
          <div className="space-y-2">
            <Label htmlFor="active">Estado *</Label>
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
        )}

        <div className="flex justify-end gap-8 pt-4">
          <Button
            type="button"
            className="px-8 cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" className="px-8 cursor-pointer">
            {mode === "create" ? "Agregar" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}