import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { input as inputDay1 } from "./input.ts";

const parseLines = (input: string) => {
  const lefts: number[] = [];
  const rights: number[] = [];

  for (const line of input.split("\n")) {
    const exec = /(\d+)\s+(\d+)/.exec(line.trim());

    if (exec) {
      lefts.push(parseInt(exec[1]));
      rights.push(parseInt(exec[2]));
    }
  }

  return { lefts, rights };
};

const distance = (input: string) => {
  const { lefts, rights } = parseLines(input);

  lefts.sort((a, b) => a - b);
  rights.sort((a, b) => a - b);

  let sum = 0;

  for (let i = 0; i < lefts.length; i++) {
    const left = lefts[i];
    const right = rights[i];
    sum += Math.abs(left - right);
  }

  return sum;
};

const similarity = (input: string) => {
  const { lefts, rights } = parseLines(input);

  let sum = 0;

  for (let i = 0; i < lefts.length; i++) {
    const left = lefts[i];

    const multiplier = rights.filter((right) => right === left).length;

    sum += left * multiplier;
  }

  return sum;
};

describe("day1", () => {
  const input = `3   4
4   3
2   5
1   3
3   9
3   3`;

  it("distance", () => {
    assert.equal(distance(input), 11);

    console.log("result 1", distance(inputDay1));
  });

  it("similarity", () => {
    assert.equal(similarity(input), 31);

    console.log("result 2", similarity(inputDay1));
  });
});
