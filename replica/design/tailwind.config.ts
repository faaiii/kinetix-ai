import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
        },
        border: {
          DEFAULT: 'var(--border)',
          input: 'var(--border-input)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        'on-accent': 'var(--on-accent)',
        danger: 'var(--danger)',
        success: 'var(--success)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        base: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        lg: ['1.125rem', { lineHeight: '1.625rem', fontWeight: '600' }],
        xl: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        '2xl': ['1.875rem', { lineHeight: '2.375rem', fontWeight: '700' }],
        display: ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
        drawer: 'var(--shadow-drawer)',
      },
      maxWidth: {
        content: 'var(--content-max-width)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
