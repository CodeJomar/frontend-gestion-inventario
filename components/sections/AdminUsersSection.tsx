"use client"

import { useEffect, useState } from "react"
import { Edit, Plus, Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"
import { UserFormModal } from "@/components/modals/UserFormModal"
import { mockUsers } from "@/data/mockUsers"

type UiUser = {
  id: string
  nombre: string
  correo: string
  rol: string
  active: boolean
}

export function AdminUsersSection() {
  const [users, setUsers] = useState<UiUser[]>(mockUsers)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("mockUsers")
    if (stored) setUsers(JSON.parse(stored))
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedUser, setSelectedUser] = useState<UiUser | null>(null)

  function handleAddUser() {
    setModalMode("create")
    setSelectedUser(null)
    setModalOpen(true)
  }

  function handleEditUser(user: UiUser) {
    setModalMode("edit")
    setSelectedUser(user)
    setModalOpen(true)
  }

  useEffect(() => {
    localStorage.setItem("mockUsers", JSON.stringify(users))
  }, [users])

  function toggleActive(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    )
  }

  const filtered = users.filter((u) =>
    `${u.nombre} ${u.correo} ${u.rol}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, correo o rol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" size="sm" className="cursor-pointer">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Button className="cursor-pointer" onClick={handleAddUser}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py- text-left">Nombre</th>
              <th className="px-4 py-4 text-left">Correo</th>
              <th className="px-4 py-4 text-left">Rol</th>
              <th className="px-4 py-4 text-center">Estado</th>
              <th className="px-4 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className={user.active ? "" : "opacity-50"}>
                <td className="px-4 py-4 font-medium">{user.nombre}</td>
                <td className="px-4 py-4 text-muted-foreground">{user.correo}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                    {user.rol}
                  </span>
                </td>

                <td className="w-1/6 py-4 text-center">
                  <div className="flex justify-center mr-6">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className="flex items-center gap-2 text-sm font-medium ml-8 cursor-pointer"
                    >
                      {user.active ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-primary" />
                          <span className="text-primary">Activo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-destructive" />
                          <span className="text-destructive">Inactivo</span>
                        </>
                      )}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-4 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                    disabled={!user.active}
                    onClick={() => { handleEditUser(user) }}
                  >
                    <Edit className="h-4 w-4" />Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground border-t">
            No se encontraron usuarios.
          </div>
        )}
      </div>
      <UserFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedUser || undefined}
        onSubmit={(data) => {
          if (modalMode === "create") {
            setUsers((prev) => [...prev, { ...data, id: `USR-${prev.length + 1}` }])
          } else {
            setUsers((prev) =>
              prev.map((u) => (u.id === data.id ? data : u))
            )
          }
        }}
      />
    </div>
  )
}