export const NETWORK_ERROR_MESSAGE = 'Não foi possível conectar ao servidor. Tente novamente em instantes.';

export async function apiFetch(...args) {
  try {
    return await fetch(...args);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(NETWORK_ERROR_MESSAGE);
    }
    throw error;
  }
}
