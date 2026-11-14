import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from '../ui/Drawer';
const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];
export default function MobileDrawer({ isSignedIn }) {
  const [open, setOpen] = useState(false);
  const accountLink = isSignedIn
    ? ['/account', 'Account']
    : ['/login', 'Login'];
  return (
    <>
      <button
        type="button"
        className="min-h-11 rounded-md border border-cream-400 px-3 py-2 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        Menu
      </button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <nav aria-label="Mobile navigation" className="grid gap-2">
          {[...links, accountLink].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'current' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </>
  );
}
