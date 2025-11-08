"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, ToggleLeft, ToggleRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { UserFormModal } from "@/components/modals/UserFormModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "@/lib/services/axios";
import { toast } from "sonner";

type UsuarioApi = {
  id: string;
  email: string;
  nombres: string;
  apellidos: string | null;
  usuario: string | null;
  dni: string | null;
  celular: string | null;
  rol: string;
  active: boolean;
};

export default function UsuariosPage() {
  const queryClient = useQueryClient();
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const api = await createApiClient();
      const res = await api.get("/usuarios/");
      return res.data;
    },
  });

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<UsuarioApi | null>(null);
  const [users, setUsers] = useState<UsuarioApi[]>([]);

  useEffect(() => {
    if (apiData) {
      // Normalize DNI to always be a string
      const normalizedUsers = apiData.map((user: UsuarioApi) => ({
        ...user,
        dni: user.dni !== null && user.dni !== undefined 
          ? typeof user.dni === "number" ? user.dni.toString() : user.dni
          : null
      }));
      setUsers(normalizedUsers);
    }
  }, [apiData]);

  function handleAddUser() {
    setModalMode("create");
    setSelectedUser(null);
    setModalOpen(true);
  }

  function handleEditUser(user: UsuarioApi) {
    setModalMode("edit");
    setSelectedUser(user);
    setModalOpen(true);
  }

  async function toggleActive(id: string) {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) return;

    const oldValue = users[userIndex].active;

    setUsers((prev) => {
      const newUsers = [...prev];
      newUsers[userIndex] = { ...newUsers[userIndex], active: !oldValue };
      return newUsers;
    });

    try {
      const api = await createApiClient();
      await api.put(`/usuarios/${id}`, { active: !oldValue });
      toast.success(`El usuario ha sido ${!oldValue ? "activado" : "desactivado"}`);
      queryClient.invalidateQueries(["usuarios"]);
    } catch (err: unknown) {
      setUsers((prev) => {
        const newUsers = [...prev];
        newUsers[userIndex] = { ...newUsers[userIndex], active: oldValue };
        return newUsers;
      });

      if (axios.isAxiosError(err)) {
        toast.warning(err.response?.data?.detail ?? "Something went wrong");
      } else {
        console.error("Unknown error:", err);
      }
    }
  }

  const filtered = users.filter((u) =>
    `${u.nombres} ${u.apellidos} ${u.email} ${u.rol}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, correo o rol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Button onClick={handleAddUser}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-4 text-left">Nombre</th>
              <th className="px-4 py-4 text-left">Usuario</th>
              <th className="px-4 py-4 text-left">Correo</th>
              <th className="px-4 py-4 text-left">DNI</th>
              <th className="px-4 py-4 text-left">Rol</th>
              <th className="px-4 py-4 text-center">Estado</th>
              <th className="px-4 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-4 h-6 bg-gray-200 rounded">&nbsp;</td>
                  ))}
                </tr>
              ))}

            {!isLoading && error && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-red-600">
                  Error al cargar los usuarios. Por favor intente nuevamente.
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              filtered.map((user, index) => (
                <tr key={user.id ?? index} className={user.active ? "" : "opacity-50"}>
                  <td className="px-4 py-4 font-medium">{user.nombres} {user.apellidos ?? "-"}</td>
                  <td className="px-4 py-4 text-muted-foreground">{user.usuario ?? "-"}</td>
                  <td className="px-4 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-4 text-muted-foreground">{user.dni ?? "-"}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">{user.rol}</span>
                  </td>
                  <td className="w-1/6 py-4 text-center">
                    <button onClick={() => toggleActive(user.id)} className="flex items-center gap-2 text-sm font-medium justify-center">
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
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Button size="sm" variant="outline" disabled={!user.active} onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />Editar
                    </Button>
                  </td>
                </tr>
              ))}

            {!isLoading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedUser || undefined}
        onSubmit={async (data) => {
          try {
            const api = await createApiClient();

            if (modalMode === "create") {
              // Build payload with all fields
              const payload = {
                nombres: data.nombres,
                apellidos: data.apellidos || null,
                usuario: data.usuario || null,
                dni: data.dni ? (typeof data.dni === "number" ? data.dni.toString() : data.dni) : null,
                celular: data.celular || null,
                email: data.email,
                password: data.password,
                rol: data.rol,
                active: data.active,
              };

              console.log("Creating user with payload:", payload);

              const res = await api.post("/usuarios/", payload);
              toast.success("Usuario creado correctamente");
              setUsers((prev) => [...prev, res.data]);
            } else {
              const { id, email, password, ...updateData } = data;
              const payload: Record<string, any> = {};

              Object.entries(updateData).forEach(([key, value]) => {
                // Only include changed values, not empty strings
                if (value !== "" && value !== null && value !== undefined) {
                  // Handle active conversion
                  if (key === "active") {
                    payload[key] = typeof value === "string" ? value === "true" : value;
                  } 
                  // Handle dni conversion - always send as string
                  else if (key === "dni") {
                    payload[key] = typeof value === "number" ? value.toString() : value;
                  }
                  // Handle other fields
                  else {
                    payload[key] = value;
                  }
                }
              });

              if (Object.keys(payload).length === 0) {
                toast.warning("No hay campos para actualizar");
                return;
              }

              const res = await api.put(`/usuarios/${id}`, payload);
              toast.success(res.data.mensaje);

              setUsers((prev) =>
                prev.map((u) => (u.id === id ? res.data.usuario : u))
              );
            }

            queryClient.invalidateQueries(["usuarios"]);
            setModalOpen(false);
          } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
              const detail = err.response?.data?.detail;
              console.error("API Error:", err.response?.data);
              
              // Handle different error formats
              let errorMessage = "Error en la operación";
              if (typeof detail === "string") {
                errorMessage = detail;
              } else if (Array.isArray(detail)) {
                errorMessage = detail.map(e => e.msg || e.message).join(", ");
              }
              
              toast.error(errorMessage);
            } else {
              console.error("Unknown error:", err);
              toast.error("Error desconocido");
            }
          }
        }}
      />
    </div>
  );
}