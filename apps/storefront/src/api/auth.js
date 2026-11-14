import api from './client';

export async function syncAuthUser() {
  const response = await api.post('/auth/sync');
  return response.data.data;
}
