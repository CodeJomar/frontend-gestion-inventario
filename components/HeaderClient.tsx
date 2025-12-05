"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, CircleUserRound, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getUserByEmail, type UsuarioApi } from "@/lib/services/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CLIENT_NAME = "Hogarelectric";

export default function HeaderClient() {

  const { user, logout } = useAuth();
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [userApiData, setUserApiData] = useState<UsuarioApi | null>(null);

  // Obtener datos del usuario desde la API
  useEffect(() => {
    async function fetchUserData() {
      if (user?.email) {
        try {
          const currentUser = await getUserByEmail(user.email);
          if (currentUser) {
            setUserApiData(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }

    fetchUserData();
  }, [user]);

  const displayName = userApiData 
    ? `${userApiData.nombres} ${userApiData.apellidos || ""}`.trim()
    : user?.user_metadata?.full_name ?? user?.email;

  async function handleLogout() {
    setLoggingOut(true)

    router.push("/auth/login")
    await logout()
    setLoggingOut(false)
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-balance">
                {CLIENT_NAME}: Sistema de Inventario
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-3 py-2 h-auto text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  >
                    <CircleUserRound className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/perfil" 
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className={`h-4 w-4 ${loggingOut ? 'animate-spin' : ''}`} />
                    {loggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              <Link href="/auth/login" className="cursor-pointer">
                <Button size="sm" className="cursor-pointer">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
