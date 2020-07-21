class AnimationManager {
  constructor({ beforeEach, afterEach } = {}) {
    this.onFrame = this.onFrame.bind(this);

    // Functions that are run before/after each frame
    this.beforeEachFrame = beforeEach;
    this.afterEachFrame = afterEach;
    // Functions that are run each frame
    this.animations = new Set();
    this.frameRequestId = null;
  }

  requestNextFrame() {
    if (this.frameRequestId !== null) {
      window.cancelAnimationFrame(this.frameRequestId);
    }
    this.frameRequestId = window.requestAnimationFrame(this.onFrame);
  }

  onFrame() {
    if (this.beforeEachFrame) this.beforeEachFrame();
    for (const animation of this.animations) {
      animation();
    }
    if (this.afterEachFrame) this.afterEachFrame();

    if (this.animations.size > 0) {
      this.requestNextFrame();
    } else {
      this.frameRequestId = null;
    }
  }

  animate(onFrame) {
    if (this.animations.has(onFrame)) {
      throw new Error('This function is already being animated!');
    }
    this.animations.add(onFrame);
    if (this.frameRequestId === null) {
      // Start animation if there are no ongoing animations
      this.requestNextFrame();
    }
    return {
      stop: () => {
        this.animations.delete(onFrame);
        if (this.animations.size === 0) {
          // Cancel the next animation frame if there are no other ongoing
          // animations
          window.cancelAnimationFrame(this.frameRequestId);
          this.frameRequestId = null;
        }
      }
    };
  }
}
