//go:build js && wasm

package main

import (
	"bytes"
	"image"
	"runtime"
	"syscall/js"

	"github.com/fogleman/primitive/primitive"
)

func run(this js.Value, args []js.Value) interface{} {
	// args[0]: Uint8Array (画像データ)
	// args[1]: object { n, mode, alpha, size }
	// args[2]: callback(progress, svgString)

	// Uint8Arrayを[]byteに変換
	srcBytes := make([]byte, args[0].Length())
	js.CopyBytesToGo(srcBytes, args[0])

	n := args[1].Get("n").Int()
	mode := args[1].Get("mode").Int()
	alpha := args[1].Get("alpha").Int()
	size := args[1].Get("size").Int()
	callback := args[2]

	// 画像をデコードする
	img, _, err := image.Decode(bytes.NewReader(srcBytes))
	if err != nil {
		callback.Invoke(js.Null(), js.Null(), err.Error())
		return nil
	}

	// primitiveを実行する
	bg := primitive.MakeColor(primitive.AverageImageColor(img))
	model := primitive.NewModel(img, bg, size, runtime.NumCPU())

	// n ステップ回してコールバックで進捗を返す
	for i := 0; i < n; i++ {
		model.Step(primitive.ShapeType(mode), alpha, 1)

		svg := model.SVG()
		callback.Invoke(i+1, svg, js.Null())
	}

	return nil
}

func main() {
	js.Global().Set("primitiveRun", js.FuncOf(run))
	select {} // ランタイムを終了させない
}
