import Solution from "./solution.ts";

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
      d = [Math.abs((dir - 1) % 4)];
      break;
    }
    case "\\": {
      d = [Math.abs((dir + 1) % 4)];
      break;
    }
    case "-": {
      if (dir % 2 !== 1) {
        d = [Math.abs((dir - 1) % 4), Math.abs((dir + 1) % 4)];
      }
      break;
    }
    case "|": {
      if (dir % 2 !== 0) {
        d = [Math.abs((dir - 1) % 4), Math.abs((dir + 1) % 4)];
      }
      break;
    }
  }
  for (const change of d) {
    followBeam(
      map,
      { x: x + dirs[change].x, y: y + dirs[change].y, dir: change },
      visited,
    );
  }
  return visited;
};

const task = new Solution(
  (arr: string[]) => {
    const beams = followBeam(arr, { x: 0, y: 0, dir: 1 }, new Set());
    console.log(beams);
    return beams.size;
  },
  {
    sep: "\n",
  },
);
task.expect(46);

export default task;
