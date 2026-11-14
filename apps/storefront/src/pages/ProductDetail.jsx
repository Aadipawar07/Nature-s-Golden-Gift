import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import useApi from '../hooks/useApi';
import StickyBuyBar from '../components/layout/StickyBuyBar';
import ProductImage from '../components/product/ProductImage';
import PriceDisplay from '../components/product/PriceDisplay';
import Skeleton from '../components/ui/Skeleton';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const request = useCallback(() => getProduct(slug), [slug]);
  const { data, loading, error, retry } = useApi(request);
  const product = data?.data;
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setSelectedVariant(product?.variants?.[0] || null);
  }, [product]);

  if (loading) {
    return (
      <section className="container-shell py-20 md:py-28">
        <Skeleton className="h-[500px]" />
      </section>
    );
  }
  if (error?.status === 404) return <NotFound />;
  if (error) {
    return (
      <section className="container-shell py-28">
        <p role="alert">We could not load this product.</p>
        <button
          className="btn-primary mt-5 rounded-full px-5 py-3"
          onClick={retry}
        >
          Try again
        </button>
      </section>
    );
  }
  if (!product || !selectedVariant) return <NotFound />;

  return (
    <>
      <section className="container-shell py-20 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-cream-200">
            <ProductImage
              src={product.images[0]?.url}
              alt={product.images[0]?.alt || product.name}
              aspect="1 / 1"
              priority
            />
          </div>
          <div>
            <p className="eyebrow text-emerald">{selectedVariant.label}</p>
            <h1 className="mt-3 font-display text-5xl font-semibold">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-inkSoft">
              {product.description}
            </p>
            <div className="mt-8 flex items-baseline gap-3">
              <PriceDisplay
                price={selectedVariant.price}
                mrp={selectedVariant.mrp}
              />
            </div>
            <div
              className="mt-8 flex flex-wrap gap-3"
              aria-label="Product variants"
            >
              {product.variants.map((variant) => (
                <button
                  key={variant.label}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={variant.stockStatus === 'OUT_OF_STOCK'}
                  aria-pressed={variant.label === selectedVariant.label}
                  className={`rounded-full border-2 px-5 py-3 font-mono text-xs ${variant.label === selectedVariant.label ? 'border-goldDeep bg-goldDeep text-beige' : 'border-ink/20'}`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
            {selectedVariant.stockStatus === 'LOW_STOCK' ? (
              <p className="mt-4 text-sm text-status-warning">
                Only {selectedVariant.remaining} left.
              </p>
            ) : null}
            <button
              onClick={() => addToCart(product, selectedVariant)}
              disabled={selectedVariant.stockStatus === 'OUT_OF_STOCK'}
              className="btn-primary mt-8 rounded-full px-8 py-4 font-bold text-beige disabled:cursor-not-allowed disabled:opacity-50"
            >
              {selectedVariant.stockStatus === 'OUT_OF_STOCK'
                ? 'Out of stock'
                : 'Add to cart →'}
            </button>
          </div>
        </div>
        <div className="mt-24">
          <p className="eyebrow">What's inside</p>
          <h2 className="section-title">
            Simple ways to make it part of the day.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {product.benefits.map((benefit) => (
              <article
                className="rounded-3xl border-2 border-ink/10 bg-cream p-7"
                key={benefit}
              >
                <h3 className="font-display text-xl font-semibold">
                  {benefit}
                </h3>
                <p className="mt-2 text-sm text-inkSoft">
                  A considered pantry choice for everyday cooking.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <StickyBuyBar product={{ ...product, variants: [selectedVariant] }} />
    </>
  );
}
