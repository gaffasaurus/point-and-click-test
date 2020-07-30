class Npc {
  constructor(name, id, dialogue, visible) {
    this.name = name;
    this.id = id;
    this.dialogue = dialogue;
    this.visible = visible;
    this.counter = 0;
  }

  setVisible(b) {
    this.visible = b;
  }

  receiveItem() {
    return;
  }

  itemTaken() {
    return;
  }

  getDialogue() {
    return;
  }
}
