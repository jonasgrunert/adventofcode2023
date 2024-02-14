import Solution from "./solution.ts";

type Point = [number, number];
const toPoint = (node: Point) => node.join("_");
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const slides = ["^", ">", "v", "<"];

const prepMap = (map: string[]) => {
};

const longestDfs = (map: string[], part1 = true) => {
  let best = 0;
  const dfs = (node: Point, seen: Set<string>) => {
    if (node[0] === map.length - 1 && node[1] === map.length - 2) {
      best = Math.max(best, seen.size);
    }
    const sym = map[node[0]]?.[node[1]];
    const slide = slides.indexOf(sym);
    const poss = slide !== -1 && part1
      ? dirs.filter((_, i) => i === slide)
      : dirs;
    for (const dir of poss) {
      const p: Point = [node[0] + dir[0], node[1] + dir[1]];
      const name = toPoint(p);
      if (slides.concat(".").includes(sym) && !seen.has(name)) {
        seen.add(name);
        dfs(p, seen);
        seen.delete(name);
      }
    }
  };
  dfs([0, 1], new Set());
  return best;
};

const task = new Solution(
  (arr: string[]) => {
    return longestDfs(arr);
  },
  (arr: string[]) => {
    return longestDfs(arr, false);
  },
  {
    sep: "\n",
  },
);
task.expect(94, 154);

export default task;
