# Compositr 🌆 + 🌅 = 🌇
[![Code
Climate](https://codeclimate.com/repos/58a2f3f6f6c55b0de700021f/badges/a9f2a07e1f098fff42f7/gpa.svg)](https://codeclimate.com/repos/58a2f3f6f6c55b0de700021f/feed)

Use canvas to easily composite images. Supports file uploading and image URLs

## Installation
`npm install compositr --save`

or

`yarn add compositr`

## Example

See `/example`

## Usage

With `HTMLImageElement`, `HTMLCanvasElement` & `Promise`

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

With an uploaded image:

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
 - Note about resetting opacity but not operation
 - Full API
 - Link to [supported operations](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

### Library
 - `Compositr.draw` and `Compositr.drawOnUpload` should return a promise
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
