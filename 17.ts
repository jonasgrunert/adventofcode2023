import Solution from "./solution.ts";

type Point = { x: number; y: number; l: number; d: number };

class Queue {
  #points: Array<Point & { f: number }>;

  constructor(start?: Point) {
    this.#points = start ? [{ ...start, f: 0 }] : [];
  }

  add(point: Point, f: number) {
    const p = this.#points.find(
      (p) =>
        p.x === point.x &&
        p.y === point.y &&
        p.l === point.l &&
        p.d === point.d,
    );
    if (p) {
      p.f = Math.min(f, p.f);
    } else {
      this.#points.push({ ...point, f });
    }
    this.#points.sort((a, b) => a.f - b.f);
  }

  pop() {
    return this.#points.pop()!;
  }

  get empty() {
    return this.#points.length === 0;
  }
}

const aStar = (map: number[][], target: { x: number; y: number }) => {
  const open = new Queue({ x: 0, y: 0, l: 0, d: 0 });
  while (!open.empty) {
    const current = open.pop();
    if (current.x === target.x && current.y === target.y) {
      return 0;
    }
  }
  return -1;
};

const task = new Solution(
  (arr: number[][]) => {
    return 0;
  },
  {
    transform: (l) => l.split("").map((n) => Number.parseInt(n)),
    sep: "\n",
  },
);
task.expect(102);

export default task;
