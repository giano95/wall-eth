const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            screens: {
                xs: '512px',
            },
            fontFamily: {
                serif: ['Space Grotesk', ...defaultTheme.fontFamily.serif],
                iceberg: ['Iceberg', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                'background-dark': '#202428',
                'zapper-dark-gray': '#151A1E',
                'modals-light': '#F4F4F4',
                'modals-dark': '#24262A',
                'modals-dark-2': '#202226',
                'modals-dark-3': '#161719',
                'gray-350': '#B7BCC5',
                'gray-450': '#848B98',
                'gray-750': '#2B3544',
                'gray-850': '#18212F',
                'purple-350': '#CC9CFD',
                'pink-350': '#F78DC5',
                'yellow-350': '#FDE047',
            },
            boxShadow: {
                '3xl-dark': '0 32px 32px 16px rgb(0 0 0 / 0.2)',
                '3xl-light': '0 32px 32px 16px rgb(0 0 0 / 0.1)',
                'xl-inverse':
                    '0 20px 25px -5px rgb(256 256 256 / 0.015), 0 8px 10px -6px rgb(256 256 256 / 0.015)',
            },
        },
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
}
