# [react-body-highlighter](https://www.npmjs.com/package/react-body-highlighter)

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

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

**Example**: https://codesandbox.io/s/sharp-cray-dgbp3?file=/src/App.tsx

## Props

All props are optional so if they are not passed to the component, they will fallback to default values or be undefined.

| Prop              | Purpose                                                                                     | Type             | Default                  |
| ----------------- | ------------------------------------------------------------------------------------------- | ---------------- | -----------------------  |
| bodyColor         | Default color of unworked body muscle                                                       | String           | `#B6BDC3`                |
| data              | Data array containing exercise JSON objects: `{ name: 'Bicep Curl', muscles: ['biceps'] }`. While the `name` and `muscles` attributes are required, you may optionally provide another attribute `frequency` to represent the exercise count/intensity.                       | Object[]         |                          |
| highlightedColors | Array containing colors to display depending on frequency a muscle was worked (array[frequency-1] = color). For an example of how this works, see the CodeSandbox example above in the *Usage* section.                                                                 | []               | `['#0984e3', '#74b9ff']` |
| hoverColor        | Color shown when a user hovers over an unworked muscle                                      | String           | `#757782`                |
| onClick           | Callback when muscle is clicked. The function will get passed a JSON object of the following structure: `{ muscle: 'name', stats: { exercises: [''], frequency: 0 } }`                                                                                                 | (exercise) => {} |                         |
| responsive        | Whether SVG automatically resizes w/ parent container                                       | Boolean          | `true`                   |
| scale             | Manually scaling SVG through it's transform property                                        | Float            | `1`                      |
| style             | CSSProperties style object that gets passed to SVG's parent container (div)                 | Object           |                          |
| svgStyle          | CSSProperties style object that gets passed to SVG element                                  | Object           |                          |
| type              | Denotes type of model view (values: 'anterior' or 'posterior')                              | String           | `anterior`               |

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
[downloads-image]: http://img.shields.io/npm/dm/react-body-highlighter.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-body-highlighter
[npm-version-image]: https://img.shields.io/npm/v/react-body-highlighter.svg
[npm-version-url]: https://www.npmjs.com/package/react-body-highlighter
