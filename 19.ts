import Solution from "./solution.ts";

type Rule = ["a" | "m" | "s" | "x", "<" | ">", number, string];
type RuleSet = [string, {
  rules: Rule[];
  def: string;
}];
type Rules = Map<string, RuleSet[1]>;
type Material = Record<Rule[0], number>;
type Option = Record<Rule[0], [number, number]>;

const transformRule = (input: string): Rule => {
  const [n, target] = input.slice(2).split(":");
  return [input[0] as Rule[0], input[1] as Rule[1], Number.parseInt(n), target];
};

const transformRuleset = (input: string): RuleSet => {
  const [name, rest] = input.split("{");
  const rules = rest.split(",");
  return [name, {
    def: rules.at(-1)!.slice(0, -1),
    rules: rules.slice(0, -1).map(transformRule),
  }];
};

const transformMaterial = (input: string): Material =>
  Object.fromEntries(
    input.slice(1, -1).split(",").map((attr) => {
      const [name, num] = attr.split("=");
      return [name as Rule[0], Number.parseInt(num)] as const;
    }),
  ) as Material;

const result = (set: RuleSet[1], m: Material) => {
  for (const rule of set.rules) {
    if (rule[1] === "<" ? m[rule[0]] < rule[2] : m[rule[0]] > rule[2]) {
      return rule[3];
    }
  }
  return set.def;
};

const accept = (rules: Rules, m: Material): boolean => {
  let flow = "in";
  while (true) {
    flow = result(rules.get(flow)!, m);
    if (flow === "A") return true;
    if (flow === "R") return false;
  }
};

const optFromRules = (rules: Rule[], option: Option): Option => {
  return rules.reduce((p, r) => ({
    ...p,
    [r[0]]: [
      r[1] === "<" ? r[2] : p[r[0]][0],
      r[1] === ">" ? r[2] : p[r[0]][1],
    ],
  }), option);
};

const applyRuleToOpt = (rule: Rule, option: Option): Option => {
  return {
    ...option,
    [rule[0]]: [
      rule[1] === ">" ? rule[2] + 1 : option[rule[0]][0],
      rule[1] === "<" ? rule[2] - 1 : option[rule[0]][1],
    ],
  };
};

const poss = (rules: Rules, option: Option, ruleName: string): number => {
  if (ruleName === "R") return 0;
  if (ruleName === "A") {
    return Object.values(option).reduce((p, c) => p * (c[1] - c[0] + 1), 1);
  }
  const rule = rules.get(ruleName)!;
  return rule.rules.map((r, i) => {
    return poss(
      rules,
      applyRuleToOpt(
        rule.rules[i],
        optFromRules(rule.rules.slice(0, i), option),
      ),
      r[3],
    );
  }).reduce((p, c) => p + c) +
    poss(rules, optFromRules(rule.rules, option), rule.def);
};

const task = new Solution(
  (arr: (Material[] | Rules)[]) => {
    const rules = arr[0] as Rules;
    return (arr.slice(1).flat() as Material[]).reduce(
      (p, c) =>
        p + (accept(rules, c) ? Object.values(c).reduce((pn, n) => n + pn) : 0),
      0,
    );
  },
  (arr: (Material[] | Rules)[]) => {
    const rules = arr[0] as Rules;
    return poss(rules, {
      a: [1, 4000],
      m: [1, 4000],
      x: [1, 4000],
      s: [1, 4000],
    }, "in");
  },
  {
    transform: (l, i) => {
      const lines = l.split("\n");
      if (i === 0) return new Map(lines.map(transformRuleset));
      return lines.map(transformMaterial);
    },
    sep: "\n\n",
  },
);
task.expect(19114, 167409079868000);

export default task;
