export async function downloadMovementPDF(id: string) {
  const res = await fetch(`/api/movements/${id}/pdf`)

  if (!res.ok) {
    throw new Error("Error al descargar PDF")
  }

  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `Movimiento_${id}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()

  window.URL.revokeObjectURL(url)
}
