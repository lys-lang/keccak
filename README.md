[![Build Status](https://travis-ci.org/lys-lang/keccak.svg?branch=master)](https://travis-ci.org/lys-lang/keccak)

# Keccak256 implemented in Lys

Specification at: http://keccak.noekeon.org/specs_summary.html

This implementation is based on https://github.com/axic/keccak-wasm/blob/master/keccak.wast which is also based on https://github.com/rhash/RHash/blob/master/librhash/sha3.c

## Objective of this repository

The objective is to provide a "real life" use case for Lys, and gather feedback and ideas from the usage of the tool. As well as detect any kind of gap in the tooling.

> **This library is not intended to be used in production. This is only a tech preview for Lys**

To start with the code please take a look at

- The implementation of keccak [src/keccak.lys](src/keccak.lys)
- The exposed API [src/main.lys](src/main.lys)
- The glue code for JS [src/index.ts](src/index.ts)

## To build locally

Run `make build`, make sure to have at least Node.js 10 installed.

1. It first builds Lys to the [build](build) folder using `lys src/main.lys --wast`
2. It then uses `@zeit/ncc` to create a single file using [src/index.ts](src/index.ts)
3. Finally, it performs a [sanity test](test.js) using mocha.
