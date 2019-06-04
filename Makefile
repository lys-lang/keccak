install:
	npm install -g lys

build:
	(rm -rf build || true)
	lys src/main.lys --wast
	npx @zeit/ncc build src/index.ts -o dist
	npx mocha test.js

.PHONY: build
