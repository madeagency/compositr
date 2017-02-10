# Compositr 🌆 + 🌅 = 🌇
Use canvas to easily composite images. Supports file uploading and image URLs

## Installation
`npm install compositr --save`

or

`yarn add compositr`

## Example

See `/example`

## Usage

```
  const canvas = document.querySelector('canvas')
  const imageElement = document.querySelector('img')
  const compositr = new Compositr(canvas)
  compositr.draw([
    { image: 'someImage.png', operation: 'screen' },
    { image: imageElement },
    { image: imageLoadPromise, operation: 'source-over', opacity: 0.8 }
  ])
```

With `HTMLImageElement`:

```
  var canvas = document.querySelector('canvas');
  var input = document.querySelector('input');
  var compositr = new Compositr(canvas);
  var onFileUpload = compositr.drawOnUpload([
    { image: undefined, operation: 'screen' },
    { image: compositr.load('images/CTEMF-foreground-01.png'), operation: 'source-over' },
    { image: compositr.load('images/CTEMF-foreground-02.png'), operation: 'screen' },
    { image: compositr.load('images/CTEMF-logo.png'), operation: 'source-over' },
  ]);
  input.addEventListener('change', onFileUpload);
```


**TBA**:
 - Note about resetting opacity but not operation
 - Full API
 - Link to [supported operations](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)