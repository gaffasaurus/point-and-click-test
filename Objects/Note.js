class Note {
  constructor() {
    this.clickCounter = 0
    this.visible = false;
  }

  draw() {
    const maxHeight = parseFloat(IDEAL_WIDTH / RATIO);
    if (this.image && this.visible) {
      const ratio = this.image.height / maxHeight;
      const noteWidth = this.image.width / ratio;
      const noteHeight = maxHeight;
      const x = IDEAL_WIDTH / 2 - noteWidth / 2;
      const y = maxHeight / 2 - noteHeight / 2;
      ctx.drawImage(this.image, x, y, noteWidth, noteHeight);
    }
  }

  setImage(image) {
    this.image = image;
  }

  setVisible(b) {
    this.visible = b;
  }

  incrementCounter() {
    this.clickCounter++;
  }

  resetCounter() {
    this.clickCounter = 0;
  }

  setCounter(counter) {
    this.clickCounter = counter;
  }

}
