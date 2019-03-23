const getBytes = require("utf8-bytes");
const wasmModule = require("./build/main");

function readBytes(dv, offset) {
  let len = dv.getUint32(offset, true);

  if (len == 0) return [];

  let currentOffset = 4;
  len += 4;

  const sb = [];
  while (currentOffset < len) {
    const r = dv.getUint8(offset + currentOffset);

    sb.push(r);
    currentOffset += 1;
  }

  return sb;
}

exports.keccakHash = async function() {
  const instance = await wasmModule.default();

  const dataView = new DataView(instance.exports.memory.buffer);

  return {
    update: data => {
      const safeOffset = instance.exports.topMemory(0);
      const bytes = getBytes(data);
      bytes.forEach((value, ix) => {
        dataView.setUint8(safeOffset + ix, value);
      });
      instance.exports.update(safeOffset, bytes.length);
    },

    digest: () => {
      instance.exports.digest();
    },

    reset: () => {
      instance.exports.reset();
    },

    getResult: () => {
      const retAddress = instance.exports.resultAddress(0);

      return readBytes(dataView, retAddress)
        .map($ => ("00" + $.toString(16)).substr(-2))
        .join("");
    }
  };
};
