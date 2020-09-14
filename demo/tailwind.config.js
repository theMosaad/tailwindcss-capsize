const defaultTheme = require('tailwindcss/defaultTheme')

let tailwindcssCapsize
try {
  tailwindcssCapsize = require('../src/index.js')
} catch (e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
    tailwindcssCapsize = require('@themosaad/tailwindcss-capsize')
  } else throw e
}

module.exports = {
  purge: {
    content: ['./**/*.js'],
    options: {
      whitelist: [
        'font-sans',
        'font-source',
        'font-ubuntu-mono',
        'text-6xl',
        'text-5xl',
        'text-4xl',
        'text-3xl',
        'text-2xl',
        'text-xl',
        'text-lg',
        'text-base',
        'text-sm',
        'text-xs',
        'leading-tight',
        'leading-relaxed',
      ],
    },
  },
  experimental: {
    applyComplexClasses: true,
    defaultLineHeights: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        source: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
        'ubuntu-mono': ['Ubuntu Mono', ...defaultTheme.fontFamily.mono],
        system: defaultTheme.fontFamily.sans,
      },
      capsize: {
        fontMetrics: {
          sans: {
            capHeight: 2048,
            ascent: 2728,
            descent: -680,
            lineGap: 0,
            unitsPerEm: 2816,
          },
          source: {
            capHeight: 710,
            ascent: 980,
            descent: -270,
            lineGap: 0,
            unitsPerEm: 1000,
          },
          'ubuntu-mono': {
            capHeight: 693,
            ascent: 830,
            descent: -170,
            lineGap: 0,
            unitsPerEm: 1000,
          },
        },
        rootFontSizePx: {
          default: 16,
          sm: 18,
          lg: 20,
        },
        // rootLineHeightUnitless: 1.5,
        // className: 'capsize',
      },
    },
  },
  variants: {},
  plugins: [tailwindcssCapsize],
}
