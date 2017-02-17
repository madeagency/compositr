/* @flow */

import { supportedCompositionOperations, supportedImageSourceTypes } from './constants'
import { getMaxDpi } from './utils'

import loadImage from 'blueimp-load-image'

export type Layer = {
  image: Image | Promise<Image>,
  operation?: string,
  opacity?: number
}

const cache = {}

class Compositr {

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(node: HTMLCanvasElement) {
    if (Object.prototype.toString.call(node) !== '[object HTMLCanvasElement]') {
      throw `${node && node.toString()} is not a valid HTMLCanvasElement`
    }
    const context = node.getContext('2d')
    if (!context) {
      throw 'could not get 2d context for canvas'
    }

    this.canvas = node
    this.context = context

    const dpi = window.devicePixelRatio || 1
    const canvasBoundingRect = node.getBoundingClientRect()
    const { width, height } = canvasBoundingRect
    this.context.scale(dpi, dpi)
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`
    this.canvas.width = width * dpi
    this.canvas.height = height * dpi
  }

  _drawImage = (image: Image, operation?: string, opacity?: number) => {
    if (operation) {
      this.context.globalCompositeOperation = operation
    }
    if (opacity || opacity === 0) {
      this.context.globalAlpha = opacity
    }
    this.context.drawImage(image, 0, 0, this.canvas.width , this.canvas.height )
    this.context.globalAlpha = 1
  }

  draw = (layers: Layer[]) => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    return Compositr.resolveAllImagePromises(layers).then((results) => {
      results.map((result: any) => this._drawImage(result.image, result.operation, result.opacity))
      return results
    })
  }

  drawOnUpload = (layers: Layer[]) => {
    return (event: Event & any) => {
      const files = [...event.target.files]
      return this.draw(Compositr.interpolateLayersWithImages(layers, files.map(file => {
        return Compositr.loadImageFromFile(file, this.canvas.width, this.canvas.height)
      })))
    }
  }

  load = (source: Image & string & File) => {
    return new Promise((resolve: Function, reject: Function) => {
      const sourceType = Object.prototype.toString.call(source)
      if (sourceType === supportedImageSourceTypes.image) {
        resolve(source)
        return
      }
      if (sourceType === supportedImageSourceTypes.string) {
        resolve(Compositr.loadImageFromUrl(source))
        return
      }
      if (sourceType === supportedImageSourceTypes.file) {
        resolve(Compositr.loadImageFromFile(source, this.canvas.width, this.canvas.height))
        return
      }
      throw `Cannot load image from ${sourceType}`
    })
  }

  static isCompositionOperationValid(operation: string) {
    return Object.keys(supportedCompositionOperations).reduce((found: boolean, operationKey: string) => {
      return found || supportedCompositionOperations[operationKey] === operation
    }, false)
  }

  static loadImageFromUrl(url: string) {
    return new Promise((resolve: Function, reject: Function) => {
      if (cache[url]) return resolve(cache[url])
      const image = document.createElement('img')
      image.style.display = 'none'
      image.addEventListener('load', () => {
        cache[url] = image
        resolve(image)
      })
      image.src = url
    })
  }

  static loadImageFromFile(file: File, width: number, height: number) {
    return new Promise((resolve: Function, reject: Function) => {
      let options: any = {
        maxWidth: width,
        maxHeight: height,
        cover: true,
        canvas: true,
        aspectRatio: width / height,
        crossOrigin: true,
        noRevoke: true
      }
      getMaxDpi(file, (maxDpi: number) => {
        options.pixelRatio = maxDpi
        loadImage.parseMetaData(file, (data) => {
          if (data.exif) {
            options.orientation = data.exif.get('Orientation')
          }
          loadImage(file, (canvas) => {
            resolve(canvas)
          }, options)
        })
      }, window.devicePixelRatio)
    })
  }

  static resolveAllImagePromises(layers: Layer[]) {
    return Promise.all(layers.map((layer: Layer) => {
      return Promise.resolve(layer.image).then((image: Image) => {
        return {
          ...layer,
          image
        }
      })
    }))
  }

  static interpolateLayersWithImages(layers: Layer[], images: any[]) {
    let itemsToInsert = images.reverse()
    const newLayers =  layers.map((layer: Layer) => {
      return {
        ...layer,
        image: layer && layer.image || itemsToInsert.pop()
      }
    })
    return newLayers
  }
}

export default Compositr
