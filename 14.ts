import Solution from "./solution.ts";

const roll = (a: string, b: string) => (a === "O" ? -1 : b === "o" ? -1 : 0);

const takeUntil = (arr: string[], char: string) => {
  const nArr = [];
  for (const s of arr) {
    if (s === char) {
      return nArr.sort(roll);
    }
    nArr.push(s);
  }
  return arr.sort(roll);
};

const tilt = (map: string[][]) => {
  return map.map((line) => {
    let curr = [...line];
    const newLine: string[] = [];
    while (curr.length > 0) {
      const row = takeUntil(curr, "#");
      newLine.push(...row);
      if (row.length !== curr.length) {
        newLine.push("#");
      }
      curr = curr.slice(row.length + 1);
    }
    return newLine;
  });
};

const rotate = (map: string[][]) => {
  const rotated = map.map((m) => m.map(() => " "));
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map.length; y++) {
      rotated[y][map.length - x - 1] = map[x][y];
    }
  }
  return rotated;
};

const calcLoad = (map: string[][]) =>
  map.reduce(
    (sum, l) =>
      sum + l.reduce((p, c, i) => p + (c === "O" ? l.length - i : 0), 0),
    0
  );

const task = new Solution(
  (arr: string[][]) => {
    let rot = arr;
    for (let i = 0; i < 3; i++) {
      rot = rotate(rot);
    }
    return calcLoad(tilt(rot));
  },
  (arr: string[][]) => {
    const memo = new Map<string, number>();
    const cycles = 1000000000;
    let rot = arr;
    for (let i = 0; i < 3; i++) {
      rot = rotate(rot);
    }
    for (let i = 0; i < cycles; i++) {
      for (let d = 0; d < 4; d++) {
        rot = rotate(tilt(rot));
      }
      const key = rot.map((l) => l.join("")).join("\n");
      if (memo.has(key)) {
        i = cycles - ((cycles - i) % (i - memo.get(key)!));
      }
      memo.set(key, i);
    }
    return calcLoad(rot);
  },
  {
    transform: (l) => l.split(""),
    sep: "\n",
  }
);
task.expect(136, 64);

export default task;
