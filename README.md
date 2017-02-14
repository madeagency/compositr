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


##TODO
###Readme
 - Screenshot with usage / example
 - Note about resetting opacity but not operation
 - Full API
 - Link to [supported operations](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

###Library
 - `Compositr.draw` and `Compositr.drawOnUpload` should return a promise
 - Universal!
 - Responsiveness option
 - Better support for different canvas sizes

 License
-------

*Compositr* is © 2016 MADE Code PTY Ltd.
It is free software, and may be redistributed under the terms specified in the [LICENSE] file.

[LICENSE]: LICENSE

Maintained by
----------------

[![madeagency](https://www.made.co.za/logo.png)](https://www.made.co.za?utm_source=github)

*Compositr* was created and is maintained MADE Code PTY Ltd.
The names and logos for MADE Code are trademarks of MADE Code PTY Ltd.

We love open source software. See our Github Profile for more.

We're always looking for talented people who love programming. [Get in touch] with us.

[Get in touch]: https://www.made.co.za?utm_source=github
