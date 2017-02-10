/* @flow */

export function getMaxDpi(file: File, callback: Function, dpi: number = 1) {
  if (dpi === 1) {
    return callback(1)
  }
  const fileReader = new FileReader()
  fileReader.addEventListener('load', function() {
    const sample = new Image(),
          maxPixels = 16e6 /* sixteen million */
    let maxDpi = dpi
    sample.addEventListener('load', function() {
      const pixels = sample.width * sample.height
      if (pixels * maxDpi > maxPixels) {
        maxDpi = Math.max(maxPixels / pixels)
      }
      callback(maxDpi)
    })
    sample.src = fileReader.result
  })
  fileReader.readAsDataURL(file) 
}