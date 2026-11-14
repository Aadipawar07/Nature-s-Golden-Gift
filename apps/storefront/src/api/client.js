import axios from 'axios';

let tokenProvider = async () => null;

export function setTokenProvider(provider) {
  tokenProvider = provider;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await tokenProvider();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Something went wrong. Please try again.');
    return Promise.reject(Object.assign(new Error(message), { cause: error }));
  },
);

export default api;
