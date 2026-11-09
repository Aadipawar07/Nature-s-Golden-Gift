import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
export default function Cart() {
  const { items, total, removeFromCart } = useCart();
  return (
    <section className="container-shell py-20 md:py-28">
      <p className="eyebrow">Your cart</p>
      <h1 className="section-title">A little more gold for your kitchen.</h1>
      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl border-2 border-dashed border-ink/20 p-12 text-center">
          <p className="font-display text-2xl">Your cart is waiting.</p>
          <Link
            className="btn-primary mt-6 inline-block rounded-full px-7 py-3 font-bold text-beige"
            to="/shop"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_340px]">
          {' '}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                className="flex items-center justify-between rounded-2xl border-2 border-ink/10 bg-beigeCard p-5"
                key={`${item.slug}-${item.variant}`}
              >
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-sm text-inkSoft">
                    {item.variant} · Qty {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <strong>₹{item.price * item.quantity}</strong>
                  <button
                    className="text-sm text-rust"
                    onClick={() => removeFromCart(item.slug, item.variant)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-3xl bg-ink p-7 text-beige">
            <p className="font-mono text-xs uppercase tracking-widest text-goldPale">
              Summary
            </p>
            <div className="mt-6 flex justify-between text-lg">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>
            <Link
              className="mt-7 block rounded-full bg-gold px-5 py-3 text-center font-bold text-ink"
              to="/checkout"
            >
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
