class Clickable {
  constructor(x, y, action) {
    this.x = x;
    this.y = y;
    this.action = action;
    this.visible = true;
    this.hovered = false;
  }

  draw() {
    return;
  }

  setVisible(b) {
    this.visible = b;
  }

  hover(e) {
    return false;
  }

  changeOnHover(hovered) {
    this.hovered = hovered;
  }

  drawText() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillText(this.text, 50, 500);
  }

  onClick() {
    const { action: { type, ...action } } = this;
    switch (type) {
      // Displays text in a box
      case 'text': {
        textbox.setText(action.text);
        textbox.setVisible(true);
        break;
      }
      // Changes the room
      case 'room': {
        currentRoom = action.dest;
        break;
      }
      // Gives an item and replaces or destroys the Clickable
      case 'item': {
        const icon = new Image();
        icon.src = action.image;
        textbox.setText(action.text);
        textbox.setVisible(true);
        inventory.addItem(new Item(icon, action.name, action.id, action.reusable));
        const clickables = roomData[currentRoom].clickables;
        if (action.replace) {
          replaceInArray(clickables, this, clickableFromJson(action.replace));
        } else {
          removeFromArray(clickables, this);
        }
        break;
      }
      // Checks if the key is selected, and if so, displays text and replaces
      // itself with a new Clickable or destroys itself
      case 'locked': {
        if (inventory.selected.length > 0) {
          const selected = inventory.selected[0];
          if (selected.id === action.key) {
            textbox.setText(action.unlockText);
            textbox.setVisible(true);
            if (!selected.reusable) {
              removeFromArray(inventory.items, selected);
            }
            const clickables = roomData[currentRoom].clickables;
            if (action.unlocked) {
              replaceInArray(clickables, this, clickableFromJson(action.unlocked));
            } else {
              removeFromArray(clickables, this);
            }
            removeFromArray(inventory.selected, selected);
          } else {
            textbox.setText([selected.name + " cannot be used on this object!"]);
            textbox.setVisible(true);
          }
        } else {
          textbox.setText(action.text);
          textbox.setVisible(true);
        }
        break;
      }
      case 'container': {
        textbox.setText(action.text);
        textbox.setVisible(true);
        const icon = new Image();
        icon.src = action.image;
        inventory.addItem(new Item(icon, action.name, action.id, action.reusable));

      }
      // Plays audio
      case 'audio': {
        const audio = new Audio(action.file);
        if (audio.paused) {
          audio.currentTime = 0;
          audio.play();
        } else {
          audio.pause();
        }
        break;
      }
      default: {
        console.warn(`${type} is not a valid action type.`);
      }
    }
  }
}
