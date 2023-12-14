import Solution from "./solution.ts";

type Potential = { start: number; length: number };

const checkReflection = (map: string[][], pot: Potential, expectedDiff = 0) => {
  let diff = 0;
  for (const line of map) {
    for (let i = 0; i < pot.length; i++) {
      if (line[pot.start + i] !== line[pot.start + pot.length * 2 - i - 1]) {
        diff++;
        if (diff > expectedDiff) return false;
      }
    }
  }
  return diff === expectedDiff;
};

const findReflections = (map: string[][], diff = 0) => {
  for (let length = 1; length <= (map[0].length + 1) / 2; length++) {
    // left bound
    const startPot = { start: 0, length };
    if (checkReflection(map, startPot, diff)) {
      return length;
    }
    // right bound
    const refl = map[0].length - length;
    const endPot = { start: refl - length, length };
    if (checkReflection(map, endPot, diff)) {
      return refl;
    }
  }
  return 0;
};

const calcReflection = (map: string[][], diff = 0): number => {
  // horizontal
  const horPot = findReflections(map, diff);
  if (horPot !== 0) return horPot;
  // vertical
  const vertical = map[0].map((_, i) => map.map((s) => s[i]));
  const verPot = findReflections(vertical, diff);
  if (verPot !== 0) return verPot * 100;
  return 0;
};

const task = new Solution(
  (arr: string[][][]) => {
    return arr.reduce((p, c) => p + calcReflection(c), 0);
  },
  (arr: string[][][]) => {
    return arr.reduce((p, c) => p + calcReflection(c, 1), 0);
  },
  {
    transform: (l) => l.split("\n").map((s) => s.split("")),
    sep: "\n\n",
  }
);
task.expect(405, 400);

export default task;
