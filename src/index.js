const plugin = require('tailwindcss/plugin')
const _ = require('lodash')

module.exports = plugin(function ({ addBase, addUtilities, e, theme, variants }) {
  const screens = theme('screens', {})
  const minWidths = extractMinWidths(screens)
  const rootSizes = mapMinWidthsToRootSize(
    minWidths,
    screens,
    theme('capsize.rootFontSizePx', { default: 16 })
  )

  const generateRootFontSizeFor = (minWidth) => {
    const fontSizeConfig = _.find(rootSizes, (rootSize) => `${rootSize.minWidth}` === `${minWidth}`)

    if (!fontSizeConfig || !fontSizeConfig.rootSize) {
      return {}
    }

    return {
      'font-size': fontSizeConfig.rootSize + 'px',
      '--root-font-size-px': fontSizeConfig.rootSize.toString(),
    }
  }
  const atRules = _(minWidths)
    .sortBy((minWidth) => parseInt(minWidth))
    .sortedUniq()
    .map((minWidth) => {
      return {
        [`@media (min-width: ${minWidth})`]: {
          html: {
            ...generateRootFontSizeFor(minWidth),
          },
        },
      }
    })
    .value()

  addBase([
    {
      html: {
        ...generateRootFontSizeFor(0),
        'line-height': theme('capsize.rootLineHeightUnitless', '1.5').toString(),
        '--line-height-rem': '0',
        '--line-height-unitless': theme('capsize.rootLineHeightUnitless', '1.5').toString(),
      },
    },
    ...atRules,
  ])

  if (theme('capsize.className')) {
    const capsizeUtilities = {
      [`.${e(theme('capsize.className'))}`]: {
        padding: '0.05px 0',
        '&::before': {
          content: '""',
          'margin-top': `calc(
                -1em * ((var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) -
                      (
                        (
                            (
                                var(--line-height-scale) * (var(--font-size-rem) * var(--root-font-size-px)) -
                                  (var(--line-height-rem) * var(--root-font-size-px)) -
                                  (var(--line-height-unitless) * (var(--font-size-rem) * var(--root-font-size-px)))
                              ) / 2
                          ) / (var(--font-size-rem) * var(--root-font-size-px))
                      ) + (0.05 / (var(--font-size-rem) * var(--root-font-size-px))))
              )`,
          display: 'block',
          height: '0',
        },
        '&::after': {
          content: '""',
          'margin-bottom': `calc(
                -1em * ((var(--descent-scale) + var(--line-gap-scale) / 2) -
                      (
                        (
                            (
                                var(--line-height-scale) * (var(--font-size-rem) * var(--root-font-size-px)) -
                                  (var(--line-height-rem) * var(--root-font-size-px)) -
                                  (var(--line-height-unitless) * (var(--font-size-rem) * var(--root-font-size-px)))
                              ) / 2
                          ) / (var(--font-size-rem) * var(--root-font-size-px))
                      ) + (0.05 / (var(--font-size-rem) * var(--root-font-size-px))))
              )`,
          display: 'block',
          height: '0',
        },
      },
    }

    addUtilities(capsizeUtilities)
  }

  const fontFamilyUtilities = _.fromPairs(
    _.map(theme('fontFamily'), (value, modifier) => {
      return [
        `.${e(`font-${modifier}`)}`,
        {
          'font-family': Array.isArray(value) ? value.join(', ') : value,
          ...(theme(`capsize.fontMetrics.${modifier}`)
            ? {
                '--cap-height': theme(`capsize.fontMetrics.${modifier}.capHeight`).toString(),
                '--ascent': theme(`capsize.fontMetrics.${modifier}.ascent`).toString(),
                '--descent': theme(`capsize.fontMetrics.${modifier}.descent`).toString(),
                '--line-gap': theme(`capsize.fontMetrics.${modifier}.lineGap`).toString(),
                '--units-per-em': theme(`capsize.fontMetrics.${modifier}.unitsPerEm`).toString(),

                '--absolute-descent': Math.abs(
                  theme(`capsize.fontMetrics.${modifier}.descent`)
                ).toString(),
                '--cap-height-scale': (
                  theme(`capsize.fontMetrics.${modifier}.capHeight`) /
                  theme(`capsize.fontMetrics.${modifier}.unitsPerEm`)
                ).toString(),
                '--descent-scale': (
                  Math.abs(theme(`capsize.fontMetrics.${modifier}.descent`)) /
                  theme(`capsize.fontMetrics.${modifier}.unitsPerEm`)
                ).toString(),
                '--ascent-scale': (
                  theme(`capsize.fontMetrics.${modifier}.ascent`) /
                  theme(`capsize.fontMetrics.${modifier}.unitsPerEm`)
                ).toString(),
                '--line-gap-scale': (
                  theme(`capsize.fontMetrics.${modifier}.lineGap`) /
                  theme(`capsize.fontMetrics.${modifier}.unitsPerEm`)
                ).toString(),
                '--line-height-scale': (
                  (theme(`capsize.fontMetrics.${modifier}.ascent`) +
                    theme(`capsize.fontMetrics.${modifier}.lineGap`) +
                    Math.abs(theme(`capsize.fontMetrics.${modifier}.descent`))) /
                  theme(`capsize.fontMetrics.${modifier}.unitsPerEm`)
                ).toString(),
              }
            : {}),
        },
      ]
    })
  )

  addUtilities(fontFamilyUtilities, variants('fontFamily'))

  const fontSizeUtilities = _.fromPairs(
    _.map(theme('fontSize'), (value, modifier) => {
      const [fontSize, options] = Array.isArray(value) ? value : [value]
      const { lineHeight, letterSpacing } = _.isPlainObject(options)
        ? options
        : {
            lineHeight: options,
          }

      return [
        `.${e(`text-${modifier}`)}`,
        {
          'font-size': fontSize,
          '--font-size-rem': fontSize.endsWith('rem') ? fontSize.replace('rem', '') : '0',
          ...(lineHeight === undefined
            ? {}
            : {
                'line-height': lineHeight,
                '--line-height-rem': lineHeight.endsWith('rem')
                  ? lineHeight.replace('rem', '')
                  : '0',
                '--line-height-unitless':
                  !isNaN(parseFloat(lineHeight)) && isFinite(lineHeight) ? lineHeight : '0',
              }),
          ...(theme('capsize.className') === undefined
            ? {
                padding: '0.05px 0',
                '&::before': {
                  content: '""',
                  'margin-top': `calc(
                      -1em * ((var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) -
                            (
                              (
                                  (
                                      var(--line-height-scale) * (var(--font-size-rem) * var(--root-font-size-px)) -
                                        (var(--line-height-rem) * var(--root-font-size-px)) -
                                        (var(--line-height-unitless) * (var(--font-size-rem) * var(--root-font-size-px)))
                                    ) / 2
                                ) / (var(--font-size-rem) * var(--root-font-size-px))
                            ) + (0.05 / (var(--font-size-rem) * var(--root-font-size-px))))
                    )`,
                  display: 'block',
                  height: '0',
                },
                '&::after': {
                  content: '""',
                  'margin-bottom': `calc(
                      -1em * ((var(--descent-scale) + var(--line-gap-scale) / 2) -
                            (
                              (
                                  (
                                      var(--line-height-scale) * (var(--font-size-rem) * var(--root-font-size-px)) -
                                        (var(--line-height-rem) * var(--root-font-size-px)) -
                                        (var(--line-height-unitless) * (var(--font-size-rem) * var(--root-font-size-px)))
                                    ) / 2
                                ) / (var(--font-size-rem) * var(--root-font-size-px))
                            ) + (0.05 / (var(--font-size-rem) * var(--root-font-size-px))))
                    )`,
                  display: 'block',
                  height: '0',
                },
              }
            : {}),
          ...(letterSpacing === undefined
            ? {}
            : {
                'letter-spacing': letterSpacing,
              }),
        },
      ]
    })
  )

  addUtilities(fontSizeUtilities, variants('fontSize'))

  const lineHeightUtilities = _.fromPairs(
    _.map(theme('lineHeight'), (value, modifier) => {
      return [
        `.${e(`leading-${modifier}`)}`,
        {
          'line-height': value,
          '--line-height-rem': value.endsWith('rem') ? value.replace('rem', '') : '0',
          '--line-height-unitless': !isNaN(parseFloat(value)) && isFinite(value) ? value : '0',
        },
      ]
    })
  )

  addUtilities(lineHeightUtilities, variants('lineHeight'))
})

function extractMinWidths(breakpoints) {
  return _.flatMap(breakpoints, (breakpoints) => {
    if (_.isString(breakpoints)) {
      breakpoints = { min: breakpoints }
    }

    if (!Array.isArray(breakpoints)) {
      breakpoints = [breakpoints]
    }

    return _(breakpoints)
      .filter((breakpoint) => {
        return _.has(breakpoint, 'min') || _.has(breakpoint, 'min-width')
      })
      .map((breakpoint) => {
        return _.get(breakpoint, 'min-width', breakpoint.min)
      })
      .value()
  })
}

function mapMinWidthsToRootSize(minWidths, screens, rootSizes) {
  if (typeof rootSizes === 'undefined') {
    return []
  }

  if (!_.isObject(rootSizes)) {
    return [
      {
        screen: 'default',
        minWidth: 0,
        rootSize: rootSizes,
      },
    ]
  }

  const mapping = []

  if (rootSizes.default) {
    mapping.push({
      screen: 'default',
      minWidth: 0,
      rootSize: rootSizes.default,
    })
  }

  _.each(minWidths, (minWidth) => {
    Object.keys(screens).forEach((screen) => {
      if (`${screens[screen]}` === `${minWidth}`) {
        mapping.push({
          screen,
          minWidth,
          rootSize: rootSizes[screen],
        })
      }
    })
  })

  return mapping
}
