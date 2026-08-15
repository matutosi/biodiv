# biodiv (BISS) プロジェクト

## 概要

生物多様性調査支援アプリ (Biodiversity Investigation Support System: BISS)．
植生調査・フロラ調査・動物調査などの野外調査を，スマートフォンやタブレット，PC のブラウザで支援する．
単一の HTML ファイル (`www/biss.html`) として配布し，オフラインで動作する．

- 公開先: <https://github.com/matutosi/biodiv> (`main` ブランチの `www/` からダウンロード)
- Shiny 版: <https://matutosi.shinyapps.io/ecanvis/>
- データ解析: R パッケージ `ecan` の `ecan::read_biss()` で読み込む (<https://github.com/matutosi/ecan>)

## ディレクトリ構成

| パス            | 内容                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| `www/`          | アプリ本体                                                             |
| `www/biodiv.html`  | 旧版の元 HTML (`js/`・`css/` を参照)                                |
| `www/biodiv2.html` | 現行版の元 HTML (`js2/`・`css/` を参照)                             |
| `www/biss.html`    | 旧版の配布用 (inliner でまとめた単一ファイル)                       |
| `www/biss2.html`   | 現行版の配布用 (inliner でまとめた単一ファイル)                     |
| `www/js/`       | 旧版の JavaScript                                                      |
| `www/js2/`      | 現行版の JavaScript (こちらを編集する)                                 |
| `www/css/`      | スタイルシート (旧版・現行版で共用)                                    |
| `www/lang.html` | 多言語 (日本語・英語) の文字列定義                                     |
| `www/tools/`    | 試作・検証用の断片 (配布物には含めない)                                |
| `man/`          | 使い方マニュアル (`01-howtouse_jp.md` / `_en.md`) と画像・サンプルデータ |
| `R/`            | `code_analysis.R` (コードの静的な確認用)                               |
| `2210veg/`      | 2022年10月 植生学会 発表資料 (要旨・ポスター用画像)                    |
| `2310veg/`      | 2023年10月 植生学会 発表資料 (要旨・ポスター用画像)                    |

## ビルド手順

`js2/`・`css/` を編集したあと，inliner で単一ファイルにまとめる．

```
npm install -g inliner
inliner -m biodiv2.html > biss2.html
```

`www/run_inliner2.bat` が上記を実行する．
配布するのは `www/biss2.html` (旧版は `www/biss.html`)．

## 注意事項

- 予約語のため，データの文字列として使えない語:
  auto, button, checkbox, date, delButton, fixed, inputs, item, list, locAcc, locLat, locLon,
  no, number, occ, plot, settings, text, type, updateButton
- `_` (アンダーバー) は文字列として使わない (内部の区切り文字に使っているため)．
- 使用可能: アルファベット，数字，`-` (ハイフン)，日本語文字．

## 旧版と現行版

- **旧版 (`www/biodiv.html`・`www/js/`・`www/biss.html`) は凍結する**．
  そのまま保存し，機能追加も修正もしない．
- **改修は現行版 (`www/biodiv2.html`・`www/js2/`・`www/biss2.html`) に対してのみ行う**．
- `www/css/` は旧版・現行版で共用しているので，触るときは旧版への影響に注意する．

## ブランチ運用

- 開発は `develop`，公開は `main`．
- 配布ファイル (`www/biss2.html`) を更新したら `main` へマージする．
- このプロジェクトは公開リポジトリのため，`main` への反映は動作確認後に行う．

## 進捗状況

### 現在の状態

2026-08-15 (JST) 更新．

- プロジェクト管理用の `.claude/CLAUDE.md` を新規作成し，構成・ビルド手順・運用ルールを整理した．
- `www/run_inliner2.bat` のパスが古く (`D:\matu\work\ToDo\biodiv\www`) 実行できなかったので，
  `cd /d "%~dp0"` に変えてバッチファイルの置き場所に追随するようにした．
- `www/biodiv2.html` の先頭にあったコメントアウト済みの `<script>` 2行
  (`js2/encoding.js`・`js2/json.js`．実体は `62d1f6b` で削除済み) を削除した．
  コメント内だったため動作への影響はなく，見た目の整理のみ．
- `develop` を `main` へマージし，両ブランチを `origin` へ push した．
- **旧版は凍結して保存する**方針を決めた．今後の改修は現行版 (`biodiv2.html` + `js2/`) のみ．
- 現行版のコードを点検し，課題を「機能として未完了 / ツールの不整合 / 整理・確認」に分けて整理した．
  最優先は多言語化 (`lang.html`) が未接続のままになっている件．

### 課題一覧

方針が決まったもの:

- **旧版の扱い** → 凍結して保存する (「旧版と現行版」の節を参照)．改修は現行版のみ．

#### A. 機能として未完了 (優先度 高)

- **多言語化が未接続**: `www/lang.html` に日英の文字列 (`msgs`・`currentLanguage`) を定義してあるが，
  **どこからも読み込まれていない**．`biodiv2.html` に `<script>` が無く，`js2/*.js` に
  `msgs` や `currentLanguage` を使う箇所も無い．配布物 `biss2.html` にも日本語 UI 文字列が入っていない．
  `b1ebca4 apply multi lang` の作業が途中で止まっている状態．
  UI 文字列は現在 `js2/` 内にハードコードされているので，差し替えが必要．
- **「使い方」ボタンのリンク先が旧マニュアル**: `js2/example.js:2` の `showManual()` が
  `man/01-howtouse.md` (日英混在の旧統合版) を開く．
  `9e4869d split JP and EN` で `_jp.md` / `_en.md` に分割済みなので，
  分割後のどちらかへ (できれば表示言語に応じて) 切り替える．

#### B. 開発環境・ツールの不整合 (優先度 中)

- **`R/code_analysis.R` のパスが古い**: 5行目・8行目が `D:/matu/work/ToDo/biodiv/` を指しており，
  現在の場所 (`D:/Dropbox/ToDo/biodiv/`) では動かない．
  `www/run_inliner2.bat` と同じ原因なので，相対パス化するのが望ましい．

#### C. 整理・確認 (優先度 低)

- **`man/01-howtouse.md` の扱い**: 旧統合版 (1046行) が `_jp.md` (546行)・`_en.md` (531行) と併存している．
  上記の `showManual()` からリンクされているため，リンクを直すまでは消せない．
  直したあとに削除するか，リダイレクト用に残すか決める．
- **マニュアルと現行機能の突き合わせ**: `_jp.md` / `_en.md` の内容が現行版の挙動と合っているか確認する．
  最終更新は 2023年で，その後の変更 (入力データの保存，区切り文字の追加など) が反映されていない可能性がある．
- **`www/tools/` の整理**: 試作・検証用の断片が多数残っている
  (`not_used.js`，`unused.js`，`old/`，`jquery-3.6.0.js` など)．配布物には含まれない．
- **`biodiv2.html` 内の TODO**: `var` → `const` への置き換えと，関数のドキュメント整備．
- **ビルド副産物のコミット**: `2310veg/missfont.log` など，追跡不要なファイルが入っている．

### 補足: 配布物とソースの同期状況

`www/biss2.html` は `dc0f6fe` (2023-03-25) の生成物で，`js2/`・`css/` の最新更新
(`js2/ul_module.js`，同じく `dc0f6fe`) と同時点．**現状ずれは無い**．
`biodiv2.html` はその後に触っているが，削除したのはコメント行だけなので出力は変わらない．
次に `js2/` を改修したときは `run_inliner2.bat` で再ビルドすること．

### コミット履歴 (直近)

- `6a1efe7` add new files and update README for installation instructions
- `dc0f6fe` add "，" amd "、" as separator
- `29bf94d` csv -> tsv
- `e0ffa1c` add save input data
- `b1ebca4` apply multi lang
