export const productsErrors = {
  notFound: {
    status: 404,
    body: {
      status: "error",
      message: "Producto no encontrado",
      code: "PRODUCT_NOT_FOUND",
    },
  },
    createFailed: {
    status: 500,
    body: {
      status: "error",
      message: "Error al crear producto",
      code: "PRODUCT_CREATE_FAILED",
    },
  },
  updateFailed: {
    status: 500,
    body: {
      status: "error",
      message: "Error al actualizar producto",
      code: "PRODUCT_UPDATE_FAILED",
    },
  },
  deleteFailed: {
    status: 500,
    body: {
      status: "error",
      message: "Error al eliminar producto",
      code: "PRODUCT_DELETE_FAILED",
    },
  },
}