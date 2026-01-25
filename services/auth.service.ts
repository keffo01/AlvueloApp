import { authRequest } from './api.service';

export interface AuthResponse {
  token: string;
  user?: {
    email: string;
    name?: string;
    [key: string]: any;
  };
  message?: string;
  statusCode: number;
  isNewUser: boolean;
  hasAddress?: boolean;
}

export const AuthService = {
  /**
   * Registro de nuevos usuarios
   * @param payload Objeto con name, email, password, etc.
   */
  register: async (payload: object): Promise<AuthResponse> => {
    return authRequest('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Inicio de sesión
   * @param payload Objeto con email y password
   */
  login: async (payload: object): Promise<AuthResponse> => {
    return authRequest('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Recuperación de contraseña
   * @param email Correo electrónico del usuario
   */
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    return authRequest('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Validación de token o refresco de sesión
   * Útil para cuando la app inicia y queremos ver si el token aún sirve
   */
  validateSession: async (token: string): Promise<AuthResponse> => {
    return authRequest('/validate-session', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
   * Cambio de contraseña dentro de la app
   */
  changePassword: async (email: string, oldPass: string, newPass: string): Promise<AuthResponse> => {
    return authRequest('/change-password', {
      method: 'POST',
      body: JSON.stringify({ email, oldPass, newPass }),
    });
  }
};