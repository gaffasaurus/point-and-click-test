class Inventory {
  constructor() {
    this.x = 225;
    this.y = 0;
    this.width = 2 * (width/2 - this.x); //centers
    this.height = 110;
    this.bgColor = "rgb(192, 192, 192)";
    //boxes
    this.maxSlots = 10;
    this.boxSize = 50; //side lengths of squares
    this.boxSpacing = 25;
    this.boxesWidth = this.maxSlots * (this.boxSize + this.boxSpacing) - this.boxSpacing; //width of all slots
    this.boxXOffset = this.x + (this.width / 2 - this.boxesWidth / 2);
    this.boxYOffset = 40;
    this.boxColor = "rgb(128, 128, 128)";
    //text
    this.text = "Inventory:";
    this.font = "20px sans serif";
    ctx.save();
    ctx.font = this.font;
    this.textX = (this.x + this.width / 2) - (ctx.measureText(this.text).width / 2);
    this.textY = 20;
    ctx.restore();
    this.visible = false;
    this.items = [];
  }

  // Utility method that gets the top-left corner of the box given its index
  getBoxPosition(index) {
    return {
      x: (this.boxSize + this.boxSpacing) * index + this.boxXOffset,
      y: this.boxYOffset
    };
  }

  draw() {
    if (this.visible) {
      ctx.save();
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.lineWidth = 3;
      ctx.fillStyle = this.bgColor;
      ctx.font = this.font;
      //draw outside rectangle
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillRect(this.x, this.y, this.width, this.height);
      //draw text
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(this.text, this.textX, this.textY);
      //draw empty boxes
      for (let i = 0; i < this.maxSlots; i++) {
        const { x, y } = this.getBoxPosition(i);
        ctx.fillStyle = this.boxColor;
        ctx.strokeRect(x, y, this.boxSize, this.boxSize);
        ctx.fillRect(x, y, this.boxSize, this.boxSize);
      }
      //draw items
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const { x, y } = this.getBoxPosition(i);
        // TODO draw items
      }
      ctx.restore();
    }
  }

  hover(e) {
    const testX = (e.clientX - canvas.offsetLeft) / scale;
    const testY = (e.clientY - canvas.offsetTop) / scale;
    if (!this.visible) {
      return between(testX, this.x, this.x + this.width) && between(testY, this.y, this.y + 30);
    } else {
      return between(testX, this.x, this.x + this.width) && between(testY, this.y, this.y + this.height);
    }
  }

  setVisible(b) {
    this.visible = b;
  }

  addItem(item) {
    this.items.push(item);
  }
}
