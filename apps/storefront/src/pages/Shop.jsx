import { products } from '../data/placeholders';
import ProductCard from '../components/product/ProductCard';
export default function Shop() {
  return (
    <section className="container-shell py-20 md:py-28">
      <p className="eyebrow">Pick your size</p>
      <h1 className="section-title">Bring the batch home.</h1>
      <p className="mt-4 max-w-xl text-inkSoft">
        Three pack sizes, one single-origin turmeric powder. Prices are
        placeholders for now.
      </p>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
