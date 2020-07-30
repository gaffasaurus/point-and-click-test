class ExampleNpc extends Npc {
  constructor(name, id, dialogue, visible) {
    super(name, id, dialogue, visible);
    this.gifted = false;
  }

  incrementCounter() {
    for (let item of inventory.items) {
      if (item.id == "clownDoll") {
        this.counter = 1;
      }
      if (item.id == "clownKey") {
        this.counter = 2;
      }
    }
    if (this.gifted) {
      this.counter = 3;
    }
    if (this.counter <= 3) {
      const clickables = roomData[currentRoom].clickables;
      for (let i = 0; i < clickables.length; i++) {
        if (clickables[i].action.id === "comboLockUnlocked") {
          this.counter = 4;
          break;
        }
      }
    }

  }

  receiveItem() {
    this.gifted = true;
  }

  itemTaken() {
    this.gifted = false;
  }
}
