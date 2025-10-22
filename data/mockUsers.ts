import type { Usuario } from "@/types/users"

export const mockUsers: Usuario[] = [
  { id: "USR-001", nombre: "Ana Torres", correo: "ana@hogarelectric.pe", rol: "admin", active: true },
  { id: "USR-002", nombre: "Luis Pérez", correo: "luis@hogarelectric.pe", rol: "ventas", active: true },
  { id: "USR-003", nombre: "María Gómez", correo: "maria@hogarelectric.pe", rol: "almacén", active: true },
]