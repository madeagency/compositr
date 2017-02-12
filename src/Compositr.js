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
    this.context.scale(dpi, dpi)
  }

  load(source: Image & string & File) {
    return new Promise((resolve: Function, reject: Function) => {
      const sourceType = Object.prototype.toString.call(source)
      if (sourceType === supportedImageSourceTypes.image) {
        return source
      }
      if (sourceType === supportedImageSourceTypes.string) {
        resolve(this.loadImageFromUrl(source))
        return
      }
      if (sourceType === supportedImageSourceTypes.file) {
        resolve(this.loadImageFromFile(source))
        return
      }
      throw `Cannot load image from ${sourceType}`
    })
  }

  isCompositionOperationValid(operation: string) {
    return Object.keys(supportedCompositionOperations).reduce((found: boolean, operationKey: string) => {
      return found || supportedCompositionOperations[operationKey] === operation
    }, false)
  }

  _drawLayer(image: Image, width: number, height: number, operation?: string, opacity?: number) {
    if (operation) {
      this.context.globalCompositeOperation = operation
    }
    if (opacity || opacity === 0) {
      this.context.globalAlpha = opacity
    }
    this.context.drawImage(image, 0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height  / window.devicePixelRatio)
    this.context.globalAlpha = 1
  }

  draw(layers: Layer[]) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const imageLoadPromises = layers.map((layer: Layer) => {
      return new Promise((resolve, reject) => {
        Promise.resolve(layer.image).then((image: Image) => {
          resolve({
            ...layer,
            image
          })
        })
      })
    })
    Promise.all(imageLoadPromises).then((results) => {
      const dpi = window.devicePixelRatio || 1
      const width = this.canvas.width / dpi
      const height = this.canvas.height / dpi
      results.map((result: any) => this._drawLayer(result.image, width, height, result.operation, result.opacity))
    })
  }

  drawOnUpload(layers: Layer[]) {
    return (event: Event & any) => {
      const imageLoadPromises = [...event.target.files].map(this.loadImageFromFile.bind(this))
      this.draw(this.interpolateLayersWithImages(layers, imageLoadPromises))
    }
  }

  interpolateLayersWithImages(layers: Layer[], images: any[]) {
    let itemsToInsert = images.reverse()
    const newLayers =  layers.map((layer: Layer) => {
      return {
        ...layer,
        image: layer && layer.image || itemsToInsert.pop()
      }
    })
    return newLayers
  }

  loadImageFromUrl(url: string) {
    return new Promise((resolve: Function, reject: Function) => {
      if (cache[url]) return cache[url]
      const image = document.createElement('img')
      image.style.display = 'none'
      image.addEventListener('load', () => {
        cache[url] = image
        resolve(image)
      })
      image.src = url
    })
  }

  loadImageFromFile(file: File) {
    return new Promise((resolve: Function, reject: Function) => {
      let options: any = {
        maxWidth: this.canvas.width,
        maxHeight: this.canvas.height,
        cover: true,
        canvas: true,
        aspectRatio: 1,
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
      })
    })
  }
}

export default Compositr
