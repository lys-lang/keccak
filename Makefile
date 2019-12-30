install:
	npm install --dev-dependencies lys@latest

build:
	(rm -rf build || true)
	./node_modules/.bin/lys src/main.lys --wast
	npx @zeit/ncc build src/index.ts -o dist
	npx mocha test.js

.PHONY: build
