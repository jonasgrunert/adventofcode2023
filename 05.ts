import Solution from "./solution.ts";

type MappingEntry = [number, number, number]; // target, from, range
type Range = {
  start: number;
  end: number;
};

class Mapping {
  #mappings: MappingEntry[];

  constructor(mappings: MappingEntry[]) {
    this.#mappings = mappings.sort((a, b) => a[1] - b[1]);
  }

  get(n: number) {
    for (const m of this.#mappings) {
      if (n >= m[1] && n <= m[1] + m[2]) {
        return m[0] + (n - m[1]);
      }
    }
    return n;
  }

  calulateRange(ranges: Range[]) {
    const afterRanges: Range[] = [];
    let rs = [...ranges];
    for (const [target, from, range] of this.#mappings) {
      const from_end = from + range;
      const immediateRanges: Range[] = [];
      while (rs.length > 0) {
        const { start, end } = rs.pop()!;
        const before: Range = {
          start,
          end: Math.min(end, from),
        };
        const inter: Range = {
          start: Math.max(start, from),
          end: Math.min(from_end, end),
        };
        const after: Range = {
          start: Math.max(from_end, start),
          end,
        };
        if (before.end > before.start) {
          immediateRanges.push(before);
        }
        if (inter.end > inter.start) {
          afterRanges.push({
            start: inter.start - from + target,
            end: inter.end - from + target,
          });
        }
        if (after.end > after.start) {
          immediateRanges.push(after);
        }
      }
      rs = immediateRanges;
    }
    return afterRanges.concat(rs);
  }
}

const num = /\d+/g;

const task = new Solution(
  (arr: (Mapping | number[])[]) => {
    const [start, ...mappings] = arr as [number[], ...Mapping[]];
    const final = start.map((n) => mappings.reduce((p, c) => c.get(p), n));
    return Math.min(...final);
  },
  (arr: (Mapping | number[])[]) => {
    const [start, ...mappings] = arr as [number[], ...Mapping[]];
    // The idea is to build a range mapping and then move through the lowest range coming out with the lowest number
    const result: number[] = [];
    for (let i = 0; i < start.length - 1; i += 2) {
      let range = [{ start: start[0], end: start[0] + start[1] }];
      for (const m of mappings) {
        range = m.calulateRange(range);
      }
      result.push(Math.min(...range.map((r) => r.start)));
    }
    return Math.min(...result);
  },
  {
    transform: (l, i) => {
      if (i === 0) return l.match(num)!.map((n) => Number.parseInt(n));
      const [_header, ...entries] = l.split("\n");
      return new Mapping(
        entries.map(
          (e) => e.match(num)!.map((n) => Number.parseInt(n)) as MappingEntry
        )
      );
    },
    sep: "\n\n",
  }
);
task.expect(35, 46);

export default task;
