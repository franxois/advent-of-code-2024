import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const inputDay = readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const parseInput = (input: string) => {
  const [rulesLines, pagesListLines] = input.split("\n\n");

  const rules = rulesLines.split("\n").map((rule) => {
    return rule.split("|").map(Number);
  });

  const pagesList = pagesListLines
    .split("\n")
    .map((pages) => pages.split(",").map(Number));

  return { rules, pagesList };
};

const respectRules = (rules: number[][], page: number[]) => {
  for (let i = 0; i < page.length; i++) {
    const nexts = page.slice(i + 1);

    const shouldBeBefore = rules
      .filter(([a, b]) => b === page[i])
      .map(([a, b]) => a);

    for (const next of nexts) {
      if (shouldBeBefore.includes(next)) {
        return false;
      }
    }
  }

  return true;
};

const count = ({
  rules,
  pagesList,
}: {
  rules: number[][];
  pagesList: number[][];
}): number => {
  let acc = 0;

  for (const page of pagesList) {
    if (respectRules(rules, page)) {
      const toAcc = page[Math.floor(page.length / 2)];

      acc += toAcc;
    }
  }

  return acc;
};

const reorder = (rules: number[][], page: number[]) => {
  return page.toSorted((a, b) => {
    if (rules.some(([x, y]) => x === a && y === b)) {
      return -1;
    } else return 1;
  });
};

const count2 = ({
  rules,
  pagesList,
}: {
  rules: number[][];
  pagesList: number[][];
}): number => {
  let acc = 0;

  for (const page of pagesList) {
    if (!respectRules(rules, page)) {
      const p2 = reorder(rules, page);

      const toAcc = p2[Math.floor(p2.length / 2)];

      acc += toAcc;
    }
  }

  return acc;
};

describe("day5", () => {
  const input = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

  it("step1", () => {
    assert.equal(count(parseInput(input)), 143);
    assert.equal(count(parseInput(inputDay)), 5064);

    // assert.equal(count(inputDay), 2504);
  });

  it("step2", () => {
    const parsedInput = parseInput(input);

    assert.deepEqual(
      reorder(parsedInput.rules, [75, 97, 47, 61, 53]),
      [97, 75, 47, 61, 53]
    );

    assert.equal(count2(parsedInput), 123);
    assert.equal(count2(parseInput(inputDay)), 5152);
  });
});
