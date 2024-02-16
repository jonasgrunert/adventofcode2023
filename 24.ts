import Solution from "./solution.ts";

type Vector = [number, number, number];
type Hail = [Vector, Vector];
class Coord {
  #params: Vector;
  #hail: Hail;

  private constructor(params: Vector, hail: Hail) {
    this.#params = params;
    this.#hail = hail;
  }

  static fromParameter(h: Hail) {
    const a = -h[1][1];
    const b = h[1][0];
    const c = -(h[0][0] * a + h[0][1] * b);
    return new Coord([a / c, b / c, 1], h);
  }

  get a() {
    return this.#params[0];
  }

  get b() {
    return this.#params[1];
  }

  get c() {
    return this.#params[2];
  }

  intersect(other: Coord): [number, number] {
    return [
      (this.b - other.b) / (this.a * other.b - other.a * this.b),
      -(this.a - other.a) / (this.a * other.b - other.a * this.b),
    ];
  }

  inFuture(p: [number, number]) {
    return p.every(
      (c, i) => Math.sign(c - this.#hail[0][i]) === Math.sign(this.#hail[1][i])
    );
  }
}

const intersectsInArea = (hails: Hail[], bounds: [number, number]) => {
  let count = 0;
  for (let i = 0; i < hails.length; i++) {
    for (let j = i + 1; j < hails.length; j++) {
      const a = Coord.fromParameter(hails[i]);
      const b = Coord.fromParameter(hails[j]);
      const s = a.intersect(b);
      if (
        s.every(
          (p) =>
            p !== Number.NEGATIVE_INFINITY && p >= bounds[0] && p <= bounds[1]
        ) &&
        a.inFuture(s) &&
        b.inFuture(s)
      ) {
        count++;
      }
    }
  }
  return count;
};

const task = new Solution(
  (arr: Hail[]) => {
    return intersectsInArea(
      arr,
      arr.length === 5 ? [7, 27] : [200000000000000, 400000000000000]
    );
  },
  {
    transform: (l) =>
      l
        .split(" @ ")
        .map((n) => n.split(", ").map((n) => Number.parseInt(n))) as Hail,
    sep: "\n",
  }
);
task.expect(2);

export default task;
