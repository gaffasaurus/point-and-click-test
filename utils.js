function between(n, lower, upper) {
  return n >= lower && n <= upper;
}

function removeFromArray(arr, element) {
  const ix = arr.indexOf(element);
  if (ix >= 0) {
    arr.splice(ix, 1);
  }
}

function replaceInArray(arr, old, ...newItems) {
  const ix = arr.indexOf(old);
  if (ix >= 0) {
    arr.splice(ix, 1, ...newItems);
  }
  // If `old`'s not in the array for some reason, it won't add `newItems`
}

function interpolate(from, to, progress) {
  return (to - from) * progress + from;
}

function easeInOutCubic(t) {
  t *= 2;
  if (t < 1) return t * t * t / 2;
  t -= 2;
  return (t * t * t + 2) / 2;
}

// Canvas utility functions

/**
 * Makes an image with the given URL as a source and returns a Promise that
 * resolves to the image when it loads.
 * @example
 * loadImage('./image-url.png')
 *   .then(image => {
 *     ctx.drawImage(image, 0, 0);
 *   });
 *
 * @param {string} url
 * @return {Image}
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.addEventListener('load', e => {
      resolve(image);
    });
    image.addEventListener('error', reject);
  });
}

const pixelGettingCanvas = document.createElement('canvas');
const pixelGettingContext = pixelGettingCanvas.getContext('2d');
/**
 * Gets the pixels in an Image.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageData}
 * @param {Image} image
 * @return {ImageData} This has a `data` property which is an array of integers
 * 0-255; every four integers represents the red, green, blue, and alpha
 * (transparency) channels. The pixels go in rows from left to right, top to
 * bottom.
 */
function getPixels(image) {
  pixelGettingCanvas.width = image.width;
  pixelGettingCanvas.height = image.height;
  pixelGettingContext.drawImage(image, 0, 0);
  return pixelGettingContext.getImageData(0, 0, image.width, image.height);
}
