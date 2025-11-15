import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_URL}/movimientos/${params.id}/pdf`)

    if (!res.ok) {
      console.error("FastAPI PDF error:", await res.text())
      return NextResponse.json({ error: "No se pudo generar el PDF" }, { status: 500 })
    }

    const blob = await res.blob()

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Movimiento_${params.id}.pdf`,
      },
    })
  } catch (error) {
    console.error("Next.js PDF route error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
