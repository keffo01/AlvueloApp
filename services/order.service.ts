import { orderRequest } from './api.service';

export const orderService = {

  createOrder: async (payload: any) => {
    try {
      const data = await orderRequest('/create-order', { // ⚠️ Cambia esto por la ruta real de tu API Gateway
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data;
    } catch (error: any) {
        console.error("Error en el servicio de ordenes:", error);
      throw new Error(error.response?.data?.message || "Error al procesar la orden");
    }
  },
}