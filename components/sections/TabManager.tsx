"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, BarChart3, Package, TrendingUp, Users, Building2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TabManager({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = true;

  // Get current tab from path
  const current = pathname.split("/")[1] || "dashboard";
  const [activeTab, setActiveTab] = useState(current);

  // Sync active tab with URL
  useEffect(() => {
    if (activeTab !== current) setActiveTab(current);
  }, [current]);

  const changePage = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <Tabs value={activeTab} onValueChange={changePage} className="space-y-6 mb-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-[900px]">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 cursor-pointer">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="productos" className="flex items-center gap-2 cursor-pointer">
            <Package className="h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="proveedores" className="flex items-center gap-2 cursor-pointer">
            <Building2 className="h-4 w-4" />
            Proveedores
          </TabsTrigger>
          <TabsTrigger value="movimientos" className="flex items-center gap-2 cursor-pointer">
            <ArrowDownCircle className="h-4 w-4" />
            Movimientos
          </TabsTrigger>
          <TabsTrigger value="reportes" className="flex items-center gap-2 cursor-pointer">
            <TrendingUp className="h-4 w-4" />
            Reportes
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="usuarios" className="flex items-center gap-2 cursor-pointer font-semibold">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      <section>{children}</section>
    </main>
  );
}
