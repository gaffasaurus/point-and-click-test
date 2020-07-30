class Geff extends Npc {
  constructor(name, id, dialogue, visible) {
    super(name, id, dialogue, visible);
  }

  incrementCounter() {
    for (let item of inventory.items) {
      if (item.id == "clownDoll") {
        this.counter = 1;
      }
      if (item.id == "clownKey") {
        this.counter = 2;
      }
      for (let npc of npcs) {
        console.log(npc.id, npc.counter);
        if (npc.id === "dave" && npc.counter === 4) {
          this.counter = 3;
          break;
        }
      }
    }
  }
}
