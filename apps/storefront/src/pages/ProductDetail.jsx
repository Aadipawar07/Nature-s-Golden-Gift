import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { benefits, products } from '../data/placeholders';
import { useCart } from '../context/CartContext';
import StickyBuyBar from '../components/layout/StickyBuyBar';
import ProductImage from '../components/product/ProductImage';
import PriceDisplay from '../components/product/PriceDisplay';
import NotFound from './NotFound';
export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.size);
  if (!product) return <NotFound />;
  return (
    <>
      <section className="container-shell py-20 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-cream-200">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              aspect="1 / 1"
              priority
            />
          </div>
          <div>
            <p className="eyebrow text-emerald">
              {product.size} · {product.label}
            </p>
            <h1 className="mt-3 font-display text-5xl font-semibold">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-inkSoft">
              {product.description}
            </p>
            <div className="mt-8 flex items-baseline gap-3">
              <PriceDisplay price={product.price} mrp={product.mrp} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {['100g', '200g', '500g'].map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedSize(variant)}
                  className={`rounded-full border-2 px-5 py-3 font-mono text-xs ${variant === selectedSize ? 'border-goldDeep bg-goldDeep text-beige' : 'border-ink/20'}`}
                >
                  {variant}
                </button>
              ))}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="btn-primary mt-8 rounded-full px-8 py-4 font-bold text-beige"
            >
              Add to cart →
            </button>
          </div>
        </div>
        <div className="mt-24">
          <p className="eyebrow">What's inside</p>
          <h2 className="section-title">
            One spoon carries nothing manufactured to fake it.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map(([title, text]) => (
              <article
                className="bracket rounded-3xl border-2 border-ink/10 bg-cream p-7"
                key={title}
              >
                <div className="mb-5 grid h-10 w-10 place-items-center rounded-full bg-gold/20 text-goldDeep">
                  ◆
                </div>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-inkSoft">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <StickyBuyBar product={product} />
    </>
  );
}
