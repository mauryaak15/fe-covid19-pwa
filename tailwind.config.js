const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
                serif: ['"Roboto Slab"', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                bluegray: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },
            },
        },
    },
    plugins: [],
    safelist: [
        {
            pattern: /text-(sky|green|red)-[\d+]{1,3}/,
            variants: ['hover', 'dark'],
        },
        {
            pattern: /bg-(sky|green|red)-[\d+]{1,3}/,
            variants: ['hover', 'dark'],
        },
    ],
};
