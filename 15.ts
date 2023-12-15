import Solution from "./solution.ts";

type Lens = {
  label: string;
  focal: number;
};

const hash = (s: string) => {
  return s.split("").reduce((p, c) => ((p + c.charCodeAt(0)) * 17) % 256, 0);
};

const task = new Solution(
  (arr: string[]) => arr.reduce((p, c) => p + hash(c), 0),
  (arr: string[]) => {
    const boxes = new Map<number, Lens[]>();
    for (const entry of arr) {
      const [_match, label, op, focal] = /(\w+)([-=])(\d)?/.exec(entry)!;
      const box = hash(label);
      let lenses = boxes.get(box) ?? [];
      const lensIndex = lenses.findIndex((l) => l.label === label);
      if (op === "=") {
        if (lensIndex === -1) {
          lenses.push({ label, focal: Number.parseInt(focal) });
        } else {
          lenses[lensIndex].focal = Number.parseInt(focal);
        }
      } else if (op === "-") {
        lenses = lenses.filter((f) => f.label !== label);
      }
      boxes.set(box, lenses);
    }
    return [...boxes.entries()].reduce(
      (sum, box) =>
        sum +
        (box[0] + 1) * box[1].reduce((p, c, i) => p + c.focal * (i + 1), 0),
      0
    );
  },
  {
    sep: ",",
  }
);
task.expect(1320, 145);

export default task;
