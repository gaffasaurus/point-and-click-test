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
      case 'text': {
        textbox.setText(action.text);
        textbox.setVisible(true);
        break;
      }
      case 'room': {
        currentRoom = action.dest;
        break;
      }
      case 'item': {
        const icon = new Image();
        icon.src = action.image;
        textbox.setText(action.text);
        textbox.setVisible(true);
        inventory.addItem(new Item(icon, action.name, action.id, action.reusable));
        const clickables = roomData[currentRoom].clickables;
        clickables.splice(clickables.indexOf(this), 1);
        break;
      }
      case 'locked': {
        if (inventory.selected.length > 0 && inventory.selected[0].id === action.key) {
          const selected = inventory.selected[0];
          textbox.setText(action.unlockText);
          textbox.setVisible(true);
          if (!selected.reusable) {
            removeFromArray(inventory.items, selected);
          }
          const clickables = roomData[currentRoom].clickables;
          replaceInArray(clickables, this, clickableFromJson(action.unlocked));
          removeFromArray(inventory.selected, selected);
        } else {
          textbox.setText(action.text);
          textbox.setVisible(true);
        }
        break;
      }
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
