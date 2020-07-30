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
  }

  receiveItem() {
    this.gifted = true;
  }

  itemTaken() {
    this.gifted = false;
  }
}
