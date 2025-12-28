#!/bin/bash

rm -rf dist

webpack-cli

api-extractor run --local --verbose --config ./config/api-extractor.index.json

cp ../../README.md ./dist/chuka/README.md

rm -rf temp
rm -rf dist-ts

node ./scripts/create-package-json.js
