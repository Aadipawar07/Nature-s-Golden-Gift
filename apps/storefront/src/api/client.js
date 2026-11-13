const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const buildUrl = (path, params) => {
  const apiBase = new URL(
    baseURL.endsWith('/') ? baseURL : `${baseURL}/`,
    window.location.origin,
  );
  const url = new URL(path.replace(/^\/+/, ''), apiBase);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') {
            url.searchParams.append(key, String(item));
          }
        });
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

const request = async (
  path,
  { method = 'GET', params, body, headers } = {},
) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(buildUrl(path, params), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const payload = response.headers
      .get('content-type')
      ?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        payload?.error?.message ||
        payload?.message ||
        'Unable to load catalogue';
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    return {
      data: payload,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timed out');
      timeoutError.status = 408;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const client = {
  get: (url, config) => request(url, { ...config, method: 'GET' }),
  post: (url, data, config) =>
    request(url, { ...config, method: 'POST', body: data }),
  put: (url, data, config) =>
    request(url, { ...config, method: 'PUT', body: data }),
  patch: (url, data, config) =>
    request(url, { ...config, method: 'PATCH', body: data }),
  delete: (url, config) => request(url, { ...config, method: 'DELETE' }),
};

export default client;
