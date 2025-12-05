import { createApiClient } from "./axios";

export type UsuarioApi = {
  id: string;
  email: string;
  nombres: string;
  apellidos: string | null;
  usuario: string | null;
  dni: string | null;
  celular: string | null;
  rol: string;
  active: boolean;
};

export type UpdateUserProfileRequest = {
  nombres: string;
  apellidos: string | null;
};

/**
 * Obtiene todos los usuarios desde la API
 */
export async function getAllUsers(): Promise<UsuarioApi[]> {
  const api = await createApiClient();
  const response = await api.get("/usuarios/");
  return response.data;
}

/**
 * Encuentra un usuario por email
 */
export async function getUserByEmail(email: string): Promise<UsuarioApi | null> {
  const users = await getAllUsers();
  return users.find(user => user.email === email) || null;
}

/**
 * Actualiza un usuario por ID
 */
export async function updateUserById(
  userId: string, 
  userData: Partial<UsuarioApi>
): Promise<UsuarioApi> {
  const api = await createApiClient();
  const response = await api.put(`/usuarios/${userId}/`, userData);
  return response.data;
}

/**
 * Actualiza el perfil de un usuario
 */
export async function updateUserProfile(
  userId: string,
  currentUserData: UsuarioApi,
  updates: UpdateUserProfileRequest
): Promise<UsuarioApi> {
  const updatedData = {
    ...currentUserData,
    nombres: updates.nombres,
    apellidos: updates.apellidos,
  };
  
  return await updateUserById(userId, updatedData);
}