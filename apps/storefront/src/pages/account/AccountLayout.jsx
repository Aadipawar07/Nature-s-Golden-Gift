import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';

const links = [
  ['/account', 'Overview', true],
  ['/account/profile', 'Profile'],
  ['/account/addresses', 'Addresses'],
  ['/account/orders', 'Orders'],
];

export default function AccountLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');

  async function handleLogout() {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      setNotice('Unable to sign out right now. Please try again.');
    }
  }

  return (
    <section className="container-shell grid gap-8 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="font-display text-4xl font-semibold">Account</h1>
        </div>
        <Button type="button" variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </header>
      <div className="grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)]">
        <nav
          aria-label="Account navigation"
          className="grid content-start gap-2"
        >
          {links.map(([to, label, end]) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `min-h-11 rounded-md px-4 py-3 font-semibold ${isActive ? 'bg-gold-100 text-ink-900' : 'text-ink-700 hover:bg-cream-100'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
      <Toast message={notice} onClose={() => setNotice('')} />
    </section>
  );
}
