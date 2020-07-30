class CodeLock {
  constructor() {
    this.visible = false;
    this.solution = "none";
    this.type = "none";
    this.locked = true;
    //boxes inside
    this.boxXOffset = 20;
    this.boxYOffset = 40;
    this.boxWidth = 50;
    this.boxHeight = 65;
    this.boxSpacing = this.boxWidth / 2;
    //background rectangle
    this.height = this.boxYOffset * 2 + this.boxHeight;
    this.y = IDEAL_WIDTH / RATIO / 2 - this.height / 2;
    //tab
    this.desc = "Enter the code:";
    this.tabHeight = 30;
    this.tabY = this.y - this.tabHeight - 1.5;
    //arrows
    this.arrowWidth = this.boxWidth / 1.7;
    this.arrowHeight = this.boxHeight / 4;
    this.arrowXOffset = this.boxWidth / 2 - this.arrowWidth / 2
    this.arrowYOffset = 10;
    //colors
    this.bgColor = "rgb(186, 158, 130)";
    this.tabColor = "rgb(191, 176, 161)";
    this.boxColor = "rgb(252, 246, 159)";
    this.arrowColor = this.tabColor;
  }

  getBoxPosition(index) {
    //gets top left corner of box given index
    return {
      x: this.x + this.boxXOffset + (this.boxWidth + this.boxSpacing) * index,
      y: this.y + this.boxYOffset
    };
  }

  getArrowPosition(index, side) { //side is "top" or "bottom"
    //gets leftmost point of triangle
    if (side == "top") {
      return {
        x: this.getBoxPosition(index).x + this.arrowXOffset,
        y: this.y + this.boxYOffset - this.arrowYOffset
      }
    } else if (side == "bottom") {
      return {
        x: this.getBoxPosition(index).x + this.arrowXOffset,
        y: this.y + this.boxYOffset + this.boxHeight + this.arrowYOffset
      }
    }
  }

  draw() {
    if (this.visible && this.solution !== "none" && this.type !== "none") {
      const this.length = this.solution.toString().length;
      ctx.save();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.fillStyle = this.bgColor;
      this.width = this.boxXOffset * 2 + this.length * (this.boxWidth + this.boxSpacing) - this.boxSpacing;
      this.x = IDEAL_WIDTH / 2 - this.width / 2;
      //draw background rectangle
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillRect(this.x, this.y, this.width, this.height);
      //draw description tab
      ctx.fillStyle = this.tabColor;
      const tabWidth = (this.boxWidth + this.boxSpacing) * this.length - this.boxSpacing;
      const tabX = this.x + this.boxXOffset;
      ctx.strokeRect(tabX, this.tabY, tabWidth, this.tabHeight);
      ctx.fillRect(tabX, this.tabY, tabWidth, this.tabHeight);
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "rgb(0, 0, 0)";
      const textX = IDEAL_WIDTH / 2 - ctx.measureText(this.desc).width / 2;
      const textY = (this.y + this.tabY) / 1.95;
      ctx.fillText(this.desc, textX, textY);
      //draw each box for code input
      ctx.fillStyle = this.boxColor;
      ctx.lineWidth = 5;
      let boxX = this.x + this.boxXOffset;
      const boxY = this.y + this.boxYOffset;
      for (let i = 0; i < this.length; i++) {
        ctx.strokeRect(boxX, boxY, this.boxWidth, this.boxHeight);
        ctx.fillRect(boxX, boxY, this.boxWidth, this.boxHeight);
        boxX += this.boxWidth + this.boxSpacing;
      }
      //draw arrows for changing numbers/letters
      ctx.fillStyle = this.arrowColor;
      ctx.lineWidth = 3;
      let arrowX = this.x + this.boxXOffset + this.arrowXOffset;
      const arrowIncY = boxY - this.arrowYOffset;
      const arrowDecY = boxY + this.boxHeight + this.arrowYOffset;
      for (let i = 0; i < this.length; i++) {
        //increase arrow
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowIncY);
        ctx.lineTo(arrowX + this.arrowWidth, arrowIncY);
        ctx.lineTo(arrowX + this.arrowWidth / 2, arrowIncY - this.arrowHeight);
        // ctx.lineTo(arrowX, arrowIncY);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        //decrease arrow
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowDecY);
        ctx.lineTo(arrowX + this.arrowWidth, arrowDecY);
        ctx.lineTo(arrowX + this.arrowWidth / 2, arrowDecY + this.arrowHeight);
        // ctx.lineTo(arrowX, arrowDecY);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        //move to next position
        // let { x, y } = this.getBoxPosition(i + 1);
        arrowX = this.getBoxPosition(i + 1).x + this.arrowXOffset;
      }

      // switch (this.type) {
      //   case ("number"): {
      //     ctx.fillRect(this.x, this.y, this.width, this.height);
      //     break;
      //   }
      //   case ("string"): {
      //     ctx.fillStyle = 'green';
      //     ctx.fillRect(this.x, this.y, this.width, this.height);
      //     break;
      //   }
      // }
      ctx.restore();
    }
  }

  hover(e) {
    for (let i = 0; i < this.length) {
      let { x, y } = this.getArrowPosition(i, "top");
      let points = [
        {
          x: x,
          y: y
        },
        {
          x: x + this.arrowWidth,
          y: y
        },
        {
          x: x + this.arrowWidth / 2,
          y: y + this.arrowHeight
        }
      ];
      let area = (this.arrowWidth * this.arrowHeight) / 2;
      if (e.clientX + canvas.offsetLeft )
    }
  }

  onClick(e) {

  }

  setSolution(solution, type) {
    this.solution = solution;
    this.type = type;
  }

  setVisible(b) {
    this.visible = b;
  }
}
