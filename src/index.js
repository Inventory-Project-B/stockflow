import React from 'react';
import { createRoot } from 'react-dom/client'; // Impor createRoot dari react-dom/client
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Temukan elemen root di HTML
const container = document.getElementById('root');

// Buat root
const root = createRoot(container);

// Render aplikasi Anda
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);