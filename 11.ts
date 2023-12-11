import Solution from "./solution.ts";

const expands = (map: string[], mul = 2) => {
  const galaxies: [number, number][] = [];
  const emptyRows = map.map(() => true);
  const emptyCols = map[0].split("").map(() => true);
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (map[x][y] === "#") {
        emptyRows[x] = false;
        emptyCols[y] = false;
        galaxies.push([x, y]);
      }
    }
  }
  return galaxies.map(
    ([x, y]) =>
      [
        x + emptyRows.slice(0, x).filter((f) => f).length * (mul - 1),
        y + emptyCols.slice(0, y).filter((f) => f).length * (mul - 1),
      ] as [number, number]
  );
};

const calcLength = (arr: [number, number][], point: [number, number]) =>
  arr.reduce(
    (p, c) => p + Math.abs(c[0] - point[0]) + Math.abs(c[1] - point[1]),
    0
  );

const task = new Solution(
  (arr: string[]) => {
    const galaxies = expands(arr);
    return galaxies.reduce(
      (p, c, i, arr) => p + calcLength(arr.slice(i + 1), c),
      0
    );
  },
  (arr: string[]) => {
    const galaxies = expands(arr, 1_000_000);
    return galaxies.reduce(
      (p, c, i, arr) => p + calcLength(arr.slice(i + 1), c),
      0
    );
  },
  {
    sep: "\n",
  }
);
task.expect(374, 82000210);

export default task;
