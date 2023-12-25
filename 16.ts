import Solution from "./solution.ts";

const rem = (n: number, d: number) => ((n % d) + d) % d;

const dirs = [
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
];

const followBeam = (
  map: string[],
  { x, y, dir }: { x: number; y: number; dir: number },
  visited: Set<string>,
): Set<string> => {
  if (visited.has(`${x}_${y}_${dir}`)) return visited;
  if (map[x]?.[y] === undefined) return visited;
  visited.add(`${x}_${y}_${dir}`);
  let d = [dir];
  switch (map[x][y]) {
    case "/": {
      d = [rem(dir + (dir % 2 === 0 ? 1 : -1), 4)];
      break;
    }
    case "\\": {
      d = [rem(dir + (dir % 2 === 0 ? -1 : 1), 4)];
      break;
    }
    case "-": {
      if (dir % 2 !== 1) {
        d = [rem(dir - 1, 4), rem(dir + 1, 4)];
      }
      break;
    }
    case "|": {
      if (dir % 2 !== 0) {
        d = [rem(dir - 1, 4), rem(dir + 1, 4)];
      }
      break;
    }
  }
  for (const change of d) {
    visited = followBeam(
      map,
      { x: x + dirs[change].x, y: y + dirs[change].y, dir: change },
      visited,
    );
  }
  return visited;
};

const arrs = ["^", ">", "v", "<"];
const displayBeams = (beams: Set<string>, map: string[]) => {
  const d = map.map((m) => m.split(""));
  for (const entry of beams) {
    const [x, y, dir] = entry.split("_").map((n) => Number.parseInt(n));
    if (d[x][y] === ".") {
      d[x][y] = arrs[dir];
    } else if (arrs.includes(d[x][y])) {
      d[x][y] = "2";
    }
  }
  return d.map((m) => m.join("")).join("\n");
};
const countBeams = (beams: Set<string>) => {
  const partial = new Set<string>();
  for (const entry of beams) {
    partial.add(entry.slice(0, entry.lastIndexOf("_")));
  }
  return partial.size;
};

const task = new Solution(
  (arr: string[]) => {
    const beams = followBeam(arr, { x: 0, y: 0, dir: 1 }, new Set());
    return countBeams(beams);
  },
  (arr: string[]) => {
    const starts = arr[0]
      .split("")
      .flatMap((_, y) => [
        { x: 0, y, dir: 2 },
        { x: arr.length - 1, y, dir: 0 },
      ])
      .concat(
        arr.flatMap((a, x) => [
          { x, y: 0, dir: 1 },
          { x, y: a.length - 1, dir: 1 },
        ]),
      );
    return Math.max(
      ...starts.map((start) => countBeams(followBeam(arr, start, new Set()))),
    );
  },
  {
    sep: "\n",
  },
);
task.expect(46, 51);

export default task;
