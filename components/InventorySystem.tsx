"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DashboardSection } from "@/components/sections/DashboardSection"
import { ProductsSection } from "@/components/sections/ProductsSection"
import { MovementsSection } from "@/components/sections/MovementsSection"
import { ReportsSection } from "@/components/sections/ReportsSection"

export default function InventorySystem() {
  return (
    <main className="container mx-auto px-4 py-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsSection />
        </TabsContent>
        <TabsContent value="dashboard">
          <DashboardSection />
        </TabsContent>
        <TabsContent value="movements">
          <MovementsSection />
        </TabsContent>
      
      </Tabs>
    </main>
  )
}