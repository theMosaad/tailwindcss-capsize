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
        'text-7xl',
        'text-8xl',
        'text-9xl',
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
      capHeight: {
        2: ['0.5rem', { lineGap: '0.5rem' }],
        2.5: ['0.625rem', { lineGap: '0.625rem' }],
        3: ['0.75rem', { lineGap: '0.75rem' }],
        3.5: ['0.875rem', { lineGap: '0.875rem' }],
        4: ['1rem', { lineGap: '1rem' }],
        5: ['1.25rem', { lineGap: '1.25rem' }],
        6: ['1.5rem', { lineGap: '1.5rem' }],
        7: ['1.75rem', { lineGap: '1.75rem' }],
        8: ['2rem', { lineGap: '2rem' }],
        9: ['2.25rem', { lineGap: '2.25rem' }],
        10: ['2.5rem', { lineGap: '2.5rem' }],
        11: ['2.75rem', { lineGap: '2.75rem' }],
        12: ['3rem', { lineGap: '3rem' }],
        13: ['3.25rem', { lineGap: '3.25rem' }],
        14: ['3.5rem', { lineGap: '3.5rem' }],
        15: ['3.75rem', { lineGap: '3.55rem' }],
      },
      lineGap: {
        0: '0',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
      },
    },
  },
  variants: {},
  plugins: [tailwindcssCapsize],
}
