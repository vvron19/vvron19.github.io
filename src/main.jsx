// En src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Importa tu componente principal
import './index.css'; // Importa tus estilos globales (donde está Tailwind)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Renderiza el componente App */}
    <App />
  </React.StrictMode>,
);