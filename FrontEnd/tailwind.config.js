/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        // Add other custom colors here as needed
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      spacing: {
        // Add spacing if required, for example:
        // 'sidebar': 'calc(100vh - 4rem)',  // Custom spacing
      },
    },
  },
  plugins: [],
};