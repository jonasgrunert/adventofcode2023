import Solution from "./solution.ts";

// pulse: false = low, ture: high

type Signal = [string, string, boolean]; // from, to, pulse

class Broadcaster {
  #receivers: string[];
  #name: string;
  #pulses = [0, 0];

  constructor(name: string, receivers: string[]) {
    this.#name = name;
    this.#receivers = receivers.toReversed();
  }

  get receivers() {
    return this.#receivers;
  }

  get low() {
    return this.#pulses[0];
  }

  get high() {
    return this.#pulses[1];
  }

  get name() {
    return this.#name;
  }

  receive(_from: string, pulse: boolean): Signal[] {
    this.#pulses[pulse ? 1 : 0]++;
    return this.#receivers.map((r) => [this.name, r, pulse]);
  }
}

class FlipFlop extends Broadcaster {
  #state = false; // false is off, and true is on

  receive(from: string, pulse: boolean): Signal[] {
    super.receive(from, pulse);
    if (!pulse) {
      this.#state = !this.#state;
      return this.receivers.map((r) => [this.name, r, this.#state]);
    }
    return [];
  }
}

class Conjunction extends Broadcaster {
  #inputs = new Map<string, boolean>();

  addInput(name: string) {
    this.#inputs.set(name, false);
  }

  receive(from: string, pulse: boolean): Signal[] {
    super.receive(from, pulse);
    this.#inputs.set(from, pulse);
    return this.receivers.map((
      r,
    ) => [this.name, r, ![...this.#inputs.values()].every((p) => p)]);
  }
}

type Module = Broadcaster | FlipFlop | Conjunction;

const score = (modules: Map<string, Module>): [number, number] => {
  return [...modules.values()].reduce((p, c) => [p[0] + c.low, p[1] + c.high], [
    0,
    0,
  ]);
};

const greatestCommonDemoninator = (a: number, b: number): number =>
  b == 0 ? a : greatestCommonDemoninator(b, a % b);
const leastCommonMultiple = (a: number, b: number) =>
  (a / greatestCommonDemoninator(a, b)) * b;

const task = new Solution(
  (arr: Map<string, Module>[]) => {
    const modules = arr[0];
    for (let i = 1; i <= 1000; i++) {
      const queue = [["button", "broadcaster", false] as Signal];
      while (queue.length > 0) {
        const pulse = queue.pop()!;
        const module = modules.get(pulse[1]);
        if (module) {
          queue.unshift(
            ...module.receive(pulse[0], pulse[2]),
          );
        }
      }
    }
    return score(modules).reduce((p, c) => p * c);
  },
  (arr: Map<string, Module>[]) => {
    const modules = arr[0];
    let i = 1;
    const feeders = Object.fromEntries(
      [...modules.values()].filter((m) =>
        m.receivers.some((r) => modules.get(r)?.receivers.includes("rx"))
      ).map((m) => [m.name, 0]),
    );
    if (Object.keys(feeders).length === 0) return 0;
    while (Object.values(feeders).some((s) => s === 0)) {
      const queue = [["button", "broadcaster", false] as Signal];
      while (queue.length > 0) {
        const pulse = queue.pop()!;
        const module = modules.get(pulse[1]);
        if (module) {
          queue.unshift(
            ...module.receive(pulse[0], pulse[2]),
          );
        }
      }
      for (const [key, value] of Object.entries(feeders)) {
        if (modules.get(key)?.low !== 0 && value === 0) {
          feeders[key] = i;
        }
      }
      i++;
    }
    return Object.values(feeders).reduce((p, c) => leastCommonMultiple(p, c));
  },
  {
    transform: (all) => {
      const modules = new Map(
        all.split("\n").map((l): [string, Broadcaster] => {
          const [name, destinations] = l.split(" -> ");
          const dest = destinations.split(", ");
          if (name === "broadcaster") {
            return [name, new Broadcaster(name, dest)];
          }
          if (name.startsWith("&")) {
            return [name.slice(1), new Conjunction(name.slice(1), dest)];
          }
          if (name.startsWith("%")) {
            return [name.slice(1), new FlipFlop(name.slice(1), dest)];
          }
          throw new Error("unknown module");
        }),
      );
      for (const [n, m] of modules) {
        for (const r of m.receivers) {
          const d = modules.get(r);
          if (d instanceof Conjunction) {
            d.addInput(n);
          }
          if (d === undefined) {
            modules.set(r, new Broadcaster(r, []));
          }
        }
      }
      return modules;
    },
    sep: "\n\n",
  },
);
task.expect(11687500, 0);

export default task;
