/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        daiLan: 'var(--color-daiLan)',
        zhuSha: 'var(--color-zhuSha)',
        zhuQing: 'var(--color-zhuQing)',
        tanHe: 'var(--color-tanHe)',
        miBai: 'var(--color-miBai)',
        nuanBai: 'var(--color-nuanBai)',
        moHei: 'var(--color-moHei)',
        fuZhu: 'var(--color-fuZhu)',
        tongQianJin: 'var(--color-tongQianJin)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'full': 'var(--radius-full)',
      },
      fontFamily: {
        zh: 'var(--font-zh)',
      },
      fontSize: {
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'hover': 'var(--shadow-hover)',
      },
    },
  },
  plugins: [],
}
