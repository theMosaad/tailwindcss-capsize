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
        ...Object.keys(defaultTheme.fontFamily).map((fontFamily) => `font-${fontFamily}`),
        ...Object.keys(defaultTheme.fontSize).map((fontSize) => `text-${fontSize}`),
        ...Object.keys(defaultTheme.lineHeight).map((lineHeight) => `leading-${lineHeight}`),
      ],
      whitelistPatterns: [/cap-height/, /line-gap/],
    },
  },
  experimental: {
    defaultLineHeights: true,
    extendedFontSizeScale: true,
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
        // rootLineGapUnitless: 0.5,
        // className: 'capsize',
        // keepPadding: true,
      },
    },
  },
  variants: {},
  plugins: [tailwindcssCapsize],
}
