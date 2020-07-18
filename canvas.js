const RATIO = 2.2;
const canvas = document.querySelector(".myCanvas");
const width = canvas.width = document.body.clientWidth;
const height = canvas.height = width / RATIO;
const ctx = canvas.getContext('2d');

async function loadRoomData () {
  // Load JSON file
  const roomData = await fetch('clickable-data.json')
    .then(response => response.json());
  // Store room data in object
  const rooms = {};
  // Loop through each room in the JSON
  for (const [roomId, { bg, clickables }] of Object.entries(roomData)) {
    rooms[roomId] = {
      background: await loadImage(bg),
      clickables: []
    };
    // Loop through each image thing in the room
    for (const { image, x, y, text } of clickables) {
      // Load the image and make a Clickable from it
      const clickable = new Clickable(await loadImage(image), x, y, text);
      rooms[roomId].clickables.push(clickable);
    }
  }
  return rooms;
}
const clickables = [];
const bgimages = [];
loadRoomData()
  .then(rooms => {
    for (const key in rooms) {
      bgimages.push(rooms[key].background);
      clickables.push(...rooms[key].clickables);
    }
    drawBackground();
    drawClickables();
  });

//Draw background
function drawBackground() {
  ctx.drawImage(bgimages[0], 0, 0); //Will have a counter to track which room you are in later, this is for testing.
}

function drawClickables() {
  for (const clickable of clickables) {
    clickable.draw();
  }
}

function redraw() {
  drawBackground();
  drawClickables();
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

window.addEventListener('click', e => {
  for (const clickable of clickables) {
    if (clickable.hover(e)) {
      clickable.drawText();
    }
  }
});

window.addEventListener('mousemove', e => {
  for (const clickable of clickables) {
    clickable.changeOnHover(clickable.hover(e));
  }
});
