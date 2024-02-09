import Solution from "./solution.ts";

type Position = [x: number, y: number, z: number];

class Block {
  #position: [lower: Position, upper: Position];
  #carries = new Set<Block>();
  #pillars = new Set<Block>();

  constructor(input: string) {
    this.#position = input.split("~").map((n) =>
      n.split(",").map((n) => Number.parseInt(n))
    ) as [Position, Position];
  }

  addCarried(block: Block) {
    this.#carries.add(block);
    block.#pillars.add(this);
  }

  get disintegratable() {
    return [...this.#carries].every((b) => b.#pillars.size > 1);
  }

  get floor() {
    return this.#position[0][2] - 1;
  }

  get ceil() {
    return this.#position[1][2];
  }

  get bounds() {
    return this.#position.map(([x, y]) => ({ x, y }));
  }

  descend() {
    this.#position[0][2]--;
    this.#position[1][2]--;
  }

  get stable() {
    return this.floor === 0 || this.#pillars.size > 0;
  }

  get dependents() {
    return [...this.#carries];
  }
  get pillars() {
    return [...this.#pillars];
  }
}

const intersect = (a: Block, b: Block) => {
  return !(a.bounds[0].x > b.bounds[1].x ||
    a.bounds[1].x < b.bounds[0].x ||
    a.bounds[0].y > b.bounds[1].y ||
    a.bounds[1].y < b.bounds[0].y);
};

const stack = (blocks: Block[]) => {
  const stack = new Map<number, Block[]>();
  for (const block of blocks.toSorted((a, b) => a.floor - b.floor)) {
    if (block.floor !== 0) {
      while (!block.stable) {
        const pillars = stack.get(block.floor);
        if (pillars) {
          pillars.filter((p) => intersect(p, block)).forEach((p) =>
            p.addCarried(block)
          );
        }
        if (!block.stable) {
          block.descend();
        }
      }
    }
    stack.set(block.ceil, [...(stack.get(block.ceil) ?? []), block]);
  }
  return blocks;
};

const fall = (block: Block, stack: Block[]) => {
  const falls = new Set<Block>([block]);
  const toCheck = [block];
  for (const b of toCheck) {
    for (
      const falling of b.dependents.filter((b) =>
        b.pillars.every((f) => falls.has(f))
      )
    ) {
      toCheck.push(falling);
      falls.add(falling);
    }
  }
  return falls.size - 1;
};

const task = new Solution(
  (arr: Block[]) => {
    return stack(arr).filter((b) => b.disintegratable).length;
  },
  (arr: Block[]) => {
    const st = stack(arr);
    return st.filter((b) => !b.disintegratable).reduce(
      (p, c) => p + fall(c, arr),
      0,
    );
  },
  {
    transform: (l) => new Block(l),
    sep: "\n",
  },
);
task.expect(5, 7);

export default task;
