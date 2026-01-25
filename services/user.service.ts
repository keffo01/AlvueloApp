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
  }
};