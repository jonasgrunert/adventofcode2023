import Solution from "./solution.ts";

const greatestCommonDemoninator = (a: number, b: number): number =>
  b == 0 ? a : greatestCommonDemoninator(b, a % b);
const leastCommonMultiple = (a: number, b: number) =>
  (a / greatestCommonDemoninator(a, b)) * b;

const task = new Solution(
  (arr: Array<string[][] | string[]>) => {
    const [instructions, nodes] = arr as [string[], ...string[][]];
    const map = new Map<string, [string, string]>();
    for (const node of nodes) {
      map.set(node[0], [node[1], node[2]]);
    }
    let node = "AAA";
    let i = 0;
    while (node !== "ZZZ") {
      const select = instructions[i % instructions.length];
      node = map.get(node)![select === "L" ? 0 : 1];
      i++;
    }
    return i;
  },
  (arr: Array<string[][] | string[]>) => {
    const [instructions, nodes] = arr as [string[], ...string[][]];
    const map = new Map<string, [string, string]>();
    for (const node of nodes) {
      map.set(node[0], [node[1], node[2]]);
    }
    let n = [...map.keys()].filter((s) => s.endsWith("A"));
    let i = 0;
    const minTravel: number[] = [];
    while (minTravel.filter((c) => c !== undefined).length !== n.length) {
      const select = instructions[i % instructions.length];
      n = n.map((s) => map.get(s)![select === "L" ? 0 : 1]);
      i++;
      n.forEach((node, x) => {
        if (node.endsWith("Z") && minTravel[x] === undefined) {
          minTravel[x] = i;
        }
      });
    }
    return minTravel.reduce(leastCommonMultiple, 1);
  },
  {
    transform: (l, i) =>
      i === 0 ? l.split("") : l.split("\n").map((n) => n.match(/\w{3}/g)!),
    sep: "\n\n",
  }
);
task.expect(6, 6);

export default task;
