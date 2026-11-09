import { Link } from 'react-router-dom';
export default function OrderConfirmation() {
  return (
    <section className="container-shell py-28 text-center">
      <p className="eyebrow">Thank you</p>
      <h1 className="section-title">
        Your order is on its way to becoming real.
      </h1>
      <p className="mx-auto mt-5 max-w-lg text-inkSoft">
        This confirmation screen is ready for the order details and payment flow
        in the next step.
      </p>
      <Link
        className="btn-primary mt-8 inline-block rounded-full px-7 py-3 font-bold text-beige"
        to="/shop"
      >
        Continue shopping
      </Link>
    </section>
  );
}
