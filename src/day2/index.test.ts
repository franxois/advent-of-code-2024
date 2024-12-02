import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { input as inputDay2 } from "./input.ts";

const parseLines = (input: string) => {
  return input.split("\n").map((line) => line.split(" ").map(Number));
};

const safeCountLine = (values: number[]) => {
  let lastValue = values[0];
  let direction: number | undefined = undefined;

  for (let i = 1; i < values.length; i++) {
    const currentValue = values[i];

    if (Math.abs(currentValue - lastValue) > 3) {
      return false;
    }
    if (Math.abs(currentValue - lastValue) < 1) {
      return false;
    }

    if (direction === undefined) {
      direction = currentValue < lastValue ? -1 : 1;
    } else {
      if (currentValue > lastValue && direction < 0) {
        return false;
      }
      if (currentValue < lastValue && direction > 0) {
        return false;
      }
    }
    lastValue = currentValue;
  }
  return true;
};

const safeCount = (input: string) => {
  return parseLines(input).filter(safeCountLine).length;
};

const safeCount2 = (input: string) => {
  return parseLines(input).filter((values) => {
    const first = safeCountLine(values);

    if (first) {
      return true;
    }

    for (let i = 0; i < values.length; i++) {
      const others = values.filter((_, j) => j !== i);
      if (safeCountLine(others)) {
        return true;
      }
    }

    return false;
  }).length;
};

describe("day2", () => {
  const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

  it("step1", () => {
    assert.equal(safeCount(input), 2);

    console.log("result 1", safeCount(inputDay2));

    assert.equal(safeCount(inputDay2), 407);
  });

  it("step2", () => {
    assert.equal(safeCount2(input), 4);

    console.log("result 2", safeCount2(inputDay2));

    assert.equal(safeCount2(inputDay2), 459);
  });
});
