import api from './client';

export async function syncAuthUser(name) {
  const response = await api.post('/auth/sync', name ? { name } : {});
  return response.data.data;
}
