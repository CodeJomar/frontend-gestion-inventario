export type Usuario = {
  id: string
  nombre: string
  correo: string
  rol: "admin" | "ventas" | "almacén"
  active: boolean
}