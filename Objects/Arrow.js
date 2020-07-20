const directions = {
  left: { offsetX: 1, rotation: 0 },
  right: { offsetX: -1, rotation: Math.PI },
  up: { offsetY: 1, rotation: Math.PI / 2 },
  down: { offsetY: -1, rotation: -Math.PI / 2 },
};

class Arrow extends Clickable {
  constructor(x, y, direction, action) {
    if (!directions[direction]) {
      throw new Error(`${direction} is not a valid direction, fool!`);
    }
    super(x, y, action);
    this.direction = direction;
    this.size = 20;
    this.padding = 10;
  }

  draw() {
    if (!this.visible) return;

    const { x, y, direction, size } = this;
    ctx.save();
    if (!this.hovered) {
      ctx.globalAlpha = 0.5;
    }
    ctx.fillStyle = 'red';
    ctx.translate(x, y);
    ctx.rotate(directions[direction].rotation);
    ctx.beginPath();
    ctx.moveTo(0, 0); // Tip of arrowhead
    ctx.lineTo(size, size);
    ctx.lineTo(size, size / 3);
    ctx.lineTo(size * 2, size / 3);
    ctx.lineTo(size * 2, -size / 3);
    ctx.lineTo(size, -size / 3);
    ctx.lineTo(size, -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  hover(e) {
    const { x, y, direction, size, padding } = this;
    const { offsetX = 0, offsetY = 0 } = directions[direction];
    const testX = (e.clientX - canvas.offsetLeft) / scale - offsetX * size;
    const testY = (e.clientY - canvas.offsetTop) / scale - offsetY * size;
    return between(testX, x - size - padding, x + size + padding) &&
      between(testY, y - size - padding, y + size + padding);
  }
}
