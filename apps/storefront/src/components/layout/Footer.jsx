import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="border-t-2 border-ink/10 py-10">
      <div className="container-shell flex flex-col items-center justify-between gap-4 text-sm text-inkSoft md:flex-row">
        <p>© 2026 Nature's Golden Gift. All rights reserved.</p>
        <div className="flex gap-4 font-mono text-[10px] font-semibold uppercase tracking-widest">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <span>FSSAI Licensed</span>
        </div>
      </div>
    </footer>
  );
}
