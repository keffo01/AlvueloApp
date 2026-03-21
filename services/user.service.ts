import { profileRequest } from './api.service';

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  reference: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export const UserService = {
  // Obtener perfil completo
  getProfile: async (email: string) => {
    return profileRequest(`/get-profile?email=${email}`, { method: 'GET' });
  },

  // Guardar o Actualizar dirección (Maneja tanto objeto como array)
  updateAddress: async (email: string, addressData: Address | Address[], hasAddress: boolean = true) => {
    return profileRequest('/update-address', {
      method: 'POST',
      body: JSON.stringify({ email, addressData, hasAddress }),
    });
  },

  // El borrado ahora es simple usando updateAddress enviando la lista filtrada
  deleteAddress: async (email: string, updatedList: Address[]) => {
    return UserService.updateAddress(email, updatedList, updatedList.length > 0);
  },

  /**
   * Sube la imagen de perfil a S3 y actualiza DynamoDB
   * @param email Correo del usuario (ID)
   * @param base64Image Imagen en formato data:image/jpeg;base64,...
   */
  uploadProfilePicture: async (email: string, base64Image: string) => {

   try {
    // Si 'apiRequest' es tu función personalizada que ya maneja errores y JSON:
    const data = await profileRequest('/upload-profile-pic', {
      method: 'POST',
      body: JSON.stringify({ email, image: base64Image }),
    });

    console.log("🔥 Respuesta RAW de API Gateway:", data);

    if (!data || !data.profilePic) {
      throw new Error("Respuesta inesperada del servidor");
    }
    // 'data' ya es el JSON, no hagas data.json()
    return data; 

  } catch (error) {
    console.error("Error en el servicio:", error);
    throw error;
  }

  },

  // En UserService
updatePersonalData: async (payload: { 
  email: string, 
  phoneNumber: string, 
  currentPassword?: string | null, 
  newPassword?: string | null 
}) => {
  try {
    const data = await profileRequest('/update-personal-data', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error: any) {
    // Si tu apiService lanza el error, lo capturamos aquí
    throw new Error(error.response?.data?.message || "Error al actualizar datos");
  }
},
};