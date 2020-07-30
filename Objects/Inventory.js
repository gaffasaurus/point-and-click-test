class Inventory {
  constructor() {
    // this.width = 2 * (IDEAL_WIDTH / 2 - this.x); //centers // See below
    // this.height = IDEAL_WIDTH / RATIO / 6; // See below
    this.bgColor = "rgba(192, 192, 192, 0.9)";
    //boxes
    this.maxSlots = 10;
    this.boxSize = 50; //side lengths of squares
    this.boxSpacing = this.boxSize / 2;
    this.boxesWidth = this.maxSlots * (this.boxSize + this.boxSpacing) - this.boxSpacing; //width of all slots
    this.boxYOffset = 35;
    this.boxColor = "rgb(150, 150, 150)";
    this.selectedOutline = "rgb(255, 255, 0)"
    this.width = this.maxSlots * (this.boxSize + this.boxSpacing) + this.boxSpacing;
    this.height = this.boxYOffset + this.boxSize + this.boxSpacing;
    this.x = IDEAL_WIDTH / 2 - this.width / 2;
    this.y = 0;
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
    //item name on hover
    // this.itemTagColor = "rgb(255, 253, 173)"
    this.descFont = "bold 12px sans-serif";
    this.descFontSize = 14;
    // ctx.font = this.itemTagFont;
    //important attributes
    this.visible = false;
    this.items = [];
    this.selected = [];

    this.animating = false;
    this.progress = 0;
  }

  // Utility method that gets the top-left corner of the box given its index
  getBoxPosition(index) {
    const state = easeInOutCubic(this.progress);
    return {
      x: (this.boxSize + this.boxSpacing) * index + this.boxXOffset,
      y: interpolate(-this.boxSize - 3, this.boxYOffset, state)
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
        ctx.strokeRect(x, y, this.boxSize, this.boxSize);
        ctx.fillRect(x, y, this.boxSize, this.boxSize);
      }
      //draw items
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const { x, y } = this.getBoxPosition(i);
        if (this.selected[0] === item) {
          this.drawSelectedOutline({ x, y });
        }
        ctx.drawImage(item.image, x, y, this.boxSize, this.boxSize);
        if (this.selected.length > 0) {
          this.drawItemDescription(this.selected[0].name);
        }
      }
    }
    if (state < 1) {
      ctx.globalAlpha = interpolate(1, 0, state);
      ctx.font = this.tabFont;
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(this.tabText, this.tabTextX, this.tabTextY + interpolate(0, this.height - this.tabHeight, state));
    }
    if (this.visible) {
      this.displayItemText();
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

  hoverOverBox(e) {
    const testX = (e.clientX - canvas.offsetLeft) / scale;
    const testY = (e.clientY - canvas.offsetTop) / scale;
    for (let i = 0; i < this.maxSlots; i++) {
      const { x, y } = this.getBoxPosition(i);
      if (between(testX, x, x + this.boxSize) && between(testY, y, y + this.boxSize)) {
        this.boxNum = i;
        return;
      }
    }
    this.boxNum = -1;
  }

  drawItemDescription(itemName) {
    ctx.save();
    ctx.font = this.descFont;
    const xPadding = 30;
    const yPadding = 18;
    const descX = this.x + this.width / 2.0 - ctx.measureText(itemName).width / 2.0;
    const descY = this.height + yPadding;
    const descBoxX = descX - xPadding;
    const descBoxY = this.height + 1.5;
    const descBoxWidth = 2 * (this.width / 2.0 - descBoxX + this.x);
    const descBoxHeight = 25;
    const state = easeInOutCubic(this.progress);
    ctx.fillStyle = this.bgColor;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.strokeRect(descBoxX, interpolate(-this.boxSize - 3, descBoxY, state), descBoxWidth, descBoxHeight);
    ctx.fillRect(descBoxX, interpolate(-this.boxSize - 3, descBoxY, state), descBoxWidth, descBoxHeight);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillText(itemName, descX, interpolate(-this.boxSize - 3, descY, state));
    ctx.restore();
  }

  displayItemText() {
    if (this.boxNum >= 0 && this.selected.length == 0) {
      // ctx.strokeStyle = "rgb(0, 0, 0)";
      // ctx.fillStyle = this.itemTagColor;
      const item = this.items[this.boxNum];
      let itemName;
      if (item) {
        itemName = this.items[this.boxNum].name;
      } else {
        itemName = "Empty Slot";
      }
      this.drawItemDescription(itemName);
    }
  }

  drawSelectedOutline(boxPos) {
    ctx.save();
    ctx.strokeStyle = this.selectedOutline;
    ctx.lineWidth = 4;
    ctx.strokeRect(boxPos.x, boxPos.y, this.boxSize, this.boxSize);
    ctx.restore();
  }

  selectItem() {
    if (this.items[this.boxNum]) {
      // const boxPos = this.getBoxPosition(this.boxNum);
      // if (this.selected[0] === this.items[this.boxNum]) {
      //   this.drawSelectedOutline(boxPos);
      // }
      const item = this.items[this.boxNum];
      switch(this.selected.length) {
        case 0: {
          this.selected.push(item);
          break;
        }
        case 1: {
          if (item !== this.selected[0]) {
            this.selected.push(item);
          } else {
            this.selected.pop();
            return;
          }
          let foundCombo = false;
          if (this.selected[0].combinations && this.selected[1].combinations) {
            for (let combo of this.selected[0].combinations) {
              if (combo.partner === this.selected[1].id) {
                removeFromArray(this.items, this.selected[0]);
                removeFromArray(this.items, this.selected[1]);
                this.selected = [];
                const newIcon = new Image();
                newIcon.src = combo.image;
                this.items.push(new Item(newIcon, combo.name, combo.id, combo.reusable, combo.combinations));
                foundCombo = true;
              }
            }
            if (!foundCombo) {
              this.selected = [];
              textbox.setTextCounter(0);
              textbox.setText(["These items cannot be combined!"]);
              textbox.setVisible(true);
            }
          }
          break;
        }
      }
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
