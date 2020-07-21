class Inventory {
  constructor() {
    this.x = IDEAL_WIDTH / 5.68;
    this.y = 0;
    // this.width = 2 * (IDEAL_WIDTH / 2 - this.x); //centers // See below
    // this.height = IDEAL_WIDTH / RATIO / 6; // See below
    this.bgColor = "rgba(192, 192, 192, 0.95)";
    //boxes
    this.maxSlots = 10;
    this.boxSize = 50; //side lengths of squares
    this.boxSpacing = this.boxSize / 2;
    this.boxesWidth = this.maxSlots * (this.boxSize + this.boxSpacing) - this.boxSpacing; //width of all slots
    this.boxYOffset = 35;
    this.boxColor = "rgb(128, 128, 128)";
    this.width = this.maxSlots * (this.boxSize + this.boxSpacing) + this.boxSpacing;
    this.height = this.boxYOffset + this.boxSize + this.boxSpacing;
    this.boxXOffset = this.x + (this.width / 2 - this.boxesWidth / 2);
    //text
    this.text = "Inventory:";
    this.font = "20px sans-serif";
    this.fontSize = 20;
    ctx.save();
    ctx.font = this.font;
    this.textX = (this.x + this.width / 2) - (ctx.measureText(this.text).width / 2);
    this.textY = 20;
    ctx.restore();
    //tab when not visible
    this.tabHeight = 20;
    this.tabText = "▲ Hover to show inventory ▲";
    ctx.save();
    this.tabFont = "16px sans-serif"
    this.tabFontSize = 16;
    ctx.font = this.tabFont;
    this.tabTextX = (this.x + this.width / 2) - (ctx.measureText(this.tabText).width / 2);
    this.tabTextY = 14;
    ctx.restore();
    //important attributes
    this.visible = false;
    this.items = [];

    this.animating = false;
    this.progress = 0;
  }

  // Utility method that gets the top-left corner of the box given its index
  getBoxPosition(index) {
    return {
      x: (this.boxSize + this.boxSpacing) * index + this.boxXOffset,
      y: this.boxYOffset
    };
  }

  draw() {
    // Using an easing function makes it look nice, the animation
    const state = easeInOutCubic(this.progress);
    ctx.save();
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 3;
    ctx.fillStyle = this.bgColor;
    //draw outside rectangle
    const rectHeight = interpolate(this.tabHeight, this.height, state);
    ctx.strokeRect(this.x, this.y, this.width, rectHeight);
    ctx.fillRect(this.x, this.y, this.width, rectHeight);
    if (state > 0) {
      ctx.font = this.font;
      //draw text
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(this.text, this.textX, interpolate(-this.fontSize, this.textY, state));
      //draw empty boxes
      for (let i = 0; i < this.maxSlots; i++) {
        const { x, y } = this.getBoxPosition(i);
        ctx.fillStyle = this.boxColor;
        ctx.strokeRect(x, interpolate(-this.boxSize - 3, y, state), this.boxSize, this.boxSize);
        ctx.fillRect(x, interpolate(-this.boxSize - 3, y, state), this.boxSize, this.boxSize);
      }
      //draw items
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const { x, y } = this.getBoxPosition(i);
        // TODO draw items
      }
    }
    if (state < 1) {
      ctx.globalAlpha = interpolate(1, 0, state);
      ctx.font = this.tabFont;
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(this.tabText, this.tabTextX, this.tabTextY + interpolate(0, this.height - this.tabHeight, state));
    }
    ctx.restore();
  }

  hover(e) {
    const testX = (e.clientX - canvas.offsetLeft) / scale;
    const testY = (e.clientY - canvas.offsetTop) / scale;
    if (!this.visible) {
      return between(testX, this.x, this.x + this.width) && between(testY, this.y, this.y + this.tabHeight);
    } else {
      return between(testX, this.x, this.x + this.width) && between(testY, this.y, this.y + this.height);
    }
  }

  setVisible(b) {
    if (this.visible !== b) {
      if (this.animating) {
        this.animating.stop();
      }
      const duration = 500;
      const start = this.animating
        ? 2 * Date.now() - this.animating.start - duration
        : Date.now();
      // Why do animations in JS have to be sooo complicated
      this.animating = animManager.animate(() => {
        this.progress = (Date.now() - start) / duration;
        if (b) {
          if (this.progress >= 1) {
            this.progress = 1;
            this.animating.stop();
            this.animating = null;
          }
        } else {
          // It goes the other direction as it hides
          this.progress = 1 - this.progress;
          if (this.progress <= 0) {
            this.progress = 0;
            this.animating.stop();
            this.animating = null;
          }
        }
      });
      this.animating.start = start;
    }
    this.visible = b;
  }

  addItem(item) {
    this.items.push(item);
  }
}
