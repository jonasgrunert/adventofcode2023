import Solution from "./solution.ts";

const name = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const task = new Solution(
  (arr: string[]) =>
    arr.reduce((p, c) => {
      const m = c.match(/\d/g)!;
      return Number.parseInt(m[0] + m[m.length - 1]) + p;
    }, 0),
  (arr: string[]) =>
    arr.reduce((p, c) => {
      const r = new RegExp(`\\d|${name.join("|")}`, "g");
      let match: RegExpExecArray | null | true = true;
      let first: string | undefined = undefined;
      let last: string | undefined = undefined;
      while ((match = r.exec(c))) {
        r.lastIndex = match.index + 1;
        let num = match[0];
        const i = name.indexOf(match[0]);
        if (i !== -1) {
          num = (i + 1).toString();
        }
        if (first === undefined) first = num;
        last = num;
      }
      return Number.parseInt(first! + last!) + p;
    }, 0),
  {
    sep: "\n",
  },
);
task.expect(142, 281);

export default task;
