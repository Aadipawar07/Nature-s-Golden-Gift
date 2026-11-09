import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import MobileDrawer from './MobileDrawer';

const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];
export default function Navbar() {
  const { itemCount } = useCart();
  return (
    <header className="sticky top-0 z-[var(--z-nav)] border-b border-cream-300 bg-cream-50/95 backdrop-blur-md">
      <div className="container-shell flex h-20 items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-500 font-display font-semibold text-ink-900">
            NG
          </span>
          <span className="brand-name hidden font-display text-lg font-semibold tracking-tight sm:inline sm:text-xl">
            Nature's <em className="not-italic text-goldDeep">Golden</em> Gift
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 text-sm font-semibold text-ink-700 md:flex"
        >
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
          className="btn-primary flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold"
          aria-label={undefined}
        >
          <span className="hidden sm:inline">Cart</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-beige px-1 text-xs text-ink">
            {itemCount}
          </span>
        </Link>
        <MobileDrawer />
      </div>
    </header>
  );
}
