"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DashboardSection } from "@/components/sections/DashboardSection"
import { ProductsSection } from "@/components/sections/ProductsSection"
import { MovementsSection } from "@/components/sections/MovementsSection"
import { ReportsSection } from "@/components/sections/ReportsSection"
import { ArrowDownCircle, BarChart3, Package, TrendingUp, Users } from "lucide-react"
import { AdminUsersSection } from "./sections/AdminUsersSection"
import { useState } from "react"

export default function InventorySystem() {

  const isAdmin = true
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <main className="container mx-auto px-4 py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

        <TabsList className="grid w-full grid-cols-5 lg:w-[800px]">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 cursor-pointer">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2 cursor-pointer">
            <Package className="h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2 cursor-pointer">
            <ArrowDownCircle className="h-4 w-4" />
            Movimientos
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 cursor-pointer">
            <TrendingUp className="h-4 w-4" />
            Reportes
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users" className="flex items-center gap-2 cursor-pointer font-semibold">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="products">
          <ProductsSection />
        </TabsContent>
        <TabsContent value="dashboard">
          <DashboardSection />
        </TabsContent>
        <TabsContent value="movements">
          <MovementsSection setActiveTab={setActiveTab} />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsSection />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="users">
            <AdminUsersSection />
          </TabsContent>
        )}
      </Tabs>
    </main>
  )
}