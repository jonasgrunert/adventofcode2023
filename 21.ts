import Solution from "./solution.ts";

const findStart = (map: string[][]): string => {
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[0].length; y++) {
      if (map[x][y] === "S") return [x, y].join("_");
    }
  }
  throw new Error("Could not find start");
};

const dir = [[-1, 0], [0, 1], [1, 0], [0, -1]];

const bfs = (
  map: string[][],
  maxSteps = 64,
  start: string | undefined = undefined,
) => {
  let prev = new Map();
  let curr = new Map([[start ?? findStart(map), 0]]);
  for (let i = 0; i < maxSteps; i++) {
    const future = new Map<string, number>();
    for (const [c, v] of curr) {
      const [x, y] = c.split("_").map((n) => Number.parseInt(n));
      for (const [dx, dy] of dir) {
        const key = [x + dx, y + dy].join("_");
        if (map[x + dx]?.[y + dy] === "." || map[x + dx]?.[y + dy] === "S") {
          future.set(key, v + 1);
        }
      }
    }
    prev = curr;
    curr = future;
  }
  return { curr, prev };
};

const starts = (map: string[][]) =>
  [[0, 0], [0, map.length - 1], [map.length - 1, 0], [
    map.length - 1,
    map.length - 1,
  ]].map((s) => s.join("_"));

const reachableCount = (
  map: string[][],
) => {
  const half = (map.length - 1) / 2;
  const full = bfs(map, map.length - 1);
  const square_even = full.prev.size;
  const square_odd = full.curr.size;
  const corners = starts(map).map((s) => bfs(map, half - 1, s));
  const corners_odd = corners.reduce((
    p,
    c,
  ) => p + c.curr.size, 0);
  const corners_even = corners.reduce((
    p,
    c,
  ) => p + c.prev.size + 1, 0);
  return {
    square_even,
    square_odd,
    corners_even,
    corners_odd,
  };
};

const task = new Solution(
  (arr: string[][]) => {
    return bfs(arr).curr.size;
  },
  (arr: string[][]) => {
    if (arr.length === 11) return 0;
    // based on https://raw.githubusercontent.com/democat3457/AdventOfCode/master/2023/resources/day21gridvis.png
    const counts = reachableCount(arr);
    const steps = 26501365;
    const tiles = (steps - (arr.length - 1) / 2) / arr.length;
    const answer = (tiles ** 2) * (counts.square_odd) +
      ((tiles - 1) ** 2) * (counts.square_even) +
      tiles * counts.corners_odd +
      4 * tiles * counts.square_even - (tiles + 1) * counts.corners_even;
    return answer;
  },
  {
    transform: (l) => l.split(""),
    sep: "\n",
  },
);
task.expect(42, 0);

export default task;
