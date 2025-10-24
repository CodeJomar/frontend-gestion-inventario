"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Eye, EyeOff, Package } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { login, loading, error } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const result = await login(email, password);

    if (!result.error) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(redirectTo);
    }
  }

  return (
    <div className="h-screen w-full bg-background">
      <div className="h-full w-full flex flex-col md:flex-row">
        <div className="h-full w-full md:w-1/2 flex flex-col">
          <div className="w-full flex-1 flex items-center justify-center">
            <div className="w-full max-w-[320px] h-1/2 flex flex-col justify-center mb-12">
              <h2 className="text-2xl font-semibold mb-3 text-black text-center">¡Bienvenido!</h2>
              <p className="text-sm text-gray-600 mb-8 text-center -mt-1">
                Por favor, inicia sesión para continuar.
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="email"
                    className="pl-10 w-full"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && <div className="text-destructive text-sm">{error}</div>}

                <div className="flex justify-center">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Entrando..." : "Iniciar Sesión"}
                  </Button>
                </div>

                <div className="mt-2 text-sm text-center">
                  ¿No tienes cuenta?{" "}
                  <a href="/auth/register" className="text-primary font-semibold">
                    Regístrate
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="h-full w-full md:w-1/2 relative bg-cyan-950 text-white p-8 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-[-58%] transform rotate-12 opacity-15"
            style={{ width: "1400px", height: "1400px" }}
          >
            <Package className="w-full h-full text-white" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="mt-16 ml-16">
              <div className="flex items-center gap-3">
                <Package className="h-9 w-9 text-white" />
                <div>
                  <h2 className="text-white text-xl md:text-2xl font-extrabold leading-tight">
                    Hogarelectric
                  </h2>
                  <span className="block text-sm text-white/80 font-medium">
                    Sistema de Inventario
                  </span>
                </div>
              </div>

              <p className="text-sm mt-6 text-white/90 max-w-2xl">
                Gestiona tu inventario de manera eficiente y sencilla con nuestro sistema
                especializado para Hogarelectric. Mantén todo bajo control y optimiza tus
                operaciones diarias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}