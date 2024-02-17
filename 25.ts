import Solution from "./solution.ts";

class DefaultMap extends Map<string, Set<string>> {
  #update(key: string, value: string) {
    if (this.has(key)) {
      this.get(key)?.add(value);
    } else {
      this.set(key, new Set([value]));
    }
  }

  add(key: string, ...values: string[]) {
    for (const v of values) {
      this.#update(key, v);
      this.#update(v, key);
    }
  }
}

const task = new Solution(
  (arr: [string, string[]][]) => {
    const vertices = new DefaultMap();
    for (const v of arr) {
      vertices.add(v[0], ...v[1]);
    }
    const start = new Set(vertices.keys());
    const other = new Set<string>();
    const count = (edge: string) =>
      [...vertices.get(edge)!].reduce((p, c) => other.has(c) ? p + 1 : p, 0);
    while ([...start].reduce((p, c) => p + count(c), 0) !== 3) {
      const candidate = [...start].reduce((p, c) =>
        count(p) > count(c) ? p : c
      );
      start.delete(candidate);
      other.add(candidate);
    }
    return start.size * other.size;
  },
  {
    transform: (l) =>
      l.split(": ").map((m, i) => i !== 0 ? m.split(" ") : m) as [
        string,
        string[],
      ],
    sep: "\n",
  },
);
task.expect(54);

export default task;
