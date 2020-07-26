class Npc {
  constructor(name, id, dialogue, visible) {
    this.name = name;
    this.id = id;
    this.dialogue = dialogue;
    this.visible = visible;
    this.counter = 0;
  }

  incrementCounter() {
    return;
  }

  setVisible(b) {
    this.visible = b;
  }

  givenGift() {
    return;
  }
}
