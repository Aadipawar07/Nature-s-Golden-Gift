let tokenProvider = async () => null;
let clientPromise;

export function setTokenProvider(provider) {
  tokenProvider = provider;
}

function getClient() {
  if (!clientPromise) {
    clientPromise = import('axios').then(({ default: axios }) => {
      const client = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
        timeout: 10000,
      });

      client.interceptors.request.use(async (config) => {
        const token = await tokenProvider();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      client.interceptors.response.use(
        (response) => response,
        (error) => {
          const message =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            (error.code === 'ECONNABORTED'
              ? 'The request timed out. Please try again.'
              : 'Something went wrong. Please try again.');
          return Promise.reject(
            Object.assign(new Error(message), { cause: error }),
          );
        },
      );
      return client;
    });
  }
  return clientPromise;
}

const api = {
  get: (...args) => getClient().then((client) => client.get(...args)),
  post: (...args) => getClient().then((client) => client.post(...args)),
  patch: (...args) => getClient().then((client) => client.patch(...args)),
  delete: (...args) => getClient().then((client) => client.delete(...args)),
};

export default api;
