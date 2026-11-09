import { Link } from 'react-router-dom';
import { benefits, processSteps, products } from '../data/placeholders';
import site from '../config/site';
import ProductImage from '../components/product/ProductImage';
import ProductCard from '../components/product/ProductCard';

export default function Home() {
  return (
    <>
      <section className="bg-cream-100 py-20 md:py-32">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Nature&apos;s Golden Gift</p>
            <h1 className="mt-4 max-w-2xl font-display text-[clamp(40px,6vw,64px)] font-medium leading-tight">
              {site.heroHeadline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
              A thoughtful pantry staple for cooking, shared tables, and
              everyday rituals.
            </p>
            <Link
              to="/shop"
              className="btn-primary mt-8 inline-flex rounded-full px-7 py-3 font-semibold"
            >
              Shop turmeric
            </Link>
          </div>
          <div className="rounded-xl bg-cream-200 p-6 shadow-md">
            <ProductImage
              src={products[0].images[0]}
              alt="Turmeric product placeholder"
              aspect="1 / 1"
              priority
            />
          </div>
        </div>
      </section>
      <section className="container-shell py-20">
        <p className="eyebrow">For your kitchen</p>
        <h2 className="section-title">
          Simple ways to make it part of the day.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(([title, text]) => (
            <article
              key={title}
              className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-sm"
            >
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-3 text-sm text-ink-500">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-ink-900 py-20 text-cream-50">
        <div className="container-shell">
          <p className="eyebrow text-gold-400">Our process</p>
          <h2 className="section-title">From root to pantry.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-5">
            {processSteps.map(([number, title, text]) => (
              <article key={number}>
                <p className="text-sm text-gold-400">{number}</p>
                <h3 className="mt-3 font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm text-cream-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container-shell py-20">
        <p className="eyebrow">Featured</p>
        <h2 className="section-title">Choose your kitchen size.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
