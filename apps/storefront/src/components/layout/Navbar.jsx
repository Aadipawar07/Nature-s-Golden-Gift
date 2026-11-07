import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];
export default function Navbar() {
  const { itemCount } = useCart();
  return (
    <header className="fixed inset-x-0 top-10 z-40 border-b-2 border-ink/10 bg-beige/90 backdrop-blur-md">
      <div className="container-shell flex h-20 items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[conic-gradient(from_0deg,#e1a22b,#b65b2a,#e1a22b)]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-beige font-mono text-[10px] font-bold text-goldDeep">
              NG
            </span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            Nature's <em className="not-italic text-goldDeep">Golden</em> Gift
          </span>
        </Link>
        <nav className="hidden items-center gap-7 font-semibold text-sm text-inkSoft md:flex">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'current' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/cart"
          className="btn-primary flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-beige"
          aria-label={`Cart with ${itemCount} items`}
        >
          <span aria-hidden="true">▢</span>
          <span className="hidden sm:inline">Cart</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-beige px-1 text-xs text-ink">
            {itemCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
