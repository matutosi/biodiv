
# 生物多様性調査支援アプリ (Biodiversity Investigation Support System: BISS)

BISSは，生物多様性に関する調査を支援するために開発したものです．
植生調査，フロラ調査，動物調査などに使用可能です．

## インストール方法

biss.html を以下からダウンロードして，ご自身のパソコンやタブレット等に保存してください．

https://github.com/matutosi/biodiv/tree/main/www


## 使用方法

biss.html をGoogle Chrome などのブラウザで起動してください．

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
BISSでは，biodiv.htmlが元のhtmlファイルで，jsとcssのフォルダにそれぞれJavaScriptとCSSのファイルを保存している．
inlinerでこれらをまとめたのが，biss.html ．

inlinerのインストール

```
npm install -g inliner
```

inlinerの実行

```
inliner -m biodiv.html > biss.html
```



## eslint

JavaScript コードの静的検証ツール．

```
npm install -g eslint
```
