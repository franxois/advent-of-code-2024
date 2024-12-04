import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const inputDay = readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const parseInput = (input: string): string[][] => {
  return input.split("\n").map((line) => line.split(""));
};

const count = (intput: string) => {
  const tab = parseInput(intput);

  const h = tab.length;
  const w = tab[0].length;

  let count = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (tab[y][x] === "X") {
        if (
          tab[y][x + 1] === "M" &&
          tab[y][x + 2] === "A" &&
          tab[y][x + 3] === "S"
        ) {
          count++;
        }

        if (
          tab[y][x - 1] === "M" &&
          tab[y][x - 2] === "A" &&
          tab[y][x - 3] === "S"
        ) {
          count++;
        }

        if (
          y < h - 3 &&
          tab[y + 1][x + 1] === "M" &&
          tab[y + 2][x + 2] === "A" &&
          tab[y + 3][x + 3] === "S"
        ) {
          count++;
        }

        if (
          y < h - 3 &&
          tab[y + 1][x - 1] === "M" &&
          tab[y + 2][x - 2] === "A" &&
          tab[y + 3][x - 3] === "S"
        ) {
          count++;
        }

        if (
          y >= 3 &&
          tab[y - 1][x] === "M" &&
          tab[y - 2][x] === "A" &&
          tab[y - 3][x] === "S"
        ) {
          count++;
        }

        if (
          y >= 3 &&
          tab[y - 1][x + 1] === "M" &&
          tab[y - 2][x + 2] === "A" &&
          tab[y - 3][x + 3] === "S"
        ) {
          count++;
        }

        if (
          y >= 3 &&
          tab[y - 1][x - 1] === "M" &&
          tab[y - 2][x - 2] === "A" &&
          tab[y - 3][x - 3] === "S"
        ) {
          count++;
        }

        if (
          y < h - 3 &&
          tab[y + 1][x] === "M" &&
          tab[y + 2][x] === "A" &&
          tab[y + 3][x] === "S"
        ) {
          count++;
        }
      }
    }
  }

  return count;
};

const count2 = (intput: string) => {
  const tab = parseInput(intput);

  const h = tab.length;
  const w = tab[0].length;

  let count = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (tab[y][x] === "A") {
        if (
          y < h - 1 &&
          y > 0 &&
          ((tab[y - 1][x - 1] === "M" && tab[y + 1][x + 1] === "S") ||
            (tab[y - 1][x - 1] === "S" && tab[y + 1][x + 1] === "M")) &&
          ((tab[y + 1][x - 1] === "M" && tab[y - 1][x + 1] === "S") ||
            (tab[y + 1][x - 1] === "S" && tab[y - 1][x + 1] === "M"))
        ) {
          count++;
        }
      }
    }
  }

  return count;
};

describe("day4", () => {
  const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

  it("step1", () => {
    assert.equal(count(input), 18);
    assert.equal(count(inputDay), 2504);
  });

  it("step2", () => {
    assert.equal(count2(input), 9);
    assert.equal(count2(inputDay), 1923);
  });
});
