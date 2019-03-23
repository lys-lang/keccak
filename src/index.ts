declare var require: any;
const getBytes = require("utf8-bytes");
const wasmModule = require("../build/main");

function readBytes(dv: DataView, offset: number) {
  const ret = [];
  readBytesToRef(dv, offset, ret);
  return ret;
}

function readBytesToRef(dv: DataView, offset: number, ref: Array<number> | Uint8Array): void {
  let len = dv.getUint32(offset, true);

  if (len == 0) return;

  let currentOffset = 4;
  let currentIndex = 0;
  len += 4;

  while (currentOffset < len) {
    const r = dv.getUint8(offset + currentOffset);

    ref[currentIndex] = r;
    currentOffset += 1;
    currentIndex += 1;
  }
}

export async function keccakHash() {
  const instance = await wasmModule.default();

  const dataView = new DataView(instance.exports.memory.buffer);

  function digest(): string;
  function digest(hexResult: false): Uint8Array;
  function digest(hexResult: true): string;
  function digest(hexResult: boolean = true): string | Uint8Array {
    const retAddress = instance.exports.digest();

    if (hexResult) {
      const ret = readBytes(dataView, retAddress)
        .map($ => ("00" + $.toString(16)).substr(-2))
        .join("");
      instance.exports.reset();

      return ret;
    } else {
      const ret = new Uint8Array(32);

      readBytesToRef(dataView, retAddress, ret);
      instance.exports.reset();

      return ret;
    }
  }

  function update(data: string | Uint8Array | Array<number>) {
    const safeOffset = instance.exports.topMemory(0);

    if (typeof data === "string") {
      const bytes = getBytes(data);
      bytes.forEach((value: number, ix: number) => {
        dataView.setUint8(safeOffset + ix, value);
      });

      instance.exports.update(safeOffset, bytes.length);
      return;
    } else if (data instanceof Uint8Array) {
      data.forEach((value: number, ix: string | number) => {
        dataView.setUint8(safeOffset + ix, value);
      });

      instance.exports.update(safeOffset, data.length);
      return;
    } else if (data instanceof Array) {
      data.forEach((value: number, ix: string | number) => {
        dataView.setUint8(safeOffset + ix, value);
      });

      instance.exports.update(safeOffset, data.length);
      return;
    }

    throw new Error("update(data): Only Array<Number> UInt8Array and UTF-8 strings are allowed");
  }

  return {
    update,
    digest
  };
}

export default keccakHash;
