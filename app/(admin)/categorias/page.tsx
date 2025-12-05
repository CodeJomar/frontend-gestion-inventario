"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, RotateCcw, Tags } from "lucide-react";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { CategoriaFormModal } from "@/components/modals/CategoriaFormModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CategoriasPage() {
  const {
    categorias,
    loading,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    resetearCategorias,
  } = useCategorias();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmIndex, setConfirmIndex] = useState<number>(-1);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleAgregar() {
    setModalMode("create");
    setSelectedCategoria("");
    setSelectedIndex(-1);
    setModalOpen(true);
  }

  function handleEditar(index: number) {
    setModalMode("edit");
    setSelectedCategoria(categorias[index]);
    setSelectedIndex(index);
    setModalOpen(true);
  }

  function handleEliminar(index: number) {
    setConfirmIndex(index);
    setConfirmOpen(true);
  }

  function confirmEliminar() {
    if (confirmIndex >= 0) {
      eliminarCategoria(confirmIndex);
    }
    setConfirmOpen(false);
    setConfirmIndex(-1);
  }

  function handleModalSubmit(nombre: string): boolean {
    if (modalMode === "create") {
      return agregarCategoria(nombre);
    } else {
      return editarCategoria(selectedIndex, nombre);
    }
  }

  function handleReset() {
    setResetConfirmOpen(true);
  }

  function confirmReset() {
    resetearCategorias();
    setResetConfirmOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Gestión de Categorías
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra las categorías de productos de tu inventario
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <Button onClick={handleAgregar}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      {/* Búsqueda y estadísticas */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            {filteredCategorias.length} de {categorias.length} categorías
          </Badge>
        </div>
      </div>

      {/* Lista de categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorías de productos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCategorias.length > 0 ? (
            <div className="divide-y">
              {filteredCategorias.map((categoria, index) => {
                const originalIndex = categorias.indexOf(categoria);
                return (
                  <div
                    key={`${categoria}-${originalIndex}`}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {originalIndex + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{categoria}</h3>
                        <p className="text-sm text-muted-foreground">
                          Categoría #{originalIndex + 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditar(originalIndex)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminar(originalIndex)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No se encontraron categorías" : "No hay categorías"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "No hay categorías que coincidan con tu búsqueda."
                  : "Comienza agregando tu primera categoría."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAgregar}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primera categoría
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de formulario */}
      <CategoriaFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialValue={selectedCategoria}
        onSubmit={handleModalSubmit}
      />

      {/* Dialog de confirmación eliminar */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar categoría</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la categoría "
              {confirmIndex >= 0 ? categorias[confirmIndex] : ""}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmEliminar}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación reset */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restablecer categorías</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas restablecer todas las categorías a los valores por defecto?
              Se perderán todas las categorías personalizadas que hayas agregado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              Restablecer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}