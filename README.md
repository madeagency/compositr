# Compositr 🌆 + 🌅 = 🌇
[![Code
Climate](https://codeclimate.com/repos/58a2f3f6f6c55b0de700021f/badges/a9f2a07e1f098fff42f7/gpa.svg)](https://codeclimate.com/repos/58a2f3f6f6c55b0de700021f/feed)

Use canvas to easily composite images. Supports file uploading and image URLs

## Features
 - Composite several `HTMLImageElement`s and `HTMLCanvasElement`s together in a few lines of code
 - Accepts `Promise`s for drawing when images are loaded
 - Helper methods to easily load images via `File` or **URL**
 - Helper methods to easily load images uploaded by user
 - `Flow` typings

## Installation
`npm install compositr --save`

or

`yarn add compositr`

## Example

See [/example](example)

## Usage

`Compositr.draw` is passed an `Array` of `Layer`s which describe the images, how the are composited and the order in which they are drawn (implicitly using the order of items in the `Array`).

Each `Layer` has 3 properties: `image`, `operation` and `opacity`

 - `image` is one of `<HTMLImageElement> | <HTMLCanvasElement> | <Promise>`
 - `operation` is a string, see `supportedCompositionOperations` in [src/constants.js](src/constants.js)
 - `opacity` is a number from `0` to `1`

**Take note**: `operation` is not reset when each new layer is drawn but `opacity` is reset to `1`

With `HTMLImageElement`, `HTMLCanvasElement` & `Promise`:

```javascript
  // Construction
  const outputCanvas = document.querySelector('.output')
  const compositr = new Compositr(outputCanvas)

  /**
  * The composition will consist of 3 sources:
  * 1. An HTMLImageElement 
  * 2. A HTMLCanvasElement (different to the output canvas)
  * 3. A Promise for an image loaded via URI by the helper function 
  */
  const imageElement = document.querySelector('.some-image')
  const webglDrawing = document.querySelector('.webgl-drawing')
  const imageLoadPromise = compositr.load('/assets/images/another-image.png')

  compositr.draw([
    { image: imageElement },
    { image: webglDrawing, operation: 'source-over', opacity: 0.3 },
    { image: imageLoadPromise, operation: 'screen', opacity: 0.8 }
  ])
```

`Compositr` makes using file uploads easy by merging `event.target.files` with layers where the image is left `undefined`:


```javascript
  const canvas = document.querySelector('.output')
  const compositr = new Compositr(canvas)
  const input = document.querySelector('#fileInput')
  const onFileUpload = compositr.drawOnUpload([
    { image: compositr.load('images/background.png'), operation: 'source-over' },
    // The uploaded image will be inserted here:
    { image: undefined, operation: 'screen' },
    { image: compositr.load('images/foreground.png'), operation: 'screen' },
    { image: compositr.load('images/CTEMF-logo.png'), operation: 'source-over' },
  ])
  input.addEventListener('change', onFileUpload)
```

## TODO

### Readme
 - Screenshot with usage / example

### Library
 - `Compositr.draw` and `Compositr.drawOnUpload` should return a promise
 - Support for `input[type="file"]` in layer: { image: fileInput, ... }
 - Universal!
 - Responsiveness option
 - Better support for different canvas sizes

## License

*Compositr* is © 2017 MADE Code PTY Ltd.
It is free software, and may be redistributed under the terms specified in the [LICENSE] file.

[LICENSE]: LICENSE

## Maintained by

[![madeagency](https://www.made.co.za/logo.png)](https://www.made.co.za?utm_source=github)

*Compositr* was created and is maintained MADE Code PTY Ltd.
The names and logos for MADE Code are trademarks of MADE Code PTY Ltd.

We love open source software. See our Github Profile for more.

We're always looking for talented people who love programming. [Get in touch] with us.

[Get in touch]: https://www.made.co.za?utm_source=github
