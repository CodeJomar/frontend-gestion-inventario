"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { 
  getUserByEmail, 
  updateUserProfile as updateUserProfileApi,
  type UsuarioApi 
} from "@/lib/services/users";

export type UserProfileData = {
  email: string;
  nombres: string;
  apellidos: string;
  full_name: string;
};

export function useUserProfile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [userApiData, setUserApiData] = useState<UsuarioApi | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData>({
    email: "",
    nombres: "",
    apellidos: "",
    full_name: "",
  });

  // Obtener datos del usuario desde la API
  useEffect(() => {
    async function fetchUserData() {
      if (user?.email) {
        setFetchingUserData(true);
        try {
          const currentUser = await getUserByEmail(user.email);
          
          if (currentUser) {
            setUserApiData(currentUser);
            setProfileData({
              email: currentUser.email,
              nombres: currentUser.nombres,
              apellidos: currentUser.apellidos || "",
              full_name: `${currentUser.nombres} ${currentUser.apellidos || ""}`.trim(),
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error al cargar datos del usuario");
        } finally {
          setFetchingUserData(false);
        }
      }
    }

    fetchUserData();
  }, [user]);

  const updateUserProfile = async (nombres: string, apellidos: string) => {
    if (!userApiData) {
      throw new Error("No se encontraron datos del usuario");
    }

    setLoading(true);
    
    try {
      // Actualizar en la API de Python usando el servicio
      await updateUserProfileApi(userApiData.id, userApiData, {
        nombres,
        apellidos: apellidos || null,
      });

      // Actualizar metadatos en Supabase Auth
      const fullName = `${nombres} ${apellidos}`.trim();
      await updateProfile({
        full_name: fullName,
      });

      // Actualizar el estado local
      setProfileData(prev => ({
        ...prev,
        nombres,
        apellidos,
        full_name: fullName,
      }));

      setUserApiData(prev => prev ? {
        ...prev,
        nombres,
        apellidos: apellidos || null,
      } : null);

      toast.success("Perfil actualizado correctamente");
      
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    
    try {
      await changePassword(newPassword);
      toast.success("Contraseña actualizada correctamente");
      return { success: true };
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error al cambiar la contraseña");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userApiData,
    profileData,
    loading,
    fetchingUserData,
    updateUserProfile,
    updatePassword,
    setProfileData,
  };
}