#!/bin/bash

rm -rf dist

webpack-cli

api-extractor run --local --verbose --config ./config/api-extractor.index.json
api-extractor run --local --verbose --config ./config/api-extractor.decorators.json
api-extractor run --local --verbose --config ./config/api-extractor.middlewares.json
api-extractor run --local --verbose --config ./config/api-extractor.validators.json

cp README.md ./dist/chuka/README.md

rm -rf temp
rm -rf dist-ts

node ./scripts/create-package-json.js
