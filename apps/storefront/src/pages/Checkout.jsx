import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/product/PriceDisplay';
export default function Checkout() {
  const { total, items } = useCart();
  return (
    <section className="container-shell py-20 md:py-28">
      <p className="eyebrow">Checkout</p>
      <h1 className="section-title">Almost home.</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-inkSoft">
          Your cart is empty.{' '}
          <Link className="text-goldDeep underline" to="/shop">
            Return to shop
          </Link>
          .
        </p>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
          <form
            className="rounded-3xl border-2 border-ink/10 bg-beigeCard p-7"
            onSubmit={(event) => event.preventDefault()}
          >
            <h2 className="font-display text-2xl font-semibold">
              Delivery details
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                className="form-control"
                placeholder="Full name"
                required
              />
              <input className="form-control" placeholder="Phone" required />
              <input
                className="form-control sm:col-span-2"
                placeholder="Address"
                required
              />
              <input className="form-control" placeholder="City" required />
              <input className="form-control" placeholder="PIN code" required />
            </div>
            <button
              disabled
              className="mt-7 cursor-not-allowed rounded-full bg-cream-300 px-7 py-3 font-bold text-ink-500"
            >
              Online payment opens at launch
            </button>
          </form>
          <aside className="h-fit rounded-3xl bg-ink p-7 text-beige">
            <p className="font-mono text-xs uppercase tracking-widest text-goldPale">
              Order total
            </p>
            <p className="mt-5 font-display text-4xl font-bold">
              <PriceDisplay price={total} />
            </p>
            <p className="mt-3 text-sm text-beige/60">
              Payment integration will be connected in a later step.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
