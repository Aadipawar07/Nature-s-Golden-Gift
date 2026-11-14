import api from './client';

export async function getProfile() {
  const response = await api.get('/auth/me');
  return response.data.data;
}

export async function updateProfile(profile) {
  const response = await api.patch('/auth/me', profile);
  return response.data.data;
}

export async function listAddresses() {
  const response = await api.get('/addresses');
  return response.data.data;
}

export async function saveAddress(address, id) {
  const response = id
    ? await api.patch(`/addresses/${id}`, address)
    : await api.post('/addresses', address);
  return response.data.data;
}

export async function setDefaultAddress(id) {
  const response = await api.post(`/addresses/${id}/default`);
  return response.data.data;
}

export async function deleteAddress(id) {
  const response = await api.delete(`/addresses/${id}`);
  return response.data.data;
}
