import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import Providers from './app/providers';
import ScrollToTop from './app/ScrollToTop';
import './styles/tokens.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <ScrollToTop />
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
);
