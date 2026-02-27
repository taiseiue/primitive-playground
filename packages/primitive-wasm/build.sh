#!/bin/sh
cd "$(dirname "$0")"

GOOS=js GOARCH=wasm go build -o primitive.wasm .
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ../frontend/public/
cp primitive.wasm ../frontend/public/
