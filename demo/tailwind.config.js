const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,mdx}'],
  corePlugins: {
    fontFamily: false,
    fontSize: false,
    lineHeight: false,
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
            capHeight: 660,
            ascent: 984,
            descent: -273,
            lineGap: 0,
            unitsPerEm: 1000,
          },
          'ubuntu-mono': {
            capHeight: 615,
            ascent: 830,
            descent: -172,
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
  plugins: [require('../src/index.js')],
}
