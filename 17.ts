import Solution from "./solution.ts";

type Point = { x: number; y: number; l: number; d: number; p?: Point };
const toPoint = (point: Point) => `${point.x}_${point.y}_${point.d}_${point.l}`;
const dirs = [{
  x: -1,
  y: 0,
}, {
  x: 0,
  y: 1,
}, {
  x: 1,
  y: 0,
}, {
  x: 0,
  y: -1,
}];

class Queue {
  #points: Array<Point & { f: number }>;

  get points() {
    return this.#points;
  }

  constructor(start?: Point) {
    this.#points = start ? [{ ...start, f: 0 }] : [];
  }

  add(point: Point, f: number) {
    const p = this.get(point);
    if (p) {
      if (f < p.f) {
        p.f = f;
        p.p = point.p;
      }
    } else {
      this.#points.push({ ...point, f });
    }
    this.#points.sort((a, b) => b.f - a.f);
  }

  get(point: Point) {
    return this.#points.find(
      (p) =>
        p.x === point.x &&
        p.y === point.y &&
        p.l === point.l &&
        p.d === point.d,
    );
  }

  pop() {
    return this.#points.pop()!;
  }

  get empty() {
    return this.#points.length === 0;
  }
}

const g = (
  map: number[][],
  node: Point,
): number => node.p ? map[node.x][node.y] + g(map, node.p) : 0;

const expand = (node: Point, maxX: number, maxY: number, unstable = false) => {
  const nodes: Point[] = [];
  for (let i = 0; i < dirs.length; i++) {
    const newPoint = {
      x: node.x + dirs[i].x,
      y: node.y + dirs[i].y,
      d: i,
      l: node.d === i ? node.l + 1 : 0,
      p: node,
    };
    if (
      newPoint.x >= 0 && newPoint.x < maxX && newPoint.y >= 0 &&
      newPoint.y < maxY && Math.abs(newPoint.d - node.d) != 2 &&
      (unstable
        ? newPoint.l < 10 &&
          (newPoint.d === node.d || node.l >= 3 || node.p == undefined)
        : newPoint.l < 3)
    ) {
      nodes.push(newPoint);
    }
  }
  return nodes;
};

const aStar = (
  map: number[][],
  target: { x: number; y: number },
  unstable = false,
) => {
  const open = new Queue({ x: 0, y: 0, l: 0, d: 0 });
  const closed = new Set<string>();
  closed.add("0_0_0_0");
  while (!open.empty) {
    const current = open.pop();
    if (
      current.x === target.x && current.y === target.y &&
      (unstable ? current.l >= 3 : true)
    ) {
      return current;
    }
    const currentG = g(map, current);
    for (
      const newNode of expand(current, map.length, map[0].length, unstable)
    ) {
      if (!closed.has(toPoint(newNode))) {
        const newG = map[newNode.x][newNode.y] + currentG;
        open.add(
          newNode,
          newG + Math.abs(target.x - newNode.x) +
            Math.abs(target.y - newNode.y),
        );
      }
    }
    closed.add(toPoint(current));
  }
  return null;
};

const task = new Solution(
  (arr: number[][]) => {
    const result = aStar(arr, { x: arr.length - 1, y: arr[0].length - 1 });
    if (result) {
      return g(arr, result);
    }
    return -1;
  },
  (arr: number[][]) => {
    const result = aStar(
      arr,
      { x: arr.length - 1, y: arr[0].length - 1 },
      true,
    );
    if (result) {
      return g(arr, result);
    }
    return -1;
  },
  {
    transform: (l) => l.split("").map((n) => Number.parseInt(n)),
    sep: "\n",
  },
);
task.expect(102, 94);

export default task;
