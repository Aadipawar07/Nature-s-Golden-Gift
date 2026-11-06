import { Link } from 'react-router-dom';
export default function NotFound() { return <section className="container-shell py-28 text-center"><p className="eyebrow">404</p><h1 className="section-title">That page wandered off.</h1><Link className="btn-primary mt-8 inline-block rounded-full px-7 py-3 font-bold text-beige" to="/">Back home</Link></section>; }
