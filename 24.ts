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

const subtract = (a: Vector, b: Vector) => a.map((n, i) => n - b[i]) as Vector;

const cross = (a: Vector, b: Vector): Vector => {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};

const dot = (a: Vector, b: Vector) => {
  return a.map((n, i) => n * b[i]).reduce((p, c) => p + c);
};

const solveLinear = (
  r: number,
  a: Vector,
  s: number,
  b: Vector,
  t: number,
  c: Vector
) => {
  const x = r * a[0] + s * b[0] + t * c[0];
  const y = r * a[1] + s * b[1] + t * c[1];
  const z = r * a[2] + s * b[2] + t * c[2];
  return [x, y, z] as Vector;
};
const independent = (a: Vector, b: Vector) => cross(a, b).some((p) => p != 0);

const findPlane = (l1: Hail, l2: Hail): [Vector, number] => {
  const point = subtract(l1[0], l2[0]);
  const velocity = subtract(l1[1], l2[1]);
  const vv = cross(l1[1], l2[1]);
  return [cross(point, velocity), dot(point, vv)];
};

const findRock = (l1: Hail, l2: Hail, l3: Hail): [Vector, number] => {
  const [a, A] = findPlane(l1, l2);
  const [b, B] = findPlane(l1, l3);
  const [c, C] = findPlane(l2, l3);

  const t = dot(a, cross(b, c));
  const w = solveLinear(A, cross(b, c), B, cross(c, a), C, cross(a, b)).map(
    (n) => Math.round(n / t)
  ) as Vector;

  const w1 = subtract(l1[1], w);
  const w2 = subtract(l2[1], w);
  const ww = cross(w1, w2);

  const E = dot(ww, cross(l2[0], w2));
  const F = dot(ww, cross(l1[0], w1));
  const G = dot(l1[0], ww);
  const S = dot(ww, ww);

  const rock = solveLinear(E, w1, -F, w2, G, ww);
  return [rock, S];
};

const task2 = (hails: Hail[]) => {
  // big thanks to https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kersplf/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
  const lines = [hails[0]];
  for (let i = 0; i < hails.length && lines.length < 3; i++) {
    if (lines.every((l) => independent(l[1], hails[i][1]))) {
      lines.push(hails[i]);
    }
  }
  const [rock, S] = findRock(...(lines as [Hail, Hail, Hail]));
  return rock.reduce((p, c) => p + c) / S;
};

const task = new Solution(
  (arr: Hail[]) => {
    return intersectsInArea(
      arr,
      arr.length === 5 ? [7, 27] : [200000000000000, 400000000000000]
    );
  },
  task2,
  {
    transform: (l) =>
      l
        .split(" @ ")
        .map((n) => n.split(", ").map((n) => Number.parseInt(n))) as Hail,
    sep: "\n",
  }
);
task.expect(2, 47);

export default task;
