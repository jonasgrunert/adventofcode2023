import Solution from "./solution.ts";

const n = /\d+/g;
const sym = /[^\d\.]/;

function checkString(s: string, r: RegExp) {
  return s.split("").findIndex((c) => c.match(r));
}

function checkMap(map: string[], r = sym) {
  return (line: number, start: number, length: number) => {
    return [
      // top
      map[line - 1]?.substring(start - 1, start + length + 1) ?? "",
      // bot
      map[line + 1]?.substring(start - 1, start + length + 1) ?? "",
      // left
      map[line][start - 1] ?? "",
      // right
      map[line][start + length] ?? "",
    ].map((s) => checkString(s, r));
  };
}

// helper function to obtain the the coordinates of the gear
const getOffset = (n: number, l: number) => {
  switch (n) {
    case 0:
      return [-1, -1];
    case 1:
      return [1, -1];
    case 2:
      return [0, -1];
    case 3:
      return [0, l];
  }
  throw new Error("out of range");
};

const task = new Solution(
  (arr: string[]) => {
    let match: RegExpExecArray | null;
    const hasSurrounding = checkMap(arr);
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      const line = arr[i];
      while ((match = n.exec(line))) {
        const surr = hasSurrounding(i, match.index, match[0].length);
        if (surr.some((s) => s !== -1)) {
          sum += Number.parseInt(match[0]);
        }
      }
    }
    return sum;
  },
  (arr: string[]) => {
    let match: RegExpExecArray | null;
    // only gears are relevant
    const hasSurrounding = checkMap(arr, /\*/g);
    // we save all geard
    const gears = new Map<string, number[]>();
    for (let i = 0; i < arr.length; i++) {
      const line = arr[i];
      while ((match = n.exec(line))) {
        const surr = hasSurrounding(i, match.index, match[0].length);
        for (let j = 0; j < surr.length; j++) {
          if (surr[j] !== -1) {
            const off = getOffset(j, match[0].length);
            // where is the gear (min 0) plus offset of the found position (top, bot, left or right) plus index of gear in string
            const coord = `${Math.max(match.index + off[1], 0) + surr[j]}_${
              i + off[0]
            }`;
            const value = Number.parseInt(match[0]);
            if (gears.has(coord)) {
              gears.get(coord)!.push(value);
            } else {
              gears.set(coord, [value]);
            }
          }
        }
      }
    }
    let sum = 0;
    for (const [g, r] of gears.entries()) {
      // only gears with two number are gears
      if (r.length === 2) {
        sum += r.reduce((p, c) => p * c, 1);
      }
    }
    return sum;
  },
  {
    sep: "\n",
  },
);
task.expect(4361, 467835);

export default task;
