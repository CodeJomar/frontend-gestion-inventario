"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, Users, CircleUserRound, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const CLIENT_NAME = "Hogarelectric";

export default function HeaderClient() {

  const { user, logout } = useAuth();

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

            {user && (
              <div
                className="flex text-neutral-500 items-center gap-2 px-3 py-1 rounded bg-transparent"
                aria-hidden="true"
              >
                <CircleUserRound className="h-5 w-5" />
                <span className="text-sm">{user.user_metadata?.full_name ?? user.email}</span>
              </div>
            )}

            <Button variant="outline" size="sm" className="cursor-pointer">
              <Users className="h-4 w-4 mr-2" />
              Ver Usuarios
            </Button>

            {user ? (
              <Button
                onClick={logout}
                size="sm" className="cursor-pointer bg-destructive"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
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
