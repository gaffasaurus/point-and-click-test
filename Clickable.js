class Clickable {
  constructor(image, x, y, text) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.text = text;
    this.visible = true;
    this.hovered = false;
  }

  draw() {
    ctx.save();
    if (this.hovered) {
      ctx.filter = "drop-shadow(7px 7px 2px rgb(0, 0, 0))";
    }
    ctx.drawImage(this.image, this.x, this.y);
    ctx.restore();
  }

  setVisible(b) {
    this.visible = b;
  }

  between(n, lower, upper) {
    return n >= lower && n <= upper;
  }

  hover(e) {
    return this.between((e.clientX - canvas.offsetLeft) / scale, this.x, this.x + this.image.width) && this.between((e.clientY - canvas.offsetTop) / scale, this.y, this.y + this.image.height);
  }

  changeOnHover(hovered) {
    this.hovered = hovered;
  }

  drawText() {
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillText(this.text, 50, 500);
  }

  onClick() {
    this.drawText();
  }
}
