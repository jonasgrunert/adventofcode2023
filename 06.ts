import Solution from "./solution.ts";

const num = /\d+/g;

function compoutePoss(time: number, distance: number) {
  const root = Math.sqrt((time / 2) ** 2 - distance);
  const low = Math.floor(time / 2 - root);
  const high = Math.ceil(time / 2 + root);
  return high - low - 1;
}

const task = new Solution(
  (arr: string[]) => {
    const [times, distances] = arr[0]
      .split("\n")
      .map((s) => s.match(num)?.map((n) => Number.parseInt(n)));
    const races = times!.map((t, i) => ({ time: t, distance: distances![i] }));
    return races.reduce((p, c) => {
      return p * compoutePoss(c.time, c.distance);
    }, 1);
  },
  (arr: string[]) => {
    const [time, distance] = arr[0]
      .split("\n")
      .map((s) => Number.parseInt(s.match(num)!.join("")));
    return compoutePoss(time, distance);
  },
  {
    sep: "\n\n",
  }
);
task.expect(288, 71503);

export default task;
