const RATIO = 2.2;
const IDEAL_WIDTH = 1280;
const BODY_MARGIN = 10;

const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');

let width, height, scale;
function setSize() {
  // Get available space for the canvas
  const widthSpace = window.innerWidth - BODY_MARGIN * 2;
  const heightSpace = window.innerHeight - BODY_MARGIN * 2;
  if (heightSpace * RATIO > widthSpace) {
    // Basing the canvas width on the window height would make the canvas too
    // wide, so make the canvas width equal to the window width
    scale = widthSpace / IDEAL_WIDTH;
  } else {
    scale = heightSpace * RATIO / IDEAL_WIDTH;
  }
  width = scale * IDEAL_WIDTH;
  height = scale * IDEAL_WIDTH / RATIO;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(scale * window.devicePixelRatio, scale * window.devicePixelRatio);
}
window.addEventListener('resize', e => {
  setSize();
  redraw();
});

let animManager = new AnimationManager({
  afterEach: redraw
});

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
    for (const { type, x, y, action, ...data } of clickables) {
      switch (type) {
        case 'image': {
          // Load the image and make a Clickable from it
          const clickable = new ClickableImage(await loadImage(data.image), x, y, action);
          if (data.idealHeight) {
            clickable.scale = data.idealHeight / clickable.image.height;
          }
          rooms[roomId].clickables.push(clickable);
          break;
        }
        case 'arrow': {
          // Make an arrow
          const clickable = new Arrow(x, y, data.direction, action);
          rooms[roomId].clickables.push(clickable);
          break;
        }
        default: {
          console.warn(`${type} is not a valid clickable type.`);
        }
      }
    }
  }
  return rooms;
}
let roomData = {};
let currentRoom = null;
let textbox;
let inventory;
loadRoomData()
  .then(rooms => {
    roomData = rooms;
    currentRoom = 'main room';
    setSize();
    textbox = new TextBox();
    inventory = new Inventory();
    redraw();
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
  try {
    textbox.draw();
  } catch (err) {
    console.error(err);
  }
  try {
    inventory.draw();
  } catch (err) {
    console.error(err);
  }
}


function manageTextBox(e) {
  if (textbox.visible) {
    textbox.incrementCounter();
  }
  if (textbox.textCounter >= textbox.text.length) {
    textbox.resetTextCounter();
    textbox.setVisible(false);
  }
}

function checkClickablesClicked(e) {
  for (const clickable of roomData[currentRoom].clickables) {
    if (clickable.hover(e)) {
      clickable.onClick();
      textbox.resetTextCounter();
    }
  }
}

function checkClickablesHovered(e) {
  for (const clickable of roomData[currentRoom].clickables) {
    clickable.changeOnHover(clickable.hover(e));
  }
}

function checkShowInventory(e) {
  inventory.setVisible(inventory.hover(e));
}

window.addEventListener('click', e => {
  if (currentRoom === null) return;
  checkClickablesClicked(e);
  manageTextBox(e);
  redraw();
});

window.addEventListener('mousemove', e => {
  // console.log(textbox.text[textbox.textCounter]);
  if (currentRoom === null) return;
  checkClickablesHovered(e);
  checkShowInventory(e);
  redraw();
});
