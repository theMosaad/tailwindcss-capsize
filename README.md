<p>
  <img alt="Tailwind CSS" width="350" src="./.github/logo.svg">
</p>

A Tailwind CSS plugin for automatically trimming the whitespace above and below text nodes. This is a port of [Capsize](https://github.com/seek-oss/capsize).

Huge thanks to [Michael Taranto](https://github.com/michaeltaranto) and the [Seek](https://github.com/seek-oss) team behind it from figuring out the hard parts.

<!-- [View live demo](https://themosaad.com/tailwindcss-capsize) -->

```html
<p class="capsize font-sans text-xl leading-tight">Capsized Text</p>
```

## Installation

Install the plugin from npm:

```sh
# Using npm
npm install @themosaad/tailwindcss-capsize
```

Then add the plugin to your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // disable core font plugin as they'll be generated with some extra css for trimming
  corePlugins: {
    fontFamily: false,
    fontSize: false,
    lineHeight: false,
  },
  theme: {
    fontFamily: {
      // define your custom font
      sans: ['Inter var', 'sans-serif'],
    },
    capsize: {
      fontMetrics: {
        // font metrics for you custom font from Capsize's website
        sans: {
          capHeight: 2048,
          ascent: 2728,
          descent: -680,
          lineGap: 0,
          unitsPerEm: 2816,
        },
      },
      // define the utility class for trimming
      className: 'capsize',
    },
  },
  plugins: [require('@themosaad/tailwindcss-capsize')],
}
```

## Usage

Now you can use the `capsize` class to trim any text:

```html
<p class="capsize font-sans text-xl leading-tight">Capsized Text</p>
```

### Trim by default

if you prefer to trim text nodes by default, don't define a class name. This will move the trimming css to the font-size classes:

```js
// tailwind.config.js
module.exports = {
  theme: {
    capsize: {
      fontMetrics: {
        // ...
      },
      // className: 'capsize',
    },
  },
  plugins: [require('@themosaad/tailwindcss-capsize')],
}
```

this way, you can use:

```html
<p class="font-sans text-xl leading-tight">Capsized Text</p>
```

### Default line-height

The root `line-height` is set to `1.5` by default. Which you can alter via:

```js
// tailwind.config.js
module.exports = {
  theme: {
    capsize: {
      rootLineHeightUnitless: 1.2,
  },
}
```

Therefore, if that's the line-height you want for a capsized element, you can ditch the leading class:

```html
<p class="font-sans text-xl">Capsized Text</p>
```

If you want better default line-height per font-size, you can enable the [defaultLineHeights experimental feature](https://github.com/tailwindlabs/tailwindcss/blob/v1.8.5/src/flagged/defaultLineHeights.js). Which will become the default in Tailwindcss v2.

```js
// tailwind.config.js
module.exports = {
  experimental: {
    defaultLineHeights: true,
  },
}
```

### Define a default font-family

In most cases, you'll have a default font-family that's used accross the website by default.

If you added the `font-sans` class to the body or a parent element, you can use

```html
<p class="text-xl">Capsized Text</p>
```

### Usage with @apply

Since the plugin outputs pseudo-elements, you'll need to use the experimental applyComplexClasses feature:

```js
// tailwind.config.js
module.exports = {
  experimental: {
    applyComplexClasses: true,
  },
}
```

Which will allow you to use:

```css
p {
  @apply capsize font-sans text-xl leading-7;
}
```

## Limitation and Customization

- Accepts only `rem` values for fontSize.
- Accepts both `rem` and unitless values for lineHeight.
- Doesn't support IE11 as it utilizes css variables for the trimming calculations. However, font-size and line-height will work as expected.

## Root font-size

The plugin outputs the following inside the `@tailwind/base`:

```css
html {
  font-size: 16px;
  --root-font-size-px: 16;
}
```

So overriding it from you css might mess up the trimming calculations.

To change the default root font-size:

```js
// tailwind.config.js
module.exports = {
  theme: {
    capsize: {
      rootFontSize: {
        default: 16,
      },
    },
  },
}
```

You can also change the rootFontSize for each screen:

```js
// tailwind.config.js
module.exports = {
  theme: {
    capsize: {
      rootFontSize: {
        default: 16,
        sm: 18,
        lg: 20,
      },
    },
  },
}
```
