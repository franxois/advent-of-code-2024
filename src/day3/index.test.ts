import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const inputDay = readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const count = (intput: string) => {
  const re = /mul\((\d+),(\d+)\)/g;
  return [...intput.matchAll(re)]
    .flatMap((m) => parseInt(m[1]) * parseInt(m[2]))
    .reduce((a, b) => a + b, 0);
};

const count2 = (intput: string) => {
  const re = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

  let sum = 0;
  let enable = true;

  for (const match of intput.matchAll(re)) {
    if (enable && match[1] !== undefined && match[2] !== undefined) {
      sum += parseInt(match[1]) * parseInt(match[2]);
    } else if (match[0] === "do()") {
      enable = true;
    } else if (match[0] === "don't()") {
      enable = false;
    }
  }

  return sum;
};

describe("day3", () => {
  it("step1", () => {
    const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
    assert.equal(count(input), 161);
    assert.equal(count(inputDay), 174336360);
  });

  it("step2", () => {
    const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

    assert.equal(count2(input), 48);
    assert.equal(count2(inputDay), 88802350);
  });
});
