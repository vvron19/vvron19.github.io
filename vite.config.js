// En vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Si estás usando GitHub Pages en un repositorio de usuario (USUARIO.github.io),
// no necesitas la opción 'base'. Si no estás seguro, la configuración de abajo es segura.
// Si usas Vercel o Netlify, ignora 'base'.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Opcional: Si usas GitHub Pages y tienes problemas de rutas estáticas,
  // puedes descomentar la línea de 'base' y ajustarla.
  // base: '/nombre-de-tu-repositorio/', 
});