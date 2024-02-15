import Solution from "./solution.ts";

type Point = [number, number];
type Graph = Map<string, Record<string, number>>;
const toPoint = (node: Point) => node.join("_");
const fromPoint = (point: string) =>
  point.split("_").map((n) => Number.parseInt(n)) as Point;
const dirs: Point[] = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const slides = ["^", ">", "v", "<"];

const addPoints = (a: Point, b: Point) => a.map((n, i) => n + b[i]) as Point;
const indexMap = (m: string[], p: Point) => m[p[0]]?.[p[1]];

const buildGraph = (map: string[], part2 = false) => {
  const findNextHub = (points: Point[]): [string, number] => {
    const last = points.at(-1)!;
    const sym = indexMap(map, last);
    if (!part2 && slides.includes(sym)) {
      return findNextHub([
        ...points,
        addPoints(last, dirs[slides.indexOf(sym)]),
      ]);
    }
    const conns = dirs.map((d) => addPoints(last, d)).filter((d) =>
      (slides.concat(".").includes(indexMap(map, d)) &&
        points.every((p) => p[0] !== d[0] || p[1] !== d[1])) ||
      (d[0] === map.length - 1 && d[1] === map[0].length - 2)
    );
    if (conns.length === 1) {
      return findNextHub([...points, conns[0]]);
    }
    return [toPoint(last), points.length - 1];
  };
  const findNextHubs = (point: Point) => {
    return Object.fromEntries(
      dirs.map((d) => addPoints(point, d)).filter((p) =>
        slides.concat(".").includes(indexMap(map, p))
      ).map((p) => findNextHub([point, p])).filter((p) =>
        toPoint(point) !== p[0]
      ),
    );
  };
  const seen: Graph = new Map();
  const queue = [[0, 1] as Point];
  while (queue.length > 0) {
    const point = queue.pop()!;
    const hubs = findNextHubs(point);
    seen.set(toPoint(point), hubs);
    Object.keys(hubs).filter((p) => !seen.has(p)).forEach((p) =>
      queue.push(fromPoint(p))
    );
  }
  return seen;
};

const longestDfs = (graph: Graph, target: string) => {
  let best = 0;
  const dfs = (node: string, seen: Set<string> = new Set(), count = 0) => {
    if (node === target) {
      best = Math.max(best, count);
    }
    const poss = graph.get(node)!;
    for (const [name, distance] of Object.entries(poss)) {
      if (!seen.has(name)) {
        seen.add(name);
        dfs(name, seen, count + distance);
        seen.delete(name);
      }
    }
  };
  dfs([0, 1].join("_"));
  return best;
};

const task = new Solution(
  (arr: string[]) => {
    const graph = buildGraph(arr);
    return longestDfs(graph, [arr.length - 1, arr[0].length - 2].join("_"));
  },
  (arr: string[]) => {
    const graph = buildGraph(arr, true);
    return longestDfs(graph, [arr.length - 1, arr[0].length - 2].join("_"));
  },
  {
    sep: "\n",
  },
);
task.expect(94, 154);

export default task;
