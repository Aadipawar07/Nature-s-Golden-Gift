import { CartProvider } from '../context/CartContext';
import ErrorBoundary from './ErrorBoundary';
export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <CartProvider>{children}</CartProvider>
    </ErrorBoundary>
  );
}
