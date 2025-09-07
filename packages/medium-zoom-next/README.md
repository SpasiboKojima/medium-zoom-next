<p align="center">
  <a href="https://medium-zoom-next.vercel.app"><img src="../../logo.svg" alt="Demo" width="64"></a>
  <h3 align="center">medium-zoom-next</h3>
  <p align="center">A JavaScript library for zooming images like Medium</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/medium-zoom-next">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/medium-zoom-next">
  </a>
  <a href="https://github.com/SpasiboKojima/medium-zoom-next/blob/master/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/SpasiboKojima/medium-zoom-next?color=%231968cb">
  </a>
  <a href="https://www.npmcharts.com/compare/medium-zoom-next">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/medium-zoom-next?color=%231968cb">
  </a>
  <br>
  <a href="https://unpkg.com/medium-zoom-next/dist/">
    <img alt="npm package minimized gzipped size" src="https://img.shields.io/bundlejs/size/medium-zoom-next?color=%231968cb">
  </a>
  <a href="https://github.com/SpasiboKojima/medium-zoom-next/blob/master/packages/medium-zoom/package.json">
    <img src="https://img.shields.io/badge/dependencies-none-lightgrey.svg?color=%231968cb" alt="no dependencies">
  </a>
</p>

<p align="center">
  <a href="https://medium-zoom-next.vercel.app">
    <img src="https://user-images.githubusercontent.com/6137112/43369906-7623239a-9376-11e8-978b-6e089be499fb.gif" alt="Medium Zoom Demo">
  </a>
  <br>
  <br>
</p>

<details>
  <summary><strong>Contents</strong></summary>

<!--
Generate the table of contents using:

```
npx doctoc README.md --maxlevel 3
```
-->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Selectors](#selectors)
  - [Options](#options)
  - [Methods](#methods)
  - [Attributes](#attributes)
  - [Events](#events)
- [Framework integrations](#framework-integrations)
- [Examples](#examples)
- [Debugging](#debugging)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

</details>

## Features

- 📱 **Responsive** — scale on mobile and desktop
- 🚀 **Performant and lightweight** — optimized to reach 60 [fps](https://en.wikipedia.org/wiki/Framerate)
- ⚡️ **High definition support** — load the HD version of your image on zoom
- 🔎 **Flexibility** — apply the zoom to a selection of images
- 🖱 **Mouse, keyboard and gesture friendly** — click anywhere, press a key or scroll away to close the zoom
- 🎂 **Event handling** — trigger events when the zoom enters a new state
- 📦 **Customization** — set your own margin, background and scroll offset
- 🔧 **Pluggable** — add your own features to the zoom
- 💎 **Custom templates** — extend the default look to match the UI of your app
- 🔌 [**Framework agnostic**](#framework-integrations) — works with React, Vue, Angular, Svelte, Solid, etc.

## Usage

> [Try it out in the browser](https://codesandbox.io/s/github/francoischalifour/medium-zoom/tree/master/website)

Import the library as a module:

```js
import mediumZoom from 'medium-zoom-next'
import 'medium-zoom-next/dist/style.css'
```

Or import the library with a script tag:

```html
<script src="node_modules/medium-zoom-next/dist/medium-zoom.min.cjs"></script>
<link href="node_modules/medium-zoom-next/dist/style.css" rel="stylesheet" />
```


Assuming you add the `data-zoomable` attribute to your images:

```js
mediumZoom('[data-zoomable]')
```

## API

```ts
mediumZoom(selector?: string | HTMLElement | HTMLElement[] | NodeList, options?: object): Zoom
```

### Selectors

The selector allows attaching images to the zoom. It can be of the following types:

- [CSS selectors](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
- [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
- [`NodeList`](https://developer.mozilla.org/docs/Web/API/NodeList)
- [`Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)

```js
// CSS selector
mediumZoom('[data-zoomable]')

// HTMLElement
mediumZoom(document.querySelector('#cover'))

// NodeList
mediumZoom(document.querySelectorAll('[data-zoomable]'))

// Array
const images = [
  document.querySelector('#cover'),
  ...document.querySelectorAll('[data-zoomable]'),
]

mediumZoom(images)
```

## Framework integrations

Medium Zoom is a JavaScript library that can be used with any framework. Here are some integrations that you can use to get started quickly:

- [React](./apps/website/src/components/react)
- [React Markdown](./apps/website/src/components/react)
- [Vue](./apps/website/src/components/vue)
- [Svelte](./apps/website/src/components/svelte)

## Examples

You can see [examples here](apps/website/src/components/), or check out the [storybook](https://medium-zoom-next-storybook.vercel.app/).

## Browser support

| Edge            | Chrome | Firefox | Safari |
| --------------- | ------ | ------- | ------ |
| 138             | 109    | 140     | 15.6   |

<blockquote>
  <p align="center">
    Cross-browser testing is sponsored by
  </p>
  <p align="center">
    <a href="https://www.browserstack.com">
      <img src="https://user-images.githubusercontent.com/6137112/44587083-35987000-a7b2-11e8-8e0d-8ba15de83802.png" alt="BrowserStack" height="35">
    </a>
  </p>
</blockquote>

## License

MIT © [François Chalifour](https://francoischalifour.com)
