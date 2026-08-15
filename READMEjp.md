
# 生物多様性調査支援アプリ (Biodiversity Investigation Support System: BISS)

BISSは，生物多様性に関する調査を支援するために開発したものです．
植生調査，フロラ調査，動物調査などに使用可能です．

## ブラウザで試す

ダウンロードしなくても，以下からそのまま起動できます．

- 現行版 (おすすめ): <https://matutosi.github.io/biodiv/biss2.html>
- 旧版 (更新を終了しました): <https://matutosi.github.io/biodiv/biss.html>

野外調査で使うときは，オフラインでも動くように下記のダウンロードをおすすめします．

## インストール方法

以下の HTML ファイルをダウンロードして，ご自身のパソコンやタブレット等に保存してください．

- 現行版 (おすすめ): biss2.html
  <https://github.com/matutosi/biodiv/raw/main/www/biss2.html>
- 旧版 (更新を終了しました): biss.html
  <https://github.com/matutosi/biodiv/raw/main/www/biss.html>

どちらも <https://github.com/matutosi/biodiv/tree/main/www> にあります．

現行版は日本語と英語に対応しています．
画面左上の言語の選択で切り替えてください．


## 使用方法

biss2.html をGoogle Chrome などのブラウザで起動してください．

  # See example

## 注意

以下の単語は，文字列として使用しないでください．
  - auto, button, checkbox, date, delButton, fixed, inputs, item, list, locAcc, locLat, locLon, no, number, occ, plot, settings, text, type, updateButton

アルファベット，数字，- (ハイフン)，日本語文字などが文字列として利用可能です．
"_" (アンダーバー)は，使用しないでください．

## Rでのデータの利用方法

`ecan::read_biss()` (Rのパッケージecanにあります)をご利用ください．

https://github.com/matutosi/ecan

``` r
  # install.packages("devtools")
devtools::install_github("matutosi/ecan")
```


## 引用

松村 俊和 (2022) 生物多様性調査支援アプリ <https://matutosi.shinyapps.io/ecanvis/>.

# メモ: BISSを構築するためのツール

## Node.js

inlinerのインストールに必要．
以下からインストラーをダウンローとして実行．

https://nodejs.org/ja/download/

## inliner

inlinerで，html, js (JavaScript), css (CSS)をまとめて1つのファイルにする．
現行版では，biodiv2.htmlが元のhtmlファイルで，js2とcss2のフォルダにそれぞれJavaScriptとCSSのファイルを保存している．
inlinerでこれらをまとめたのが，biss2.html ．
旧版は biodiv.html + js + css で，まとめたものが biss.html ．

inlinerのインストール

```
npm install -g inliner
```

inlinerの実行

```
inliner -m biodiv2.html > biss2.html
```



## eslint

JavaScript コードの静的検証ツール．

```
npm install -g eslint
```
