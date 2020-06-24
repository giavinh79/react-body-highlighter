# react-native-body-highlighter

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

I created this package to have a body highlighter component compatible with React.js with minimal dependencies and some extra props for further functionality. The SVG polygons were leveraged from the React Native package [react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter).

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
