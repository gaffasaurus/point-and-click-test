class Geff extends Npc {
  constructor(name, id, dialogue, visible) {
    super(name, id, dialogue, visible);
  }

  getDialogue() {
    for (let npc of npcs) {
      if (npc.id === "dave") {
        if (npc.getDialogue() === 'unlockedBeforeHint') {
          // If Dave would say that Geff creeps him out, respond accordingly.
          return 'spokeWithDave';
        } else if (npc.gifted) {
          // The player had a clown key at some point
          return 'hasClownKey';
        }
      }
    }
    let hasDoll = false, hasClownKey = false;
    for (let item of inventory.items) {
      switch (item.id) {
        case 'clownDoll': hasDoll = true; break;
        case 'clownKey': hasClownKey = true; break;
      }
    }
    if (hasClownKey) return 'hasClownKey';
    else if (hasDoll) return 'hasClown';
    else return 'intro';
  }
}
