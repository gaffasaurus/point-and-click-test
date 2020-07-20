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
  redraw();
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
loadRoomData()
  .then(rooms => {
    roomData = rooms;
    currentRoom = 'main room';
    setSizeAndRedraw();
    textbox = new TextBox();
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
}

window.addEventListener('click', e => {
  textbox.setVisible(false);
  if (currentRoom === null) return;
  for (const clickable of roomData[currentRoom].clickables) {
    if (clickable.hover(e)) {
      clickable.onClick();
    }
  }
  redraw();
});

window.addEventListener('mousemove', e => {
  if (currentRoom === null) return;
  for (const clickable of roomData[currentRoom].clickables) {
    clickable.changeOnHover(clickable.hover(e));
  }
  redraw();
});
