import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const inputDay = readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const parseInput = (input: string) => {
  return input.split("\n").map((line) => line.split(""));
};

const turnRight = ([i, j]: [number, number]): [number, number] => {
  if (i === 1 && j === 0) {
    return [0, -1];
  }

  if (i === 0 && j === 1) {
    return [1, 0];
  }

  if (i === -1 && j === 0) {
    return [0, 1];
  }
  if (i === 0 && j === -1) {
    return [-1, 0];
  }
};

type Point = { i: number; j: number; direction: [number, number] };

const getPath = (
  map: string[][],
  [i, j]: [number, number],
  directionIni: [number, number],
  history?: Point[],
  filterUniq = true
): Point[] => {
  let path: Point[] = [{ i, j, direction: directionIni }];

  if (history) [(path = [...history, ...path])];

  let direction = directionIni;

  while (i > 0 && j > 0 && i < map.length && j < map[i].length) {
    i += direction[0];
    j += direction[1];

    if (!(i >= 0 && j >= 0 && i < map.length && j < map[i].length)) break;

    if (map[i][j] === "#") {
      i -= direction[0];
      j -= direction[1];

      direction = turnRight(direction);
    } else {
      if (
        path.some(
          (p) =>
            p.i === i &&
            p.j === j &&
            p.direction[0] === direction[0] &&
            p.direction[1] === direction[1]
        )
      )
        throw new Error("loop");

      path.push({ i, j, direction });
    }
  }

  if (!filterUniq) return path;

  const uniqPath = path.filter(
    (p, i) => path.findIndex((p2) => p2.i === p.i && p2.j === p.j) === i
  );

  return uniqPath;
};

const getBlocks = (input: string) => {
  const map = parseInput(input);
  const [is, js] = getStart(map);
  const [i, j] = [is, js];
  const direction = getDirection(map[i][j]);
  const path = getPath(map, [i, j], direction, [], false);

  // printMap(parseInput(input), path, []);

  const blocks: [number, number][] = [];

  for (let idx = 0; idx < path.length; idx++) {
    const p = path[idx];

    const nextI = p.i + p.direction[0];
    const nextJ = p.j + p.direction[1];

    if (
      nextI >= 0 &&
      nextJ >= 0 &&
      nextI < map.length &&
      nextJ < map[nextI].length &&
      map[nextI][nextJ] !== "#" &&
      !path.slice(0, idx).some((p2) => p2.i === nextI && p2.j === nextJ)
    ) {
      const backup = map[nextI][nextJ];
      map[nextI][nextJ] = "#";

      try {
        const newPath = getPath(
          map,
          [p.i, p.j],
          turnRight(p.direction),
          path.slice(0, idx)
        );
      } catch (err) {
        console.log(idx, err.message);
        blocks.push([nextI, nextJ]);
      }

      map[nextI][nextJ] = backup;
    }

    // if (idx === 200) {
    //   printMap(parseInput(input), path.slice(0, idx), blocks);
    // }
  }

  printMap(parseInput(input), path, blocks);

  return blocks.filter((b) => !(b[0] === is && b[1] === js));
};

const printMap = (
  map: string[][],
  path: Point[],
  blocks: [number, number][]
) => {
  for (const p of path) {
    const c = map[p.i][p.j];
    if (c === "." && p.direction[0] === 0) {
      map[p.i][p.j] = "~";
    }
    if (c === "." && p.direction[1] === 0) {
      map[p.i][p.j] = "|";
    }
    if (c === "~" && p.direction[0] !== 0) {
      map[p.i][p.j] = "+";
    }
    if (c === "|" && p.direction[1] !== 0) {
      map[p.i][p.j] = "+";
    }
  }

  for (const block of blocks) {
    map[block[0]][block[1]] = `O`;
  }

  console.log(map.map((l) => l.join("")).join("\n"));
};

const getStart = (map: string[][]): [number, number] => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] !== "." && map[i][j] !== "#") {
        return [i, j];
      }
    }
  }
};

const getDirection = (pos: string): [number, number] => {
  switch (pos) {
    case "^":
      return [-1, 0];
    case ">":
      return [0, 1];
    case "<":
      return [0, -1];
    case "v":
      return [1, 0];
    default:
      throw new Error(`Unknown pos ${pos}`);
  }
};

describe("day6", () => {
  const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

  const input2 = `...........
.......#...
........#..
...........
.^....#....
.......#...
...........`;

  const input3 = `###
#.#
#.#
#.#
#^#`;

  const input4 = `.##..
....#
.....
.^.#.
.....`;

  const input5 = `.#
#<`;

  const input6 = `....>.#
.....#.`;

  // https://www.reddit.com/r/adventofcode/comments/1h7tovg/comment/m0stkxk/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

  const input7 = `...........#.....#......
...................#....
...#.....##.............
......................#.
..................#.....
..#.....................
....................#...
........................
.#........^.............
..........#..........#..
..#.....#..........#....
........#.....#..#......`;

  it("step1", () => {
    assert.deepEqual(getStart(parseInput(input)), [6, 4]);

    const map = parseInput(input);
    const start = getStart(map);
    const direction = getDirection(map[start[0]][start[1]]);

    assert.equal(getPath(map, start, direction).length, 41);

    const map2 = parseInput(inputDay);
    const start2 = getStart(map2);
    const direction2 = getDirection(map2[start2[0]][start2[1]]);

    assert.equal(getPath(map2, start2, direction2).length, 4826);

    // assert.equal(count(inputDay), 2504);
  });

  it("step2", () => {
    const blocks = getBlocks(input);
    assert.equal(blocks.length, 6);

    const blocksInput7 = getBlocks(input7);
    assert.equal(blocksInput7.length, 19);

    const blocks2 = getBlocks(inputDay);
    const guess = 1867;
    assert.ok(blocks2.length < guess, `Result is less than ${guess}`);
    assert.notEqual(blocks2.length, 1605);
    assert.notEqual(blocks2.length, 1677);

    console.log("Result", blocks2.length);
  });
});
