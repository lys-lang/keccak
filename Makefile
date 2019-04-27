install:
	npm install -g lys-compiler

build:
	(rm -rf build || true)
	lys src/main.lys --wast
	lys src/wapm.lys --wast
	npx @zeit/ncc build src/index.ts -o dist
	npx mocha test.js

.PHONY: build