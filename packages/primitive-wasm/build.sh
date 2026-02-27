#!/bin/sh
cd "$(dirname "$0")"

GOOS=js GOARCH=wasm go build -o primitive.wasm .

GOROOT=$(go env GOROOT)
WASM_EXEC_JS_PATH=$(find $GOROOT -name "wasm_exec.js")
cp "$WASM_EXEC_JS_PATH" ../frontend/public/
cp primitive.wasm ../frontend/public/
