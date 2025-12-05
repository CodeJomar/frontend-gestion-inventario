"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

type PasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const { 
    user, 
    userApiData, 
    profileData, 
    loading, 
    fetchingUserData, 
    updateUserProfile,
    updatePassword,
    setProfileData 
  } = useUserProfile();
  
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * Maneja los cambios en los campos del formulario de perfil (nombres, apellidos).
   * Actualiza el estado local del perfil cuando el usuario escribe en los inputs.
   */
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Maneja los cambios en los campos del formulario de contraseña.
   * Actualiza el estado local del formulario de contraseña.
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Maneja la actualización del perfil del usuario.
   * Actualiza nombres y apellidos en la API y en Supabase.
   * El hook useUserProfile maneja validaciones, errores y feedback al usuario.
   */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(profileData.nombres, profileData.apellidos);
  };

  /**
   * Maneja el cambio de contraseña del usuario.
   * Valida que las contraseñas coincidan y cumplan requisitos mínimos.
   * Utiliza Supabase Auth para actualizar la contraseña
   */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    await updatePassword(passwordForm.newPassword);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil</p>
          <Link href="/auth/login">
            <Button className="mt-4">Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (fetchingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Administra tu información personal y configuración de cuenta
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Actualiza tu información básica de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  El correo electrónico no se puede modificar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  name="nombres"
                  value={profileData.nombres}
                  onChange={handleProfileChange}
                  placeholder="Ingresa tus nombres"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  name="apellidos"
                  value={profileData.apellidos}
                  onChange={handleProfileChange}
                  placeholder="Ingresa tus apellidos"
                />
              </div>

              <Separator />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Mantén tu cuenta segura con una contraseña fuerte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>

              <Separator />

              <Button 
                type="submit" 
                disabled={loading || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="w-full"
                variant="outline"
              >
                {loading ? (
                  <>
                    <Lock className="h-4 w-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Información de la Cuenta */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>
            Detalles de tu cuenta en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                ID de Usuario
              </Label>
              <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                {user.id}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Fecha de Registro
              </Label>
              <p className="text-sm p-2 mt-1">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No disponible'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}