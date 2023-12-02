import Solution from "./solution.ts";

const colors = {
  blue: 14,
  green: 13,
  red: 12,
} as const;

type Game = {
  id: number;
} & Record<keyof typeof colors, number>;

const ColRegex = new RegExp(
  `(?<num>\\d*) (?<col>${Object.keys(colors).join("|")})`,
);

const mins = (
  c: keyof typeof colors,
  rounds: { col: keyof typeof colors; num: number }[],
) => Math.max(...rounds.filter((r) => r.col === c).map((r) => r.num), 0);

const task = new Solution(
  (arr: Game[]) =>
    arr.reduce((p, c) => {
      const { id, ...col } = c;
      const impossible = Object.entries(col).some(
        ([c, n]) => n > colors[c as keyof typeof colors],
      );
      return p + (impossible ? 0 : id);
    }, 0),
  (arr: Game[]) =>
    arr.reduce((p, c) => {
      return p + c.red * c.blue * c.green;
    }, 0),
  {
    transform: (v) => {
      const [_match, id, rest] = /Game (\d*): (.*)/.exec(v)!;
      const rounds = rest.split(/[;,]/).map((c) => {
        const r = ColRegex.exec(c)!.groups!;
        return {
          num: Number.parseInt(r.num),
          col: r.col as keyof typeof colors,
        };
      });
      return {
        id: Number.parseInt(id),
        green: mins("green", rounds),
        red: mins("red", rounds),
        blue: mins("blue", rounds),
      };
    },
    sep: "\n",
  },
);
task.expect(8, 2286);

export default task;
