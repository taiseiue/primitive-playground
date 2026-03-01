# primitive-playground
任意の画像を、幾何学図形だけで再構成するWebアプリ

[English](./README.md) | **Japanese**

## What's this?
これは任意の画像を、幾何学的な図形のみを用いて表現した画像に変換するWebアプリケーションです。WebAssemblyで動作し、完全にデバイス内で処理が行われます。

元画像|処理後
-----|-----
![Before](./docs/before.jpeg)|![After](./docs/after.png)

アルゴリズムは入力画像を基に、入力画像と描画する画像の誤差を最小に抑えることができる形状を、設定した図形のみを使用して再現しようとします。この処理を繰り返すことによって、一度にひとつ図形を追加します。図形が追加されていく様子が確認できるようになっています。

これは、fogleman氏によるアイデアである[fogleman/primitive](https://github.com/fogleman/primitive)のWASM移植およびWebUIです。元々のprimitiveはGo製のCLIツールで簡単には使用できないため、ブラウザ上から使用できるようにしました。ぜひ[fogleman/primitive](https://github.com/fogleman/primitive)にスターを付けてください。

## Usage
[primitive-playground.taiseiue.jp](https://primitive-playground.taiseiue.jp/)にアクセスすることで使用できます。通常、生成には数十秒~数分かかります。

設定できる値は以下の通りです。

**Shapes**
生成される図形の数。デフォルト値は100です。

**Mode**
生成される図形の形。`Combo`(コンボ)、`Triangle`(三角形)、`Rectangle`(長方形)、`Ellipse`(楕円)、`Circle`(正円)、`Rotated Rectangle`(回転した長方形による表現)、`Beziers`(ベジェ曲線)、`Rotated Ellipse`(回転した楕円による表現)、`Polygon`(ポリゴン)から選択できます。デフォルト値は`Triangle`です。

**Alpha**
Modeで`Combo`を使用したときのみ、各図形の透明度。
デフォルト値は128です。

**Input size**
画像をこのサイズまで縮小して処理します。これによって処理の高速化が期待できます。デフォルト値は256pxです。

**Output size**
出力画像のサイズ。デフォルト値は1024pxです。

**Preview interval**
何shapeごとにプレビューを更新するか。大きな値にすると処理が高速化できますが、フリーズしているように見えることがあります。デフォルト値は10shapesです。

## License
このソフトウェアは、[The MIT License](./LICENSE)のもとで公開します。

Copyright (c) 2025 Taisei Uemura  
Released under the [MIT license](./LICENSE)
