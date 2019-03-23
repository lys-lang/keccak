const keccak = require(".").default;

function mustEqual(a, b) {
  if (a != b) {
    throw new Error(`${a} did not equal ${b}`);
  }
}

describe("sanity tests", () => {
  let instance = null;

  it("creates the instance", async () => {
    instance = await keccak();
  });

  it("test empty strings", () => {
    mustEqual(instance.digest(), "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
    instance.update("");
    mustEqual(instance.digest(), "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
    mustEqual(instance.digest(), "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
  });

  it("test full string", () => {
    instance.update("juanca");
    mustEqual(instance.digest(), "2a898529bc7ae0f14d153006cfd0a9107141696da0af85c8f1c3a7edcae831b6");

    // digest resets the state
    mustEqual(instance.digest(), "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
  });

  it("test partial updates for streams", () => {
    instance.update("jua");
    instance.update("nca");
    mustEqual(instance.digest(), "2a898529bc7ae0f14d153006cfd0a9107141696da0af85c8f1c3a7edcae831b6");

    // digest resets the state
    mustEqual(instance.digest(), "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
  });
});
