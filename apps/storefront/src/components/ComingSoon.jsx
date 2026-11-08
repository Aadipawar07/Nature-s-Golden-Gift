import { Link } from 'react-router-dom';

export default function ComingSoon({ title }) {
  return (
    <section className="container-shell py-20 md:py-28">
      <p className="eyebrow">Coming soon</p>
      <h1 className="section-title">{title}</h1>
      <p className="mt-5 text-ink-500">This area will open at launch.</p>
      <Link className="mt-8 inline-block text-gold-800 underline" to="/">
        Return home
      </Link>
    </section>
  );
}
