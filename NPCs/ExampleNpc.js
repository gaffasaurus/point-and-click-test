class ExampleNpc extends Npc {
  constructor(name, id, dialogue, visible) {
    super(name, id, dialogue, visible);
    this.counter = 0;
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
  }
}
