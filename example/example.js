const compositr = new Compositr(output)
const fileInput = document.querySelector('[type="file"]')
const shuffleImagesButton = document.querySelector('#shuffleImagesButton')
const shuffleOperationsButton = document.querySelector('#shuffleOperationsButton')
const options = document.querySelector('.options')
const selection = document.querySelector('.selection')
const imageElements = [...document.querySelectorAll('.options img')]
const maxSelected  = 3

const operation = [
  'darken',
  'light',
  'screen',
  'multiply',
  'color',
  'luminosity',
  'overlay',
  'hard-light',
  'soft-light'
]

const randomIndex = array => Math.floor(Math.random() * array.length)
const any = array => array[randomIndex(array)]
const take = (array, count) => {
  let pool = array.map(i => i)
  return [...new Array(count)].map(() => {
    return pool.splice(randomIndex(pool), 1)[0]
  })
}

let selectedImages = take(imageElements, maxSelected).map(i => i.src).map(compositr.load)
let uploadedImages = []
let layers = createLayersWithRandomOperations([
  ...selectedImages,
  ...uploadedImages
])

function shuffleImages() {
  selectedImages = take(imageElements, maxSelected).map(compositr.load)
  layers = createLayersWithRandomOperations([
    ...selectedImages,
    ...uploadedImages
  ])
  draw()
}

function shuffleOperations() {
  layers = createLayersWithRandomOperations([
    ...selectedImages,
    ...uploadedImages
  ])
  draw()
}

function clearImages() {
  selectedImages = []
  uploadedImages = []
  layers = []
  imageElements.forEach(image => image.classList.remove('selected'))
}

function toggleImage(image) {
  if (image.classList.contains('selected')) {
    removeImage(image)
  } else {
    addImage(image)
  }
}

function removeImage(image) {
  image.classList.remove('selected')
  alert(selectedImages.length)
  selectedImages = selectedImages.reduce((images, src) => {
    debugger
    return (src === image.src) ? images : [].concat(images, src)
  }, [])
  alert(selectedImages.length)  
  layers = createLayersWithRandomOperations([
    ...selectedImages,
    ...uploadedImages
  ])
  draw()
}

function addImage(image) {
  image.classList.add('selected')
  selectedImages.push(compositr.load(image.src))
  layers = createLayersWithRandomOperations([
    ...selectedImages,
    ...uploadedImages
  ])
  draw()
}

function createLayersWithRandomOperations(images) {
  return images.map(image => ({
    image,
    operation: any(operation)
  }))
}

function draw() {
  compositr.draw(layers)
}

shuffleImagesButton.addEventListener('click', shuffleImages)
shuffleOperationsButton.addEventListener('click', shuffleOperations)

dragula([options, selection])
.on('drop', cloned => {
})

draw()