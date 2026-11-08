import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Skeleton from '../components/ui/Skeleton';
const Shop = lazy(() => import('../pages/Shop'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const OrderConfirmation = lazy(() => import('../pages/OrderConfirmation'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const Dashboard = lazy(() => import('../pages/account/Dashboard'));
const Orders = lazy(() => import('../pages/account/Orders'));
const OrderDetail = lazy(() => import('../pages/account/OrderDetail'));
const TrackOrder = lazy(() => import('../pages/account/TrackOrder'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Sourcing = lazy(() => import('../pages/Sourcing'));
const NotFound = lazy(() => import('../pages/NotFound'));
const DraftPage = lazy(() => import('../pages/DraftPage'));

export const routePaths = [
  '/',
  '/shop',
  '/product/starter-pouch',
  '/cart',
  '/checkout',
  '/order-confirmation/demo',
  '/login',
  '/register',
  '/forgot-password',
  '/account',
  '/account/orders',
  '/account/orders/demo',
  '/account/orders/demo/track',
  '/about',
  '/sourcing',
  '/contact',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/shipping-policy',
  '/return-refund-policy',
  '/missing',
];
export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <main className="container-shell py-28">
          <Skeleton className="h-10 w-64" />
        </main>
      }
    >
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/account" element={<Dashboard />} />
          <Route path="/account/orders" element={<Orders />} />
          <Route path="/account/orders/:id" element={<OrderDetail />} />
          <Route path="/account/orders/:id/track" element={<TrackOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/privacy-policy"
            element={
              <DraftPage
                title="Privacy policy"
                ownerInput="privacy policy text"
              />
            }
          />
          <Route
            path="/terms"
            element={<DraftPage title="Terms" ownerInput="terms text" />}
          />
          <Route
            path="/shipping-policy"
            element={
              <DraftPage
                title="Shipping policy"
                ownerInput="shipping policy text"
              />
            }
          />
          <Route
            path="/return-refund-policy"
            element={
              <DraftPage
                title="Return and refund policy"
                ownerInput="return and refund policy text"
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
