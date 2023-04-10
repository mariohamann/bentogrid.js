/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': "'M PLUS 2', sans-serif",
        'code': `"M PLUS 1 Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
      },
      colors: {
        black: "#020202",
        'sand': {
          '50': '#f8f6f4',
          '100': '#eae3dd',
          '200': '#ded3ca',
          '300': '#c9b5a8',
          '400': '#b29485',
          '500': '#a27d6d',
          '600': '#956d61',
          '700': '#7d5951',
          '800': '#664a46',
          '900': '#543e3a',
          '950': '#2c1f1e',
        },

        'water': {
          '50': '#f1f8f7',
          '100': '#ddeeea',
          '200': '#cde5e1',
          '300': '#91c4bf',
          '400': '#62a5a0',
          '500': '#418885',
          '600': '#2f6c6b',
          '700': '#265656',
          '800': '#204445',
          '900': '#1b3839',
          '950': '#0e1f20',
        },
      }
    },
  },
  plugins: [require('@mariohamann/tailwindcss-var'), require('@tailwindcss/typography')],
}
