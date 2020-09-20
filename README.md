<p>
  <img alt="Tailwind CSS" width="350" src="./.github/logo.svg">
</p>

A Tailwind CSS plugin for automatically trimming the whitespace above and below text nodes. This is a port of [Capsize](https://github.com/seek-oss/capsize).

Huge thanks to [Michael Taranto](https://github.com/michaeltaranto) and the [Seek](https://github.com/seek-oss) team behind it from figuring out the hard parts.

[View live demo](https://tailwindcss-capsize-demo.vercel.app/)

```html
<p class="capsize font-sans text-xl leading-tight">Capsized Text</p>
```

# Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Trim by default](#trim-by-default)
  - [Default line-height](#default-line-height)
  - [Define a default font-family](#define-a-default-font-family)
  - [Usage with @apply](#usage-with--apply)
  - [Root font-size](#root-font-size)
- [Limitation and Customization](#limitation-and-customization)
- [Behind the scenes](#behind-the-scenes)

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
  theme: {
    fontFamily: {
      // define your custom font
      sans: ['Inter var', 'sans-serif'],
    },
    capsize: {
      fontMetrics: {
        // define font metrics for your custom font from Capsize's website
        sans: {
          capHeight: 2048,
          ascent: 2728,
          descent: -680,
          lineGap: 0,
          unitsPerEm: 2816,
        },
      },
      // define the utility class for trimming (leave empty to trim all text nodes)
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

### Root font-size

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
      rootFontSizePx: {
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
      rootFontSizePx: {
        default: 16,
        sm: 18,
        lg: 20,
      },
    },
  },
}
```

## Limitation and Customization

- Accepts `rem` and `px` for fontSize.
- Accepts `rem`, `px`, and `unitless` for lineHeight.
- Doesn't trim text on IE11 as it uses css variables for the trimming calculations. (will work on a JS polyfill or an average pre-calculation for all project fonts)
- Adds `padding: 0.05px 0` to capsized element which will override your padding utility classes. Solution is to wrap the text element in a parent element where you add your padding utility classes to.

## Behind the scenes

The plugin adds the following to typography-related utility classes:

To font-family classes, it adds css variables with font metrics:

```css
.font-sans {
  font-family: Inter var, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  --cap-height: 2048;
  --ascent: 2728;
  --descent: -680;
  --line-gap: 0;
  --units-per-em: 2816;
  --absolute-descent: 680;
  --cap-height-scale: 0.7272;
  --descent-scale: 0.2414;
  --ascent-scale: 0.96875;
  --line-gap-scale: 0;
  --line-height-scale: 1.2102;
}
```

To font-size classes, it adds css variables for calculating the font-size in pixels:

```css
.text-6xl {
  font-size: 4rem;
  --font-size-rem: 4;
  --font-size-px: calc(var(--font-size-rem) * var(--root-font-size-px));
}
```

To line-height classes, it adds css variables for calculating the line-height in pixels:

```css
.leading-tight {
  line-height: 1.25;
  --line-height-unitless: 1.25;
  --line-height-px: calc(var(--line-height-unitless) * var(--font-size-px));
}
```

To the capsized element's pseduo selectors, it adds the trimming calculation:

```css
.capsize::before {
  content: '';
  display: block;
  height: 0;
  --line-height-normal: calc(var(--line-height-scale) * var(--font-size-px));
  --specified-line-height-offset-double: calc(var(--line-height-normal) - var(--line-height-px));
  --specified-line-height-offset: calc(var(--specified-line-height-offset-double) / 2);
  --specified-line-height-offset-to-scale: calc(
    var(--specified-line-height-offset) / var(--font-size-px)
  );
  --prevent-collapse-to-scale: calc(var(--prevent-collapse) / var(--font-size-px));
  --line-gap-scale-half: calc(var(--line-gap-scale) / 2);
  --leading-trim-top: calc(
    var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale-half) - var(
        --specified-line-height-offset-to-scale
      ) + var(--prevent-collapse-to-scale)
  );
  margin-top: calc(-1em * var(--leading-trim-top));
}

.capsize::after {
  content: '';
  display: block;
  height: 0;
  --line-height-normal: calc(var(--line-height-scale) * var(--font-size-px));
  --specified-line-height-offset-double: calc(var(--line-height-normal) - var(--line-height-px));
  --specified-line-height-offset: calc(var(--specified-line-height-offset-double) / 2);
  --specified-line-height-offset-to-scale: calc(
    var(--specified-line-height-offset) / var(--font-size-px)
  );
  --prevent-collapse-to-scale: calc(var(--prevent-collapse) / var(--font-size-px));
  --line-gap-scale-half: calc(var(--line-gap-scale) / 2);
  --leading-trim-bottom: calc(
    var(--descent-scale) + var(--line-gap-scale-half) - var(
        --specified-line-height-offset-to-scale
      ) + var(--prevent-collapse-to-scale)
  );
  margin-bottom: calc(-1em * var(--leading-trim-bottom));
}
```

To the capsized element, it adds a small padding to prevent margin collapse:

```css
.capsize {
  padding-top: calc(1px * var(--prevent-collapse));
  padding-bottom: calc(1px * var(--prevent-collapse));
  padding-right: 0;
  padding-left: 0;
}
```
