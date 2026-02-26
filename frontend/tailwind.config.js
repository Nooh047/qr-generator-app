import '@tailwindcss/vite';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom tailwind brand mappings globally defined 
                brand: {
                    blue: '#2563EB',
                    dark: '#0F172A',
                    light: '#F8FAFC'
                }
            }
        },
    },
    plugins: [],
}
