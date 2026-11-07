import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { CartProvider } from './context/CartContext';
import './styles/tokens.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><CartProvider><AppRoutes /></CartProvider></BrowserRouter></React.StrictMode>);
