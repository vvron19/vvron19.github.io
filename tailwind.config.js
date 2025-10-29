// En tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  // 🚨 CRUCIAL: Esta sección le dice a Tailwind dónde buscar las clases.
  content: [
    "./index.html",
    // Esta línea escanea TODOS los archivos de tipo js, ts, jsx, tsx en la carpeta src.
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}