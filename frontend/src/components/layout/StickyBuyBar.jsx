import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function StickyBuyBar({ product }) {
	const { addToCart } = useCart();
	const [visible, setVisible] = useState(false);
	useEffect(() => { const onScroll = () => setVisible(window.scrollY > 520); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
	return <div className={`fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink/10 bg-beige/95 p-3 shadow-2xl backdrop-blur-md transition-transform md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}><div className="flex items-center justify-between gap-3"><div><p className="font-display font-semibold">{product.name}</p><p className="font-mono text-xs text-inkSoft">₹{product.price}</p></div><button onClick={() => addToCart(product)} className="btn-primary rounded-full px-5 py-3 text-sm font-bold text-beige">Add to cart</button></div></div>;
}
