module.exports = {
  plugins: {
    tailwindcss: { config: `${__dirname}/tailwind.config.js` },
    cssnano: {
      preset: ['default', { calc: false }],
    },
    autoprefixer: {},
  },
}
