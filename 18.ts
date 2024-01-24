import Solution from "./solution.ts";

type Direction = [string, number, string];

// Greens Formula with help from https://www.reddit.com/r/adventofcode/comments/18l0qtr/comment/kduuicl/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
const dig = (dirs: Direction[]) => {
  let sum = 0;
  let length = 0;
  let y = 0;
  for (const dir of dirs) {
    length += dir[1];
    switch (dir[0]) {
      case "D": {
        sum += dir[1] * y;
        break;
      }
      case "U": {
        sum -= dir[1] * y;
        break;
      }
      case "R": {
        y += dir[1];
        break;
      }
      case "L": {
        y -= dir[1];
        break;
      }
    }
  }
  return (length >> 1) + 1 + sum;
};

const task = new Solution(
  (arr: Direction[]) => {
    return dig(arr);
  },
  (arr: Direction[]) => {
    return dig(
      arr.map(
        (m) => [
          "RDLU".charAt(Number.parseInt(m[2][7])),
          Number.parseInt(m[2].slice(2, 7), 16),
          "",
        ],
      ),
    );
  },
  {
    transform: (l) =>
      l.split(" ").map((n, i) => i == 1 ? Number.parseInt(n) : n) as Direction,
    sep: "\n",
  },
);
task.expect(62, 952408144115);

export default task;
