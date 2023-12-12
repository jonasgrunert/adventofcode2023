import Solution from "./solution.ts";

function memo(func: (line: string, groups: number[]) => number) {
  const results = new Map<string, number>();
  return (line: string, groups: number[]) => {
    const key = `${line}:${groups.join("_")}`;
    if (results.has(key)) {
      return results.get(key)!;
    }
    const r = func(line, groups);
    results.set(key, r);
    return r;
  };
}

const calcPossibilities = memo((line: string, groups: number[]): number => {
  // There are no more groups left in our check
  if (groups.length === 0) {
    return line.includes("#") ? 0 : 1;
  }
  // We are at the end, but there are still groups left
  if (line.length === 0) {
    return 0;
  }
  // There is less line left then needed
  if (line.length < groups.reduce((p, c) => p + c) + groups.length - 1) {
    return 0;
  }
  const rest = line.slice(1);
  switch (line[0]) {
    case ".":
      return calcPossibilities(rest, groups);
    case "?":
      return (
        calcPossibilities("#" + rest, groups) +
        calcPossibilities("." + rest, groups)
      );
    case "#": {
      const [group, ...remainingGroups] = groups;
      // is the group too short
      const match = new RegExp(`^[#\\?]{${group}}(?:[^#]|$)`).test(line);
      if (match) {
        return calcPossibilities(line.slice(group + 1), remainingGroups);
      }
      return 0;
    }
  }
  return 0;
});

const task = new Solution(
  (arr: [string, number[]][]) => {
    return arr.reduce((p, c) => p + calcPossibilities(...c), 0);
  },
  (arr: [string, number[]][]) => {
    return arr
      .map(
        (m) =>
          [
            Array.from({ length: 5 }, () => m[0]).join("?"),
            m[1].concat(...Array.from({ length: 4 }, () => m[1])),
          ] as [string, number[]]
      )
      .reduce((p, c) => p + calcPossibilities(...c), 0);
  },
  {
    transform: (l) =>
      l
        .split(" ")
        .map((c, i) =>
          i === 1 ? c.match(/\d+/g)?.map((n) => Number.parseInt(n)) : c
        ) as [string, number[]],
    sep: "\n",
  }
);
task.expect(21, 525152);

export default task;
