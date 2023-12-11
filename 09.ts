import Solution from "./solution.ts";

const nextNumber = (arr: number[], pos = -1): number => {
  const diff: number[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    diff.push(arr[i + 1] - arr[i]);
  }
  if (diff.every((d) => d === 0)) {
    return arr.at(pos)!;
  }
  const n = nextNumber(diff, pos);
  return arr.at(pos)! + n * (pos < 0 ? 1 : -1);
};

const task = new Solution(
  (arr: number[][]) => {
    return arr.reduce((p, c) => p + nextNumber(c), 0);
  },
  (arr: number[][]) => {
    return arr.reduce((p, c) => p + nextNumber(c, 0), 0);
  },
  {
    transform: (l) => l.match(/-?\d+/g)!.map((n) => Number.parseInt(n)),
    sep: "\n",
  }
);
task.expect(114, 2);

export default task;
