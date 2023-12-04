import Solution from "./solution.ts";

const num = /\d+/g;

const task = new Solution(
  (arr: { yours: number[]; win: number[] }[]) =>
    arr.reduce(
      (p, c) =>
        p +
        c.yours.reduce(
          (pn, n) => (c.win.includes(n) ? (pn === 0 ? 1 : pn * 2) : pn),
          0
        ),
      0
    ),
  (arr: { yours: number[]; win: number[] }[]) => {
    const cards = new Map<number, number>();
    for (let i = 0; i < arr.length; i++) {
      if (!cards.has(i)) {
        cards.set(i, 1);
      }
      const card = arr[i];
      const wins = card.yours.filter((n) => card.win.includes(n)).length;
      for (let j = 1; j <= wins; j++) {
        if (i + j < arr.length) {
          cards.set(i + j, (cards.get(i + j) ?? 1) + (cards.get(i) ?? 0));
        }
      }
    }
    return [...cards.values()].reduce((p, c) => p + c, 0);
  },
  {
    transform: (l) => {
      const [_, win, yours] = l.split(/[:\|]/);
      return {
        win: win.match(num)?.map((n) => Number.parseInt(n)) ?? [],
        yours: yours.match(num)?.map((n) => Number.parseInt(n)) ?? [],
      };
    },
    sep: "\n",
  }
);
task.expect(13, 30);

export default task;
