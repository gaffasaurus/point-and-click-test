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
    this.codeFont = "45px sans-serif";
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
    //submit/cancel button
    this.buttonYSpacing = 1.5;
    this.buttonHeight = 30;
    this.buttonY = this.y + this.height + this.buttonYSpacing;

    //colors
    this.bgColor = "rgb(186, 158, 130)";
    this.tabColor = "rgb(191, 176, 161)";
    this.descColor = "rgb(99, 8, 8)";
    this.boxColor = "rgb(252, 246, 159)";
    this.arrowColor = this.tabColor;
    this.arrowHoverColor = "rgb(120, 120, 120)";
    this.buttonColor = this.tabColor;
    this.buttonTextColor = this.descColor;
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
    if (side === "top") {
      return {
        x: this.getBoxPosition(index).x + this.arrowXOffset,
        y: this.y + this.boxYOffset - this.arrowYOffset
      }
    } else if (side === "bottom") {
      return {
        x: this.getBoxPosition(index).x + this.arrowXOffset,
        y: this.y + this.boxYOffset + this.boxHeight + this.arrowYOffset
      }
    }
  }

  draw() {
    if (this.visible && this.solution !== "none" && this.type !== "none") {
      this.length = this.solution.toString().length;
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
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = this.descColor;
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
      let arrowX = this.getArrowPosition(0, "top").x;
      const arrowTopY = this.getArrowPosition(0, "top").y;
      const arrowBotY = this.getArrowPosition(0, "bottom").y;
      for (let i = 0; i < this.length; i++) {
        //increase arrow
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowTopY);
        ctx.lineTo(arrowX + this.arrowWidth, arrowTopY);
        ctx.lineTo(arrowX + this.arrowWidth / 2, arrowTopY - this.arrowHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        //decrease arrow
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowBotY);
        ctx.lineTo(arrowX + this.arrowWidth, arrowBotY);
        ctx.lineTo(arrowX + this.arrowWidth / 2, arrowBotY + this.arrowHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        arrowX = this.getBoxPosition(i + 1).x + this.arrowXOffset;
      }
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.font = this.codeFont;
      ctx.textAlign = "center";
      for (let i = 0; i < this.length; i++) {
        let { x, y } = this.getBoxPosition(i);
        if (this.type === "number") {
          ctx.fillText(this.display[i], x + this.boxWidth / 2, y + this.boxHeight / 1.3);
        } else if (this.type === "string") {
          ctx.fillText(String.fromCharCode(this.display[i]), x + this.boxWidth / 2, y + this.boxHeight / 1.3);
        }
      }
      //change color on hover
      if (this.hoveredPos !== "none" && this.side !== "none") {
        ctx.fillStyle = this.arrowHoverColor;
        let { x, y } = this.hoveredPos;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.arrowWidth, y);
        if (this.side === "top") {
          ctx.lineTo(x + this.arrowWidth / 2, y - this.arrowHeight);
        } else if (this.side === "bottom") {
          ctx.lineTo(x + this.arrowWidth / 2, y + this.arrowHeight);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
      //buttons
      this.buttonXSpacing = this.width / 6;
      this.buttonWidth = this.width * 3/8.0;
      this.submitX = IDEAL_WIDTH / 2 + this.buttonXSpacing / 2;
      this.cancelX = IDEAL_WIDTH / 2 - this.buttonWidth - this.buttonXSpacing / 2;
      ctx.fillStyle = this.buttonColor;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      //submit
      ctx.strokeRect(this.submitX, this.buttonY, this.buttonWidth, this.buttonHeight);
      ctx.fillRect(this.submitX, this.buttonY, this.buttonWidth, this.buttonHeight);
      //cancel
      ctx.strokeRect(this.cancelX, this.buttonY, this.buttonWidth, this.buttonHeight);
      ctx.fillRect(this.cancelX, this.buttonY, this.buttonWidth, this.buttonHeight);
      //text
      ctx.fillStyle = this.buttonTextColor;
      ctx.fillText("✓ Submit", this.submitX + this.buttonWidth / 2.0, this.buttonY + this.buttonHeight / 1.5);
      ctx.fillText("✗ Cancel", this.cancelX + this.buttonWidth / 2, this.buttonY + this.buttonHeight / 1.5);

      ctx.restore();
    }
  }

  area(x1, y1, x2, y2, x3, y3) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
  }

  isInside(x, y, x1, y1, x2, y2, x3, y3) {
    if (x < Math.min(x1, x2, x3) || x > Math.max(x1, x2, x3) || y < Math.min(y1, y2, y3) || y > Math.max(y1, y2, y3)) return false;
    const area = this.area(x1, y1, x2, y2, x3, y3);
    return Math.abs(this.area(x, y, x1, y1, x2, y2) + this.area(x, y, x1, y1, x3, y3) + this.area(x, y, x2, y2, x3, y3) - area) < 0.001;
  }

  hover(e) {
    for (let i = 0; i < this.length; i++) {
      let top = this.getArrowPosition(i, "top");
      if (this.hoverHelper(top.x, top.y, e, "top", i)) {
        this.side = "top";
        this.hoveredPos = top;
        return true;
      };
      let bottom = this.getArrowPosition(i, "bottom");
      if (this.hoverHelper(bottom.x, bottom.y, e, "bottom", i)) {
        this.side = "bottom";
        this.hoveredPos = bottom;
        return true;
      };
    }
    this.side = "none";
    this.hoveredPos = "none";
    return false;
  }

  hoverHelper(x, y, e, side, i) {
    let points;
    if (side === "top") {
      points = [
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
          y: y - this.arrowHeight
        }
      ];
    } else if (side === "bottom") {
      points = [
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
    }
    const testX = (e.clientX - canvas.offsetLeft) / scale;
    const testY = (e.clientY - canvas.offsetTop) / scale;
    if (this.isInside(testX, testY, points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y)) {
      this.arrowLoc = {
        index: i,
        side: side
      }
      return true;
    } else {
      return false;
    }
  }

  onClick(e) {
    if (this.hover(e)) {
      const index = this.arrowLoc.index;
      const side = this.arrowLoc.side;
      if (this.type === "number") {
        if (side === "top") {
          if (this.display[index] < 9) {
            this.display[index] += 1;
          } else {
            this.display[index] = 0;
          }
        } else if (side === "bottom") {
          if (this.display[index] > 0) {
            this.display[index] -= 1;
          } else {
            this.display[index] = 9;
          }
        }
      } else if (this.type === "string") {
        if (side === "top") {
          if (this.display[index] < 90) {
            this.display[index] += 1;
          } else {
            this.display[index] = 65;
          }
        } else if (side === "bottom") {
          if (this.display[index] > 65) {
            this.display[index] -= 1;
          } else {
            this.display[index] = 90;
          }
        }
      }
    } else {
      const testX = (e.clientX - canvas.offsetLeft) / scale;
      const testY = (e.clientY - canvas.offsetTop) / scale;
      if (between(testX, this.submitX, this.submitX + this.buttonWidth) && between(testY, this.buttonY, this.buttonY + this.buttonHeight)) {
        let correct;
        if (this.type === "number") {
          correct = this.display.join("") === this.solution;
        } else if (this.type === "string") {
          let code = "";
          for (let letter of this.display) {
            code += String.fromCharCode(letter);
          }
          correct = code === this.solution;
        }
        this.setVisible(false);
        textbox.setTextCounter(0);
        if (correct) {
          textbox.setText(this.unlockText);
          const clickables = roomData[currentRoom].clickables;
          console.log(this.unlocked);
          replaceInArray(clickables, this.currentClickable, clickableFromJson(this.unlocked));
        } else {
          textbox.setText(this.incorrectText);
        }
        textbox.setVisible(true);
      } else if (between(testX, this.cancelX, this.cancelX + this.buttonWidth) && between(testY, this.buttonY, this.buttonY + this.buttonHeight)) {
        this.setVisible(false);
      }
    }
  }

  setVariables(solution, type, incorrectText, unlockText, currentClickable, unlocked) {
    this.solution = solution;
    this.type = type;
    this.incorrectText = incorrectText;
    this.unlockText = unlockText;
    this.currentClickable = currentClickable;
    this.unlocked = unlocked;
    this.display = [];
    for (let i = 0; i < solution.toString().length; i++) {
      if (this.type === "number") {
        console.log("push");
        this.display.push(0);
      } else if (this.type === "string") {
        this.display.push(65);
      }
    }
    console.log(this.display);
  }

  setVisible(b) {
    this.visible = b;
  }
}
