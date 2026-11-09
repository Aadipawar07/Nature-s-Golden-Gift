import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ProductImage from './ProductImage';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <article className="relative rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card-hover">
      <div className="mb-6 overflow-hidden rounded-lg bg-cream-200">
        <ProductImage src={product.images[0]} alt="" aspect="4 / 3" />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-leaf-700">
        {product.size} · {product.label}
      </p>
      <Link to={`/product/${product.slug}`}>
        <h2 className="font-display text-xl font-semibold">{product.name}</h2>
      </Link>
      <p className="mb-5 mt-2 min-h-12 text-sm text-ink-500">
        {product.description}
      </p>
      <div className="mb-5 flex items-center gap-2 text-xs text-leaf-700">
        <span className="h-2 w-2 rounded-full bg-leaf-500" />
        In stock
      </div>
      <div className="flex items-center justify-between">
        <PriceDisplay price={product.price} mrp={product.mrp} />
        <button
          onClick={() => addToCart(product)}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink-900 text-xl text-cream-50 transition-colors hover:bg-gold-700"
          aria-label={`Add ${product.name} to cart`}
        >
          +
        </button>
      </div>
    </article>
  );
}
