import Solution from "./solution.ts";

type Vector = [number, number, number];
type Hail = [Vector, Vector];

const task = new Solution(
  (arr: Hail[]) => {
    console.log(arr);
    return -1;
  },
  {
    transform: (l) =>
      l.split(" @ ").map((n) =>
        n.split(", ").map((n) => Number.parseInt(n))
      ) as Hail,
    sep: "\n",
  },
);
task.expect(2);

export default task;
