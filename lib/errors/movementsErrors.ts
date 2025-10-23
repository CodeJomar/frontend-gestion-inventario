export const MovementsErrors = {
  notFound:{
    status: 404,
    body: {
      status: "error",
      message: "Movimiento no encontrado",
      code: "MOVEMENT_NOT_FOUND",
    },
  },
  createFailed: {
    status: 500,
    body: {
      status: "error",
      message: "Error al crear movimiento",
      code: "MOVEMENT_CREATE_FAILED",
    },
  },
}