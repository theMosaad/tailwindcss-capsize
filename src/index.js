const plugin = require('tailwindcss/plugin')
const _ = require('lodash')

module.exports = plugin(
  function ({ addBase, addUtilities, e, theme, variants }) {
    const screens = theme('screens', {})
    const minWidths = extractMinWidths(screens)
    const rootSizes = mapMinWidthsToRootSize(
      minWidths,
      screens,
      theme('capsize.rootFontSizePx', { default: 16 })
    )

    const generateRootFontSizeFor = (minWidth) => {
      const fontSizeConfig = _.find(
        rootSizes,
        (rootSize) => `${rootSize.minWidth}` === `${minWidth}`
      )

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
          '--line-height-unitless': theme('capsize.rootLineHeightUnitless', '1.5').toString(),
          '--line-gap-unitless': theme('capsize.rootLineGapUnitless', '0.5').toString(),
          ...(theme('capsize.keepPadding')
            ? {
                '--prevent-collapse': '0.05',
              }
            : {}),
        },
      },
      ...atRules,
    ])

    const capsizeContent = {
      ...(theme('capsize.keepPadding')
        ? {
            'padding-top': 'calc(1px * var(--prevent-collapse))',
            'padding-bottom': 'calc(1px * var(--prevent-collapse))',
            'padding-right': '0',
            'padding-left': '0',
          }
        : {}),
      '&::before': {
        content: '""',
        ...(theme('capsize.keepPadding')
          ? {
              display: 'block',
              height: '0',
            }
          : {
              display: 'table',
            }),
        '--line-height-normal': 'calc(var(--line-height-scale) * var(--font-size-px))',
        '--specified-line-height-offset-double':
          'calc(var(--line-height-normal) - var(--line-height-px))',
        '--specified-line-height-offset': 'calc(var(--specified-line-height-offset-double) / 2 )',
        '--specified-line-height-offset-to-scale':
          'calc(var(--specified-line-height-offset) / var(--font-size-px))',
        '--line-gap-scale-half': 'calc(var(--line-gap-scale) / 2)',
        ...(theme('capsize.keepPadding')
          ? {
              '--prevent-collapse-to-scale': 'calc(var(--prevent-collapse) / var(--font-size-px))',
              '--leading-trim-top':
                'calc( var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale-half) - var(--specified-line-height-offset-to-scale) + var(--prevent-collapse-to-scale) )',
              'margin-top': 'calc(-1em * var(--leading-trim-top))',
            }
          : {
              '--leading-trim-top':
                'calc( var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale-half) - var(--specified-line-height-offset-to-scale) )',
              'margin-bottom': 'calc(-1em * var(--leading-trim-top))',
            }),
      },
      '&::after': {
        content: '""',
        ...(theme('capsize.keepPadding')
          ? {
              display: 'block',
              height: '0',
            }
          : {
              display: 'table',
            }),
        '--line-height-normal': 'calc(var(--line-height-scale) * var(--font-size-px))',
        '--specified-line-height-offset-double':
          'calc(var(--line-height-normal) - var(--line-height-px))',
        '--specified-line-height-offset': 'calc(var(--specified-line-height-offset-double) / 2 )',
        '--specified-line-height-offset-to-scale':
          'calc(var(--specified-line-height-offset) / var(--font-size-px))',
        '--prevent-collapse-to-scale': 'calc(var(--prevent-collapse) / var(--font-size-px))',
        '--line-gap-scale-half': 'calc(var(--line-gap-scale) / 2)',
        ...(theme('capsize.keepPadding')
          ? {
              '--leading-trim-bottom':
                'calc( var(--descent-scale) + var(--line-gap-scale-half) - var(--specified-line-height-offset-to-scale) + var(--prevent-collapse-to-scale) )',
              'margin-bottom': 'calc(-1em * var(--leading-trim-bottom))',
            }
          : {
              '--leading-trim-bottom':
                'calc( var(--descent-scale) + var(--line-gap-scale-half) - var(--specified-line-height-offset-to-scale) )',
              'margin-top': 'calc(-1em * var(--leading-trim-bottom))',
            }),
      },
    }

    if (theme('capsize.className')) {
      const capsizeUtilities = {
        [`.${e(theme('capsize.className'))}`]: {
          ...capsizeContent,
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
            ...(fontSize.endsWith('rem')
              ? {
                  '--font-size-rem': fontSize.replace('rem', ''),
                  '--font-size-px': 'calc(var(--font-size-rem) * var(--root-font-size-px))',
                }
              : fontSize.endsWith('px')
              ? { '--font-size-px': fontSize.replace('px', '') }
              : {}),
            ...(lineHeight === undefined
              ? {
                  '--line-height-px': 'calc(var(--line-height-unitless) * var(--font-size-px))',
                }
              : {
                  'line-height': lineHeight,
                  ...(lineHeight.endsWith('rem')
                    ? {
                        '--line-height-rem': lineHeight.replace('rem', ''),
                        '--line-height-px':
                          'calc(var(--line-height-rem) * var(--root-font-size-px))',
                      }
                    : lineHeight.endsWith('px')
                    ? { '--line-height-px': lineHeight.replace('px', '') }
                    : !isNaN(parseFloat(lineHeight)) && isFinite(lineHeight)
                    ? {
                        '--line-height-unitless': lineHeight,
                        '--line-height-px':
                          'calc(var(--line-height-unitless) * var(--font-size-px))',
                      }
                    : {}),
                }),
            ...(theme('capsize.className') === undefined
              ? {
                  ...capsizeContent,
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

    const capHeightUtilities = _.fromPairs(
      _.map(theme('capHeight'), (value, modifier) => {
        const [capHeight, options] = Array.isArray(value) ? value : [value]
        const { lineGap, letterSpacing } = _.isPlainObject(options)
          ? options
          : {
              lineGap: options,
            }

        return [
          `.${e(`cap-height-${modifier}`)}`,
          {
            'font-size': 'calc(1px * var(--font-size-px))',
            ...(capHeight.endsWith('rem')
              ? {
                  '--cap-height-rem': capHeight.replace('rem', ''),
                  '--cap-height-px': 'calc(var(--cap-height-rem) * var(--root-font-size-px))',
                  '--font-size-px': 'calc(var(--cap-height-px) / var(--cap-height-scale))',
                }
              : capHeight.endsWith('px')
              ? {
                  '--cap-height-px': capHeight.replace('px', ''),
                  '--font-size-px': 'calc(var(--cap-height-px) / var(--cap-height-scale))',
                }
              : {}),
            'line-height': 'calc(1px * var(--line-height-px))',
            ...(lineGap === undefined
              ? {
                  '--line-gap-px': 'calc(var(--cap-height-px) * var(--line-gap-unitless))',
                  '--line-height-px': 'calc(var(--cap-height-px) + var(--line-gap-px))',
                }
              : {
                  ...(lineGap.endsWith('rem')
                    ? {
                        '--line-gap-rem': lineGap.replace('rem', ''),
                        '--line-gap-px': 'calc(var(--line-gap-rem) * var(--root-font-size-px))',
                        '--line-height-px': 'calc(var(--cap-height-px) + var(--line-gap-px))',
                      }
                    : lineGap.endsWith('px')
                    ? {
                        '--line-gap-px': lineGap.replace('px', ''),
                        '--line-height-px': 'calc(var(--cap-height-px) + var(--line-gap-px))',
                      }
                    : !isNaN(parseFloat(lineGap)) && isFinite(lineGap)
                    ? {
                        '--line-gap-unitless': lineGap,
                        '--line-gap-px': 'calc(var(--cap-height-px) * var(--line-gap-unitless))',
                        '--line-height-px': 'calc(var(--cap-height-px) + var(--line-gap-px))',
                      }
                    : {}),
                }),

            ...(theme('capsize.className') === undefined
              ? {
                  ...capsizeContent,
                }
              : {}),
          },
        ]
      })
    )

    addUtilities(capHeightUtilities, variants('capHeight'))

    const lineHeightUtilities = _.fromPairs(
      _.map(theme('lineHeight'), (lineHeight, modifier) => {
        return [
          `.${e(`leading-${modifier}`)}`,
          {
            'line-height': lineHeight,
            ...(lineHeight.endsWith('rem')
              ? {
                  '--line-height-rem': lineHeight.replace('rem', ''),
                  '--line-height-px': 'calc(var(--line-height-rem) * var(--root-font-size-px))',
                }
              : lineHeight.endsWith('px')
              ? { '--line-height-px': lineHeight.replace('px', '') }
              : !isNaN(parseFloat(lineHeight)) && isFinite(lineHeight)
              ? {
                  '--line-height-unitless': lineHeight,
                  '--line-height-px': 'calc(var(--line-height-unitless) * var(--font-size-px))',
                }
              : {}),
          },
        ]
      })
    )

    addUtilities(lineHeightUtilities, variants('lineHeight'))

    const lineGapUtilities = _.fromPairs(
      _.map(theme('lineGap'), (lineGap, modifier) => {
        return [
          `.${e(`line-gap-${modifier}`)}`,
          {
            'line-height': 'calc(1px * var(--line-height-px))',
            ...(lineGap.endsWith('rem')
              ? {
                  '--line-gap-rem': lineGap.replace('rem', ''),
                  '--line-gap-px': 'calc(var(--line-gap-rem) * var(--root-font-size-px))',
                  '--line-height-px': 'calc(var(--cap-height-px) + var(--line-gap-px))',
                }
              : lineGap.endsWith('px')
              ? {
                  '--line-gap-px': lineGap.replace('px', ''),
                  '--line-height-px': 'calc(var(--cap-height-px) + var(--line-gap-px))',
                }
              : !isNaN(parseFloat(lineGap)) && isFinite(lineGap)
              ? {
                  '--line-gap-unitless': lineGap,
                  '--line-gap-px': 'calc(var(--cap-height-px) * var(--line-gap-unitless))',
                  '--line-height-px': 'calc(var(--cap-height-px) + var(--line-gap-px))',
                }
              : {}),
          },
        ]
      })
    )

    addUtilities(lineGapUtilities, variants('lineGap'))
  },
  {
    corePlugins: {
      fontFamily: false,
      fontSize: false,
      lineHeight: false,
    },
    theme: {
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
  }
)

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
