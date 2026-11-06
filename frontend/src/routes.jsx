import { Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
	return <Routes><Route element={<App />}><Route path="/" element={<Home />} /><Route path="/shop" element={<Shop />} /><Route path="/product/:slug" element={<ProductDetail />} /><Route path="/cart" element={<Cart />} /><Route path="/checkout" element={<Checkout />} /><Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Route><Route path="/home" element={<Navigate to="/" replace />} /></Routes>;
}
