class Clickable {
  constructor(image, x, y, text) {
    this.image = image;
    if (image) {
      this.pixels = getPixels(image);
    }
    this.x = x;
    this.y = y;
    this.text = text;
    this.visible = true;
    this.hovered = false;
    this.scale = 1;
  }

  draw() {
    ctx.save();
    if (this.hovered) {
      ctx.filter = "drop-shadow(7px 7px 2px rgb(0, 0, 0))";
    }
    ctx.drawImage(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale);
    ctx.restore();
  }

  setVisible(b) {
    this.visible = b;
  }

  between(n, lower, upper) {
    return n >= lower && n <= upper;
  }

  hover(e) {
    const testX = ((e.clientX - canvas.offsetLeft) / scale - this.x) / this.scale;
    const testY = ((e.clientY - canvas.offsetTop) / scale - this.y) / this.scale;
    const inRect = this.between(testX, 0, this.image.width) &&
      this.between(testY, 0, this.image.height);
    if (!inRect) {
      return false;
    }
    if (this.pixels) {
      const pixelArray = this.pixels.data;
      const pixelIndex = Math.floor(testY) * this.pixels.width + Math.floor(testX);
      // The pixels array has four integers for each pixel, the last of which is
      // the alpha/transparency channel. Thus, multiplying the pixel index by 4
      // then adding 3 will get the transparency (0 to 255) of the pixel.
      const transparency = pixelArray[pixelIndex * 4 + 3];
      // There might be some translucent artefacts in the artwork; checking if
      // the transparency is greater than some threshold makes it less sensitive to
      // them.
      return transparency > 10;
    } else {
      return false;
    }
  }

  changeOnHover(hovered) {
    this.hovered = hovered;
  }

  drawText() {
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillText(this.text, 50, 500);
  }

  onClick() {
    textbox.setText(this.text);
    textbox.setVisible(true);
  }
}
