import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProducts } from '../api/products';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Skeleton from '../components/ui/Skeleton';
import useApi from '../hooks/useApi';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);
  const request = useCallback(
    () => listProducts({ sort, page, limit: 24 }),
    [page, sort],
  );
  const { data, loading, error, retry } = useApi(request);
  const products = data?.data || [];
  const meta = data?.meta || { page, pages: 0 };

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) =>
      params.set(key, String(value)),
    );
    setSearchParams(params);
  }

  return (
    <section className="container-shell py-20 md:py-28">
      <p className="eyebrow">Pick your size</p>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="section-title">Bring the batch home.</h1>
          <p className="mt-4 max-w-xl text-inkSoft">
            Three pack sizes, one single-origin turmeric powder.
          </p>
        </div>
        <Select
          id="sort-products"
          label="Sort products"
          value={sort}
          onChange={(event) =>
            updateParams({ sort: event.target.value, page: 1 })
          }
          options={[
            { value: 'newest', label: 'Newest' },
            { value: 'price-asc', label: 'Price: low to high' },
            { value: 'price-desc', label: 'Price: high to low' },
            { value: 'bestselling', label: 'Bestselling' },
          ]}
        />
      </div>
      {loading ? (
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-96" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-14 rounded-xl border border-status-danger/30 p-8">
          <p role="alert">We could not load the catalogue.</p>
          <button
            className="btn-primary mt-5 rounded-full px-5 py-3"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <p className="mt-14 rounded-xl bg-cream-100 p-8">No products found.</p>
      ) : (
        <>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {meta.pages > 1 ? (
            <div className="mt-10">
              <Pagination
                page={meta.page}
                pages={meta.pages}
                onChange={(value) => updateParams({ page: value })}
              />
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
