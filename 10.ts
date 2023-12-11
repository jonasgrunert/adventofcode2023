import Solution from "./solution.ts";

type Node = {
  x: number;
  y: number;
  s: string;
  parent: null | Node;
  isStart: boolean;
};

const pipeRegister = [
  ["."],
  ["."],
  ["."],
  ["F", { x: 0, y: 1 }],
  ["."],
  ["|", { x: 1, y: 0 }],
  ["L", { x: 0, y: 1 }],
  ["."],
  ["."],
  ["7", { x: 0, y: -1 }],
  ["-", { x: 0, y: 1 }],
  ["."],
  ["J", { x: 0, y: -1 }],
] as const;

const modifyStart = (map: Node[][]): [Node, { x: number; y: number }] => {
  // we turn around the start in order: l u r d
  // that means our matcher must be
  const pipes = ["-LF", "|F7", "-7J", "|JL"];
  const start = map.flat().find((n) => n.isStart)!;
  const dir = [];
  for (let d = -2; d < 2; d++) {
    const adjacentNode = map[start.x + (d % 2)]?.[start.y + ((d + 1) % 2)];
    dir.push(pipes[d + 2].includes(adjacentNode?.s));
  }
  const code = Number.parseInt(dir.map((t) => (t ? "1" : "0")).join(""), 2);
  const [s, d] = pipeRegister[code];
  start.s = s;
  return [start, d ?? { x: 0, y: 0 }];
};

const nextNode = (node: Node): { x: number; y: number } => {
  const x = node.x - node.parent!.x;
  const y = node.y - node.parent!.y;
  switch (node.s) {
    case "|": {
      return { x: x, y: 0 };
    }
    case "-": {
      return { x: 0, y: y };
    }
    case "L": {
      return { x: x - 1, y: y + 1 };
    }
    case "J": {
      return { x: x - 1, y: y - 1 };
    }
    case "7": {
      return { x: x + 1, y: y - 1 };
    }
    case "F": {
      return { x: x + 1, y: y + 1 };
    }
  }
  throw new Error(`Cannot get directions for ${JSON.stringify(node, null, 2)}`);
};

const findPath = (map: Node[][]) => {
  let [start, d] = modifyStart(map);
  const loop = [start];
  let newNode = map[start.x + d.x][start.y + d.y];
  newNode.parent = start;
  while (!newNode.isStart) {
    loop.push(newNode);
    d = nextNode(newNode);
    const node = map[newNode.x + d.x][newNode.y + d.y];
    node.parent = newNode;
    newNode = node;
  }
  return loop;
};

const task = new Solution(
  (arr: Node[][]) => {
    const loop = findPath(arr);
    return loop.length / 2;
  },
  (arr: Node[][]) => {
    const loop = findPath(arr);
    return arr.reduce(
      (sum, cLine) =>
        sum +
        cLine.reduce(
          (p, c) => {
            if (loop.includes(c)) {
              // an F starts a loop as well as 7 closes it
              if ("L|J".includes(c.s)) {
                p.in = !p.in;
              }
              return p;
            }
            if (p.in) {
              p.count++;
            }
            return p;
          },
          { in: false, count: 0 }
        ).count,
      0
    );
  },
  {
    transform: (l, x) =>
      l
        .split("")
        .map((s, y) => ({ x, y, s, parent: null, isStart: s === "S" })),
    sep: "\n",
  }
);
task.expect(8, 10);

export default task;
