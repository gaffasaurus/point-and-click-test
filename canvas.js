const RATIO = 2.2;
const IDEAL_WIDTH = 1280;

const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');

let width, height, scale;
function setSizeAndRedraw() {
  width = canvas.width = document.body.clientWidth;
  height = canvas.height = width / RATIO;
  scale = width / IDEAL_WIDTH;
  ctx.scale(scale, scale);
}
window.addEventListener('resize', setSizeAndRedraw);

async function loadRoomData() {
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
    for (const { image, x, y, text, arrow } of clickables) {
      if (arrow) {
        // Make an arrow
        const arrowClickable = new Arrow(x, y, arrow.direction, arrow.to);
        rooms[roomId].clickables.push(arrowClickable);
      } else {
        // Load the image and make a Clickable from it
        const clickable = new Clickable(await loadImage(image), x, y, text);
        rooms[roomId].clickables.push(clickable);
      }
    }
  }
  return rooms;
}
let roomData = {};
let currentRoom;
loadRoomData()
  .then(rooms => {
    roomData = rooms;
    currentRoom = 'main room';
    setSizeAndRedraw();
  });

//Draw background
function drawBackground() {
  ctx.drawImage(roomData[currentRoom].background, 0, 0);
}

function drawClickables() {
  for (const clickable of roomData[currentRoom].clickables) {
    clickable.draw();
  }
}

function redraw() {
  drawBackground();
  drawClickables();
}
redraw();

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
  for (const clickable of roomData[currentRoom].clickables) {
    if (clickable.hover(e)) {
      clickable.onClick();
    }
  }
  redraw();
});

window.addEventListener('mousemove', e => {
  for (const clickable of roomData[currentRoom].clickables) {
    clickable.changeOnHover(clickable.hover(e));
  }
  redraw();
});
