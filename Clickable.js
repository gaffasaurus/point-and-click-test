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
      default: {
        console.warn(`${type} is not a valid action type.`);
      }
    }
  }
}
