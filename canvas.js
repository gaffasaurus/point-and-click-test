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

const images = {};
async function loadImageAsNeeded (url) {
  if (!images[url]) {
    images[url] = await loadImage(url);
  }
  return images[url];
}

function clickableFromJson ({ type, x, y, action, ...data }) {
  switch (type) {
    case 'image': {
      // Load the image and make a Clickable from it
      const clickable = new ClickableImage(images[data.image], x, y, action);
      if (data.idealHeight) {
        clickable.scale = data.idealHeight / clickable.image.height;
      }
      return clickable;
    }
    case 'arrow': {
      // Make an arrow
      const clickable = new Arrow(x, y, data.direction, action);
      return clickable;
    }
    default: {
      throw new Error(`${type} is not a valid clickable type.`);
    }
  }
}
const npcs = [];
function createNPC(action) {
  switch (action.class) {
    case "ExampleNpc": {
      npcs.push(new ExampleNpc(action.name, action.id, action.dialogue, action.visible));
      break;
    }
    case "Geff": {
      npcs.push(new Geff(action.name, action.id, action.dialogue, action.visible));
      break;
    }
    default: {
      throw new Error(`${type} is not a valid NPC.`);
    }
  }
}

async function loadRoomData(jsonUrl) {
  // Load JSON file
  const roomData = await fetch(jsonUrl)
    .then(response => response.json());
  // Store room data in object
  const rooms = {};
  // Loop through each room in the JSON
  for (const [roomId, { bg, clickables }] of Object.entries(roomData)) {
    rooms[roomId] = {
      background: await loadImageAsNeeded(bg),
      clickables: []
    };
    // Loop through each image thing in the room
    for (const clickable of clickables) {
      if (clickable.image) await loadImageAsNeeded(clickable.image);
      if (clickable.preload) {
        // `preload` shall be an array of image URLs to load before starting
        // (for example, because they're used later on, such as after being
        // unlocked).
        for (const preloadImageUrl of clickable.preload) {
          await loadImageAsNeeded(preloadImageUrl);
        }
      }
      if (clickable.action.type === "npc") {
        createNPC(clickable.action);
      }
      rooms[roomId].clickables.push(clickableFromJson(clickable));
    }
  }
  return rooms;
}

let loaded = false;

let roomData = {};
let currentRoom = null;
let textbox;
let inventory;
let note;
loadRoomData('clickable-data.json')
  .then(rooms => {
    roomData = rooms;
    currentRoom = 'main room';
    setSize();
    textbox = new TextBox();
    inventory = new Inventory();
    note = new Note();
    codeLock = new CodeLock();
    loaded = true;
    redraw();
  });

loadingScreen();

function loadingScreen() {
  ctx.save();
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, IDEAL_WIDTH, IDEAL_WIDTH / RATIO);
  ctx.font = "50px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Loading...", IDEAL_WIDTH / 2, IDEAL_WIDTH / RATIO / 2);
  ctx.restore();
}

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
  textbox.draw();
  inventory.draw();
  note.draw();
  codeLock.draw();
}


function manageTextBox(e) {
  if (textbox.visible) {
    textbox.incrementCounter();
  }
  if (textbox.textCounter >= textbox.text.length) {
    textbox.resetTextCounter();
    textbox.speaker = "";
    textbox.setVisible(false);
  }
}

function manageNote(e) {
  if (note.visible) {
    note.incrementCounter();
    if (note.clickCounter >= 2) {
      note.setVisible(false);
      note.resetCounter();
    }
  }
}

function checkClickablesClicked(e) {
  for (const clickable of roomData[currentRoom].clickables) {
    if (clickable.hover(e)) {
      textbox.speaker = "";
      clickable.onClick();
      textbox.resetTextCounter();
      break; // Do not attempt to click any other clickables
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

function checkInventoryBoxes(e) {
  if (inventory.visible) {
    inventory.hoverOverBox(e);
  }
}

function manageCodeLock(e) {
  if (codeLock.visible) {
    codeLock.onClick(e);
  }
}

function selectFromInventory() {
  if (inventory.visible) {
    inventory.selectItem();
  }
}

window.addEventListener('click', e => {
  if (currentRoom === null) return;
  if (!textbox.visible && !codeLock.visible && !note.visible) {
    checkClickablesClicked(e);
  }
  manageTextBox(e);
  manageNote(e);
  manageCodeLock(e);
  selectFromInventory();
  redraw();
});

window.addEventListener('mousemove', e => {
  if (currentRoom === null) return;
  if (!textbox.visible && !codeLock.visible && !note.visible) {
    checkClickablesHovered(e);
  }
  if (codeLock.visible) {
    codeLock.hover(e);
  }
  checkShowInventory(e);
  checkInventoryBoxes(e)
  redraw();
});
