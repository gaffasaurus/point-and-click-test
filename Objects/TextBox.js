class TextBox {
  constructor() {
    this.speaker = "";
    this.text = ["hello"];
    this.textCounter = -1;
    this.x = IDEAL_WIDTH / 3.9;
    this.y = IDEAL_WIDTH / RATIO / 1.4;
    this.width = 2 * (IDEAL_WIDTH/2 - this.x);
    this.height = IDEAL_WIDTH / RATIO / 4.2;
    this.color = "rgba(83, 186, 237, 0.9)";

    this.textXPadding = IDEAL_WIDTH / 64.0;
    this.textX = this.x + this.textXPadding;
    this.textY = this.y + this.height / 3.5;
    this.textYSpacing = this.height / 5.2;
    this.visible = false;
  }

  wrapText(text, x, y) {
    let str = "";
    const words = text.split(" ");
    for (let word of words) {
      if (ctx.measureText(str + word + " ").width > this.width - this.textXPadding * 2) {
        ctx.fillText(str, x, y);
        y += this.textYSpacing;
        str = word + " ";
      } else {
        str += word + " ";
      }
    }
    ctx.fillText(str, x, y);
  }

  draw() {
    if (this.visible) {
      ctx.save();
      ctx.font = '20px System';
      ctx.fillStyle = this.color;
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      //Draw textbox
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillRect(this.x, this.y, this.width, this.height);
      //set text settings
      ctx.fillStyle = 'rgb(0, 0, 0)';
      //write text
      this.wrapText(this.text[this.textCounter], this.textX, this.textY);
      //Display speaker box if there is a speaker
      if (this.speaker.length > 0) {
        ctx.fillStyle = this.color;
        ctx.strokeRect(this.x, this.y - this.speakerHeight, this.speakerWidth, this.speakerHeight);
        ctx.fillRect(this.x, this.y - this.speakerHeight, this.speakerWidth, this.speakerHeight);
        //write speaker
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillText(this.speaker, this.speakerX, this.speakerY);
      }
      ctx.restore();
    }
  }

  setSpeaker(speaker) {
    this.speaker = speaker;
    ctx.font = '20px System';
    this.speakerXPadding = 20;
    this.speakerWidth = ctx.measureText(this.speaker).width + this.speakerXPadding;
    this.speakerHeight = this.height/ 4.0;
    this.speakerX = this.x + this.speakerXPadding / 2; //centers speaker text
    this.speakerY = (this.y - this.speakerHeight) + this.speakerHeight / 1.56;
  }

  setText(text) {
    this.text = text;
  }

  resetTextCounter() {
    this.textCounter = -1;
  }

  setTextCounter(counter) {
    this.textCounter = counter;
  }

  incrementCounter() {
    this.textCounter += 1;
  }

  setVisible(b) {
    this.visible = b;
  }
}
