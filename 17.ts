import Solution from "./solution.ts";

type Point = { x: number; y: number; l: number; d: number; p?: Point };
const toPoint = (point: Point) => (point.x << 16) | (point.y << 4) | point.d;
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

  constructor(...start: Point[]) {
    this.#points = start.map((s) => ({ ...s, f: 0 }));
  }

  add(point: Point, f: number) {
    if (this.#points.length == 0 || this.#points[0].f < f) {
      this.#points.splice(0, 0, { ...point, f });
      return;
    }
    if (this.#points[this.#points.length - 1].f > f) {
      this.#points.push({ ...point, f });
      return;
    }
    let lower = 0,
      upper = this.#points.length,
      lastLower = lower,
      lastUpper = upper;
    while (lower < upper) {
      const inPos = (lower + upper) >> 1;
      if (this.#points[inPos].f > f) {
        lower = inPos;
      } else if (this.#points[inPos].f < f) {
        upper = inPos;
      } else {
        upper = inPos;
        lower = inPos;
      }
      if (lower == lastLower && upper == lastUpper) {
        break;
      }
      lastLower = lower, lastUpper = upper;
    }
    this.#points.splice(upper, 0, { ...point, f });
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
): number => {
  if (node.p) {
    switch (node.d) {
      case 0:
        return map.slice(node.x, node.p.x).reduce((p, c) => p + c[node.y], 0);
      case 1:
        return map[node.x].slice(node.p.y + 1, node.y + 1).reduce(
          (p, c) => p + c,
          0,
        );
      case 2:
        return map.slice(node.p.x + 1, node.x + 1).reduce(
          (p, c) => p + c[node.y],
          0,
        );
      case 3:
        return map[node.x].slice(node.y, node.p.y).reduce(
          (p, c) => p + c,
          0,
        );
    }
  }
  return 0;
};

const rem = (n: number, d: number) => ((n % d) + d) % d;

const expand = (
  node: Point,
  borders: { maxX: number; maxY: number },
  opts: { min: number; max: number },
) => {
  const nodes: Point[] = [];
  for (const i of [-1, 1]) {
    const d = rem(node.d + i, dirs.length);
    for (let l = opts.min; l <= opts.max; l++) {
      const newPoint = {
        x: node.x + dirs[d].x * l,
        y: node.y + dirs[d].y * l,
        d,
        l,
        p: node,
      };
      if (
        newPoint.x >= 0 && newPoint.x < borders.maxX && newPoint.y >= 0 &&
        newPoint.y < borders.maxY
      ) {
        nodes.push(newPoint);
      }
    }
  }
  return nodes;
};

const aStar = (
  map: number[][],
  target: { x: number; y: number },
  unstable = false,
) => {
  const open = new Queue({ x: 0, y: 0, l: 0, d: 1 }, {
    x: 0,
    y: 0,
    l: 0,
    d: 2,
  });
  const closed = new Map<number, number>();
  while (!open.empty) {
    const { f, ...current } = open.pop();
    if (
      current.x === target.x && current.y === target.y
    ) {
      return f;
    }
    for (
      const newNode of expand(current, {
        maxX: map.length,
        maxY: map[0].length,
      }, unstable ? { min: 4, max: 10 } : { min: 1, max: 3 })
    ) {
      const cost = f + g(map, newNode);
      if ((closed.get(toPoint(newNode)) ?? Infinity) > cost) {
        open.add(
          newNode,
          f + g(map, newNode),
        );
        closed.set(toPoint(newNode), cost);
      }
    }
  }
  return null;
};

const task = new Solution(
  (arr: number[][]) => {
    const result = aStar(arr, { x: arr.length - 1, y: arr[0].length - 1 });
    if (result) {
      return result;
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
      return result;
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
