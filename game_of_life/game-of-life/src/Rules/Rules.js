export default class Rules {
  constructor(gen = 0, alive = new Map()) {
    this.gen = gen;
    this.alive = alive;
    this.nextGen = new Map();
    this.dead = new Map();
  }

  getGen() {
    return this.gen;
  }

  getAlive() {
    return this.alive;
  }

  addCell(position) {
    this.alive.set(position.x + " , " + position.y, {
      x: position.x,
      y: position.y,
    });
  }

  removeCell(position) {
    this.alive.delete(position);
  }

  aliveCell(position) {
    return this.alive.has(position);
  }

  clearCell() {
    this.gen = 0;
    this.alive = this.dead;
  }

  storeCell(position) {
    if (this.aliveCell(position.x + " , " + position.y)) {
      this.removeCell(position.x + " , " + position.y);
    } else {
      this.addCell(position);
    }

    return new Rules(this.gen, this.alive);
  }

  addGen() {
    this.alive.forEach((item) => {
      this.calculateAliveCells(item);
    });

    this.dead.forEach((item) => {
      this.calculateDeadCells(item);
    });

    this.gen++;

    return new Rules(this.gen, this.nextGen);
  }

  calculateAliveCells(position) {
    var liveCells = 0;

    for (var i = position.x - 1; i <= position.x + 1; i++) {
      for (var j = position.y - 1; j <= position.y + 1; j++) {
        if (i === position.x && j === position.y) continue;

        if (this.aliveCell(i + " , " + j)) {
          liveCells++;
        } else {
          this.dead.set(i + " , " + j, { x: i, y: j });
        }
      }
    }

    if (liveCells === 2 || liveCells === 3)
      this.nextGen.set(position.x + " , " + position.y, {
        x: position.x,
        y: position.y,
      });
  }

  calculateDeadCells(position) {
    var liveCells = 0;

    for (var i = position.x - 1; i <= position.x + 1; i++) {
      for (var j = position.y - 1; j <= position.y + 1; j++) {
        if (i === position.x && j === position.y) continue;

        if (this.aliveCell(i + " , " + j)) {
          liveCells++;
        }
      }
    }

    if (liveCells === 3)
      this.nextGen.set(position.x + " , " + position.y, {
        x: position.x,
        y: position.y,
      });
  }
}
