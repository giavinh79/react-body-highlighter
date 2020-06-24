# [react-body-highlighter](https://www.npmjs.com/package/react-body-highlighter)

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url]

> I created this package to have a body highlighter component compatible with React.js with minimal dependencies and some extra props for further functionality. The SVG polygons were leveraged from the React Native package [react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter).

<p align="center">
  <img width="260" src="https://github.com/GV79/react-body-highlighter/blob/master/image/anterior-example.png" alt="React Body Highlighter">
</p>

## Installation

```sh
$ npm install react-body-highlighter
```

## Usage

```js
import React from 'react';
import Model from 'react-body-highlighter';

export default function Component() {
  return (
    <Model
      data={[
        { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
        { name: 'Push Ups', muscles: ['chest'] },
      ]}
      style={{ width: '20rem', padding: '5rem' }}
    />
  );
}
```

## Props

All props are optional so if they are not passed to the component, they will fallback to default values or be undefined.

| Prop              | Purpose                                                                                     | Type             | Default                  |
| ----------------- | ------------------------------------------------------------------------------------------- | ---------------- | -----------------------  |
| bodyColor         | Default color of unworked body muscle                                                       | String           | `#B6BDC3`                |
| data              | Data array containing exercise JSON objects: `{ name: 'Bicep Curl', muscles: ['biceps']) }` | Object[]         |                          |
| highlightedColors | Defaults to `['#0984e3', '#74b9ff']`                                                        | []               | `['#0984e3', '#74b9ff']` |
| hoverColor        | Color shown when a user hovers over unworked muscle                                         | String           | `#757782`                |
| onClick           | Callback when muscle is clicked (passes JSON object of the muscle, exercises & frequency)   | (exercise) => {} |                          |
| responsive        | Whether SVG automatically resizes w/ parent container                                       | Boolean          | `true`                   |
| scale             | Manually scaling SVG through transform property                                             | Float            | `1`                      |
| style             | CSSProperties style object that gets passed to SVG's parent container (div)                 | Object           |                          |
| svgStyle          | CSSProperties style object that gets passed to SVG element                                  | Object           |                          |
| type              | Denotes type of model (anterior/front view vs. posterior/back view)                         | String           | `anterior`               |

## List of muscles/parts supported

```
/* Back */
trapezius
upper-back
lower-back

/* Chest */
chest

/* Arms */
biceps
triceps
forearm
back-deltoids
front-deltoids

/* Abs */
abs
obliques

/* Legs */
adductor
hamstring
quadriceps
abductors
calves
gluteal

/* Head */
head
neck
```

[license-image]: http://img.shields.io/npm/l/react-body-highlighter.svg
[license-url]: LICENSE
[npm-version-image]: https://img.shields.io/npm/v/react-body-highlighter.svg
[npm-version-url]: https://www.npmjs.com/package/react-body-highlighter
