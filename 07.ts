import Solution from "./solution.ts";

const cards = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "0",
] as const;
type Card = (typeof cards)[number];
type UndoPartial<T> = T extends Partial<infer R> ? R : T;
type Hand = {
  counts: UndoPartial<ReturnType<typeof Object.groupBy<string, Card>>>;
  hand: string;
};

const order: ((h: Hand) => boolean)[] = [
  // Five of a kind
  (h) => Object.values(h.counts).some((v) => v.length === 5),
  // four of a kind
  (h) => Object.values(h.counts).some((v) => v.length === 4),
  // Full house
  (h) =>
    Object.values(h.counts).some((v) => v.length === 3) &&
    Object.values(h.counts).some((v) => v.length === 2),
  // Three of kind
  (h) => Object.values(h.counts).some((v) => v.length === 3),
  // Two pairs
  (h) =>
    Object.values(h.counts).findIndex((v) => v.length === 2) !==
    Object.values(h.counts).findLastIndex((v) => v.length === 2),
  // one pair
  (h) => Object.values(h.counts).some((v) => v.length === 2),
  // high card
  () => true,
];

const compareHands = (a: Hand, b: Hand) => {
  const aOrder = order.findIndex((f) => f(a));
  const bOrder = order.findIndex((f) => f(b));
  if (aOrder !== bOrder) return aOrder - bOrder;
  for (let i = 0; i < a.hand.length; i++) {
    const comp =
      cards.indexOf(a.hand[i] as Card) - cards.indexOf(b.hand[i] as Card);
    if (comp !== 0) return comp;
  }
  return 0;
};

const modifyCounts = (counts: Hand["counts"]) => {
  if (counts.J) {
    const entries = Object.entries(counts).filter(([key]) => key !== "J");
    const hCount = Math.max(...entries.map(([, value]) => value.length));
    if (hCount === Number.NEGATIVE_INFINITY) {
      return counts;
    }
    entries.find(([, value]) => value.length === hCount)![1].push(...counts.J);
    return Object.fromEntries(entries);
  }
  return counts;
};

const task = new Solution(
  (arr: [Hand, number][]) => {
    const sortedHands = arr.toSorted((a, b) => compareHands(b[0], a[0]));
    return sortedHands.reduce((p, c, i) => p + c[1] * (i + 1), 0);
  },
  (arr: [Hand, number][]) => {
    const modifiedHands = arr.map(
      (h) =>
        [
          {
            hand: h[0].hand.replaceAll("J", "0"),
            counts: modifyCounts(h[0].counts),
          },
          h[1],
        ] as [Hand, number]
    );
    const sortedHands = modifiedHands.toSorted((a, b) =>
      compareHands(b[0], a[0])
    );
    return sortedHands.reduce((p, c, i) => p + c[1] * (i + 1), 0);
  },
  {
    transform: (l) =>
      l
        .split(" ")
        .map((s, i) =>
          i === 0
            ? { counts: Object.groupBy(s.split(""), (s) => s), hand: s }
            : Number.parseInt(s)
        ) as [Hand, number],
    sep: "\n",
  }
);
task.expect(6440, 5905);

export default task;
