import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useDocumentTitle from './app/useDocumentTitle';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';

export default function App() {
  const { pathname } = useLocation();
  useDocumentTitle(
    pathname === '/'
      ? null
      : pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' '),
  );
  return (
    <div className="min-h-screen bg-cream-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[var(--z-toast)] focus:bg-cream-50 focus:p-3"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
