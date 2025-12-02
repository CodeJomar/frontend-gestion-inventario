export function descargarExcel(url: string, nombreArchivo: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const ReportesAPI = {
  productosActivos() {
    const url = `${process.env.NEXT_PUBLIC_URL}/reportes/productos/activos`;
    descargarExcel(url, "productos_activos.xlsx");
  },

  productosInactivos() {
    const url = `${process.env.NEXT_PUBLIC_URL}/reportes/productos/inactivos`;
    descargarExcel(url, "productos_inactivos.xlsx");
  },

  movimientosEntrada() {
    const url = `${process.env.NEXT_PUBLIC_URL}/reportes/movimientos/entrada`;
    descargarExcel(url, "movimientos_entrada.xlsx");
  },

  movimientosSalida() {
    const url = `${process.env.NEXT_PUBLIC_URL}/reportes/movimientos/salida`;
    descargarExcel(url, "movimientos_salida.xlsx");
  },
};
