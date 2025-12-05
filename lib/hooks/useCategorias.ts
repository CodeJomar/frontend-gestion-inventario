"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const DEFAULT_CATEGORIAS = [
  "Cocina",
  "Limpieza",
  "Lavandería",
  "Climatización",
  "Belleza Personal",
  "Cuidado del Hogar",
  "Electrodomésticos Pequeños",
  "Entretenimiento",
  "Oficina y Tecnología",
  "Otros"
];

const STORAGE_KEY = "inventario_categorias";

export function useCategorias() {
  const [categorias, setCategorias] = useState<string[]>(DEFAULT_CATEGORIAS);
  const [loading, setLoading] = useState(false);

  // Cargar categorías del localStorage al inicializar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedCategorias = JSON.parse(stored);
        if (Array.isArray(parsedCategorias) && parsedCategorias.length > 0) {
          setCategorias(parsedCategorias);
        }
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
      toast.error("Error cargando categorías guardadas");
    }
  }, []);

  // Guardar categorías en localStorage
  const saveToStorage = (newCategorias: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategorias));
    } catch (error) {
      console.error("Error guardando categorías:", error);
      toast.error("Error guardando categorías");
    }
  };

  // Agregar nueva categoría
  const agregarCategoria = (nombre: string): boolean => {
    const nombreTrimmed = nombre.trim();
    
    if (!nombreTrimmed) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return false;
    }

    if (categorias.some(cat => cat.toLowerCase() === nombreTrimmed.toLowerCase())) {
      toast.error("Esta categoría ya existe");
      return false;
    }

    setLoading(true);
    const nuevasCategorias = [...categorias, nombreTrimmed];
    setCategorias(nuevasCategorias);
    saveToStorage(nuevasCategorias);
    setLoading(false);
    toast.success("Categoría agregada correctamente");
    return true;
  };

  // Editar categoría existente
  const editarCategoria = (index: number, nuevoNombre: string): boolean => {
    const nombreTrimmed = nuevoNombre.trim();
    
    if (!nombreTrimmed) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return false;
    }

    if (index < 0 || index >= categorias.length) {
      toast.error("Categoría no encontrada");
      return false;
    }

    // Verificar si el nuevo nombre ya existe (excepto la categoría actual)
    const existeOtra = categorias.some((cat, i) => 
      i !== index && cat.toLowerCase() === nombreTrimmed.toLowerCase()
    );

    if (existeOtra) {
      toast.error("Ya existe otra categoría con este nombre");
      return false;
    }

    setLoading(true);
    const nuevasCategorias = [...categorias];
    nuevasCategorias[index] = nombreTrimmed;
    setCategorias(nuevasCategorias);
    saveToStorage(nuevasCategorias);
    setLoading(false);
    toast.success("Categoría actualizada correctamente");
    return true;
  };

  // Eliminar categoría
  const eliminarCategoria = (index: number): boolean => {
    if (index < 0 || index >= categorias.length) {
      toast.error("Categoría no encontrada");
      return false;
    }

    if (categorias.length === 1) {
      toast.error("No puedes eliminar la última categoría");
      return false;
    }

    setLoading(true);
    const nuevasCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(nuevasCategorias);
    saveToStorage(nuevasCategorias);
    setLoading(false);
    toast.success("Categoría eliminada correctamente");
    return true;
  };

  // Resetear a categorías por defecto
  const resetearCategorias = () => {
    setLoading(true);
    setCategorias(DEFAULT_CATEGORIAS);
    saveToStorage(DEFAULT_CATEGORIAS);
    setLoading(false);
    toast.success("Categorías restablecidas a valores por defecto");
  };

  return {
    categorias,
    loading,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    resetearCategorias
  };
}