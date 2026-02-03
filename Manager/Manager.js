// Manager.js

export class Manager {
  // ------------------------------------------------------------
  // Constructor (protected in C#)
  // ------------------------------------------------------------
  constructor() {
    this.mDeltaGrow = 0;
    this.mNumReserved = 0;
    this.mInitialNumReserved = 0;

    this.mNumActive = 0;
    this.mTotalNumNodes = 0;

    this.poActive = null;
    this.poReserve = null;
  }

  // ------------------------------------------------------------
  // BaseInitialize
  // ------------------------------------------------------------
  baseInitialize(initialNumReserved = 3, deltaGrow = 1) {
    console.assert(initialNumReserved >= 0);
    console.assert(deltaGrow > 0);

    this.mDeltaGrow = deltaGrow;
    this.mInitialNumReserved = initialNumReserved;

    this.privFillReservedPool(initialNumReserved);
  }

  // ------------------------------------------------------------
  // Base methods (called by derived managers)
  // ------------------------------------------------------------
  baseAdd() {
    // Are there any nodes on the Reserve list?
    if (this.poReserve === null) {
      this.privFillReservedPool(this.mDeltaGrow);
    }

    // Always take from the reserve list
    const pLink = Manager.privPullFromFront({ head: this });
    console.assert(pLink !== null);

    // Wash it
    this.derivedWash(pLink);

    // Update stats
    this.mNumActive++;
    this.mNumReserved--;

    // Copy to active
    Manager.privAddToFront({ head: this, list: "poActive" }, pLink);

    return pLink;
  }

  baseFind(pNodeTarget) {
    let pLink = this.poActive;

    while (pLink !== null) {
      if (this.derivedCompare(pLink, pNodeTarget)) {
        break;
      }
      pLink = pLink.pNext;
    }

    return pLink;
  }

  baseRemove(pNode) {
    console.assert(pNode !== null);

    Manager.privRemoveNode({ head: this }, pNode);

    this.derivedWash(pNode);

    Manager.privAddToFront({ head: this, list: "poReserve" }, pNode);

    this.mNumActive--;
    this.mNumReserved++;
  }

  baseDump() {
    console.log("");
    console.log("   ****** Manager Begin ****************");
    console.log("");

    console.log(`         mDeltaGrow: ${this.mDeltaGrow}`);
    console.log(`     mTotalNumNodes: ${this.mTotalNumNodes}`);
    console.log(`       mNumReserved: ${this.mNumReserved}`);
    console.log(`         mNumActive: ${this.mNumActive}`);
    console.log("");

    let pNode = null;

    if (this.poActive === null) {
      console.log("    Active Head: null");
    } else {
      pNode = this.poActive;
      console.log(`    Active Head: (${pNode.constructor.name})`);
    }

    if (this.poReserve === null) {
      console.log("   Reserve Head: null");
    } else {
      pNode = this.poReserve;
      console.log(`   Reserve Head: (${pNode.constructor.name})`);
    }

    console.log("");
    console.log("   ------ Active List: -----------");
    console.log("");

    pNode = this.poActive;
    let i = 0;
    while (pNode !== null) {
      console.log(`   ${i}: -------------`);
      this.derivedDumpNode(pNode);
      i++;
      pNode = pNode.pNext;
    }

    console.log("");
    console.log("   ------ Reserve List: ----------");
    console.log("");

    pNode = this.poReserve;
    i = 0;
    while (pNode !== null) {
      console.log(`   ${i}: -------------`);
      this.derivedDumpNode(pNode);
      i++;
      pNode = pNode.pNext;
    }

    console.log("");
    console.log("   ****** Manager End ******************");
    console.log("");
  }

  // ------------------------------------------------------------
  // Abstract methods (must be overridden)
  // ------------------------------------------------------------
  derivedCreateNode() {
    throw new Error("derivedCreateNode() must be implemented");
  }

  derivedCompare(pLinkA, pLinkB) {
    throw new Error("derivedCompare() must be implemented");
  }

  derivedWash(pLink) {
    throw new Error("derivedWash() must be implemented");
  }

  derivedDumpNode(pLink) {
    throw new Error("derivedDumpNode() must be implemented");
  }

  // ------------------------------------------------------------
  // Private helpers
  // ------------------------------------------------------------
  privFillReservedPool(count) {
    console.assert(count >= 1);

    this.mTotalNumNodes += count;
    this.mNumReserved += count;

    for (let i = 0; i < count; i++) {
      const pNode = this.derivedCreateNode();
      console.assert(pNode !== null);

      Manager.privAddToFront({ head: this, list: "poReserve" }, pNode);
    }
  }

  // ------------------------------------------------------------
  // Static helpers (mirror C# exactly)
  // ------------------------------------------------------------
  static privAddToFront(refs, pNode) {
    console.assert(pNode !== null);

    const listName = refs.list;
    let pHead = refs.head[listName];

    if (pHead === null) {
      refs.head[listName] = pNode;
      pNode.pNext = null;
      pNode.pPrev = null;
    } else {
      pNode.pPrev = null;
      pNode.pNext = pHead;
      pHead.pPrev = pNode;
      refs.head[listName] = pNode;
    }

    console.assert(refs.head[listName] !== null);
  }

  static privPullFromFront(refs) {
    let pHead = refs.head.poReserve;
    console.assert(pHead !== null);

    const pNode = pHead;

    refs.head.poReserve = pHead.pNext;
    if (refs.head.poReserve !== null) {
      refs.head.poReserve.pPrev = null;
    }

    pNode.clear();

    console.assert(pNode.pNext === null);
    console.assert(pNode.pPrev === null);

    return pNode;
  }

  static privRemoveNode(refs, pNode) {
    console.assert(refs.head.poActive !== null);
    console.assert(pNode !== null);

    if (pNode.pPrev !== null) {
      pNode.pPrev.pNext = pNode.pNext;
    } else {
      refs.head.poActive = pNode.pNext;
    }

    if (pNode.pNext !== null) {
      pNode.pNext.pPrev = pNode.pPrev;
    }

    pNode.clear();

    console.assert(pNode.pNext === null);
    console.assert(pNode.pPrev === null);
  }
}
