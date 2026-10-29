// src/utils/shuffleQueue.js
// Non-repeating shuffle queue for Saka Tika mini-games.
// Ensures non-deterministic initial selection, full exhaustion of pool before reshuffling,
// and strictly prevents the same item from appearing consecutively back-to-back.
// STRICT ZERO EMOJIS POLICY.

export class ShuffleQueue {
  constructor(length) {
    this.length = length;
    this.queue = [];
    this.lastItem = null;
    this.refill();
  }

  refill() {
    const indices = Array.from({ length: this.length }, (_, i) => i);
    // Fisher-Yates shuffle algorithm
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Prevent back-to-back duplicate with the last item of the previous cycle
    if (this.lastItem !== null && indices[indices.length - 1] === this.lastItem && indices.length > 1) {
      const swapIdx = Math.floor(Math.random() * (indices.length - 1));
      [indices[indices.length - 1], indices[swapIdx]] = [indices[swapIdx], indices[indices.length - 1]];
    }
    this.queue = indices;
  }

  next() {
    if (this.queue.length === 0) {
      this.refill();
    }
    const item = this.queue.pop();
    this.lastItem = item;
    return item;
  }
}

export function createShuffleQueue(length) {
  return new ShuffleQueue(length);
}
