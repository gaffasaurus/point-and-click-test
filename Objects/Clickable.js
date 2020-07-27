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
        inventory.addItem(new Item(icon, action.name, action.id, action.reusable, action.combinations));
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
          if (action.key.includes(selected.id)) {
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
      case 'note': {
        const zoomed = new Image();
        zoomed.src = action.image;
        note.setImage(zoomed);
        note.setVisible(true);
      }
      case 'npc': {
        for (let npc of npcs) {
          if (npc.id === action.id) {
            for (let selected of inventory.selected) {
              if (selected.id in action.receiveDialogue) {
                textbox.setText(action.receiveDialogue[selected.id])
                textbox.setSpeaker(action.name);
                textbox.setVisible(true);
                removeFromArray(inventory.items, selected);
                inventory.selected = [];
                npc.receiveItem();
                return;
              }
            }
            if (inventory.selected.length > 0) {
              textbox.setText(action.rejectDialogue);
              textbox.setSpeaker(action.name);
              textbox.setVisible(true);
              inventory.selected = [];
            } else if (!Array.isArray(action.dialogue[npc.counter])) {
              const dialogue = action.dialogue[npc.counter];
              if (dialogue.type == "item") {
                textbox.setText(dialogue.text);
                textbox.setSpeaker(action.name);
                textbox.setVisible(true);
                const icon = new Image();
                icon.src = dialogue.image;
                inventory.addItem(new Item(icon, dialogue.name, dialogue.id, dialogue.reusable, dialogue.combinations));
                npc.itemTaken();
              }
            } else {
              textbox.setText(action.dialogue[npc.counter]);
              textbox.setSpeaker(action.name);
              textbox.setVisible(true);
            }
          }
        }
        break;
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

  createNPCs(action) {
    switch (action.id) {
      case 'ExampleNpc': {

      }
    }
  }
}
