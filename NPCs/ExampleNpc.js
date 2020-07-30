class ExampleNpc extends Npc {
  constructor(name, id, dialogue, visible) {
    super(name, id, dialogue, visible);
    this.gifted = false;
  }

  lockCracked() {
    const clickables = roomData['third room'].clickables;
    for (let i = 0; i < clickables.length; i++) {
      if (clickables[i].action.id === "comboLockUnlocked") {
        return true;
      }
    }
    return false;
  }

  getDialogue() {
    let hasDoll = false, hasClownKey = false;
    for (let item of inventory.items) {
      switch (item.id) {
        case 'clownDoll': hasDoll = true; break;
        case 'clownKey': hasClownKey = true; break;
      }
    }
    if (this.lockCracked()) {
      return this.gifted === 'before-cracked' ? 'unlocked' : 'unlockedBeforeHint';
    } else if (this.gifted) {
      return 'clownKeyGiven';
    } else if (hasClownKey) {
      return 'hasClownKey';
    } else if (hasDoll) {
      return 'hasDoll';
    } else {
      return 'intro';
    }
  }

  receiveItem() {
    this.gifted = this.lockCracked() ? 'after-cracked' : 'before-cracked';
  }

  itemTaken() {
    this.gifted = false;
  }
}
