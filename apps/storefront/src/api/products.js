import client from './client';

export function listProducts(params) {
  return client.get('/products', { params }).then((response) => response.data);
}

export function getProduct(slug) {
  return client.get(`/products/${slug}`).then((response) => response.data);
}
