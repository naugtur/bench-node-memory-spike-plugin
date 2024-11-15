// @ts-check
const { RecordMemorySpikePlugin } = require("../index.js");
const { Suite } = require("bench-node");
const { describe } = require("node:test");
const { setTimeout } = require("node:timers/promises");

function noop() {}

const wasteMemoryForAWhile = async () => {
  const a = Buffer.alloc(1024 * 1024, "a");
  await setTimeout(10);
  a.at(1); // prevent optimization
};

describe("memory spike plugin", async () => {
  const bench = new Suite({
    // reporter: noop,
    plugins: [new RecordMemorySpikePlugin()],
  });
  bench
    .add("sequence", async () => {
      for (let i = 0; i < 20; i++) {
        await wasteMemoryForAWhile();
      }
    })
    .add("concurent", async () => {
      await Promise.all(
        Array.from({ length: 20 }, () => wasteMemoryForAWhile()),
      );
    });

  const [bench1, bench2] = await bench.run();

  console.dir(
    {
      bench1,
      bench2,
    },
    { depth: 100 },
  );
});
