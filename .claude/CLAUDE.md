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
| `www/css/`      | 旧版のスタイルシート                                                   |
| `www/css2/`     | 現行版のスタイルシート (こちらを編集する)                              |
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

**注意**: inliner は標準入力が端末でないとき，引数のファイルではなく標準入力を読もうとする．
このため cmd やエクスプローラから `.bat` を実行する分には問題ないが，
スクリプトや自動化から `inliner ... > biss2.html` を実行すると**空のファイルができる**．
自動化から実行するときは Node の API を使う．

```
node -e "const I=require('<npmグローバル>/node_modules/inliner');const fs=require('fs');
process.chdir('www');new I('biodiv2.html',(e,h)=>{if(e)throw e;fs.writeFileSync('biss2.html',h)})"
```

## 多言語 (日本語・英語)

`www/js2/lang.js` が文字列カタログ (`msgs`) と切替の仕組みを持つ．

- 表示文字列は `msg('キー')` / `msgF('キー', 値)` (`%s` を置換) で取り出す．
- 要素にキーを `data-msg` 属性で持たせておくと，`applyLanguage()` が言語切替時に貼り直す．
  プレースホルダは `data-msg-ph`，`%s` の引数は `data-msg-args` (JSON) を使う．
  中身を後から足す span は，テキスト部分を `msgSpan('キー')` の子要素にする
  (親に直接書くと，貼り直しのときに子要素が消える)．
- 実行中にラベルが変わるボタンは `setMsg(el, 'キー')` を使う (`value` の直接代入は切替に追随しない)．
- 選択した言語は localStorage (`biss_language`) に残す．初回はブラウザの言語．
- **ブラウザが描く UI は翻訳できない**: `<input type="file">` のボタンと
  「選択されていません」はブラウザの言語で表示され，JS でも CSS でも変えられない．
  ファイル選択は `createFileInput()` を使う (file 入力を隠し，`msg()` のボタンから開く)．
- **データは翻訳しない**: 列名・項目名 (`Species`，`DATE` など)，設定名 (`_5_layers` など)，
  種名・地点名・階層名，動作を分岐する option の値 (`no save`，`NEW`)，
  そして**表の中のボタン** (`DELETE`，`UPDATE_TIME_GPS`)．
  表の中のボタンは `getCellData()` が `value` をセルのデータとして書き出すため，
  翻訳すると保存する TSV/JSON が変わり `ecan::read_biss()` が壊れる．

## 配信 (GitHub Pages)

`.github/workflows/pages.yml` が `main` への push で `www/` の中身をサイトのルートとして配信する．
`www/tools/` は試作物なので配信対象から外している．

- 現行版: <https://matutosi.github.io/biodiv/biss2.html>
- 旧版: <https://matutosi.github.io/biodiv/biss.html>

もともとは `www/cp_biodiv.bat` で別リポジトリ (`matutosi.github.io` の `docs/biodiv/`) へ
手作業でコピーしていたが，パスが古くなって動かず配信物が古いまま止まっていた．
この仕組みに移したので `www/cp_biodiv.bat` と，コピー先へのショートカット `www/docs.lnk` は
削除した (どちらも `.gitignore` 対象でリポジトリには入っていない)．
`matutosi.github.io` 側の `docs/biodiv/` は，混乱を避けるため整理するか，
このリポジトリの Pages へ誘導するのが望ましい．

## 注意事項

- 予約語のため，データの文字列として使えない語:
  auto, button, checkbox, date, delButton, fixed, inputs, item, list, locAcc, locLat, locLon,
  no, number, occ, plot, settings, text, type, updateButton
- `_` (アンダーバー) は文字列として使わない (内部の区切り文字に使っているため)．
- 使用可能: アルファベット，数字，`-` (ハイフン)，日本語文字．

## 旧版と現行版

- **旧版 (`www/biodiv.html`・`www/js/`・`www/css/`・`www/biss.html`) は凍結する**．
  そのまま保存し，機能追加も修正もしない．
- **改修は現行版 (`www/biodiv2.html`・`www/js2/`・`www/css2/`・`www/biss2.html`) に対してのみ行う**．
- CSS はもともと `www/css/` を両版で共用していたが，現行版の変更が旧版に及ばないよう
  `www/css2/` に分離した．現行版が使うのは tab・table・full_screen・ul の4つ，
  旧版が使うのは tab・table・full_screen・canvas の4つ．
  分離した時点では中身は同一なので，差分は今後の改修で生じる．

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
- **多言語化 (課題A-1) を実装した**．`www/js2/lang.js` を新規作成し，`biodiv2.html` と
  `js2/` の11ファイルの表示文字列を `msg()` 経由に置き換えた (「多言語」の節を参照)．
  未接続で壊れていた `www/lang.html` (プロトタイプ) は役目を終えたので削除した．
- **「使い方」のリンク (課題A-2) も直した**．`showManual()` が表示言語に応じて
  `man/01-howtouse_jp.md` / `_en.md` を開く．旧統合版 `01-howtouse.md` は参照されなくなった．
- 配布ファイル `www/biss2.html` を再ビルドした (768,127 バイト)．
  外部参照が残っていないこと，日本語文字列と言語セレクタが入っていることは確認済み．
- 多言語化・CSS の分離・README の更新を `main` へマージして公開した．
- **GitHub Pages での配信をこのリポジトリに移した** (「配信」の節を参照)．
- 不要になったファイルを削除した．
  `man/01-howtouse.md` (旧統合版．`showManual()` の修正で未参照になった．
  旧版 `biss.html` には使い方ボタン自体が無いので影響なし)，
  `www/cp_biodiv.bat`・`www/docs.lnk` (旧デプロイ経路)．
- `_jp.md` / `_en.md` に残っていた壊れたリンク (各5件) を直した．
  リネーム前の `man/howtouse.md` を指したままだったので，それぞれ自分自身を指すようにした．
  日本語見出しのアンカーは，GitHub が実際に生成する id を確認して合わせている
  (`(` `)` や `・` は取り除かれる: `#表の表示変更操作地点観察共通`)．
- **CSS を旧版・現行版で分離した**．`www/css2/` を作り，`biodiv2.html` の参照先を移した．
  これで現行版の CSS を触っても凍結した旧版の見た目は変わらない．
- **README に旧版・現行版のダウンロード URL を明記した** (`README.md`・`READMEjp.md`)．
  現行版 `biss2.html` をすすめ，旧版 `biss.html` は更新を終了した旨を書いた．
  多言語対応の案内と，ビルド例 (`biodiv2.html` → `biss2.html`) も現行版に合わせた．
  **ブラウザでの動作確認をしないまま公開している**ので，実機で確認すること
  (見る点は「課題一覧 > A」に書いた)．問題があれば `main` を戻す．
- **README に GitHub Pages の URL を足した** (`README.md`・`READMEjp.md`)．
  「ブラウザで試す」の節を作り，<https://matutosi.github.io/biodiv/biss2.html> (現行版) と
  `biss.html` (旧版) を書いた．ダウンロード用の raw URL は用途が違うのでそのまま残し，
  野外ではオフラインで動くようダウンロードをすすめる旨を添えた．
- **ファイル選択の日本語表示を直した**．英語表示のときも「ファイルを選択」「選択されていません」が
  出ていたのは，`<input type="file">` の文言をブラウザが描いているため
  (ページの言語切替では変えられない．CSS でも消せない)．
  `createFileInput()` (`js2/create_input.js`) を作り，file 入力を `display:none` で隠して
  `msg('choose_file')` のボタンから `click()` する形にした．
  該当は3か所 (設定の読込・種一覧の登録・植物相の入替)．
  `www/biss2.html` を再ビルドした (769,375 バイト)．

### 課題一覧

方針が決まったもの:

- **旧版の扱い** → 凍結して保存する (「旧版と現行版」の節を参照)．改修は現行版のみ．
- **多言語化 (旧 A-1)** → 実装済み．「多言語」の節を参照．
- **「使い方」のリンク (旧 A-2)** → 修正済み．表示言語に応じて `_jp.md` / `_en.md` を開く．

#### A. 機能として未完了 (優先度 高)

- **多言語化のブラウザでの動作確認**: 実機で未確認．次の点を見る．
  - 言語セレクタで日英が切り替わり，入力済みのデータが消えないこと．
  - 切替後に新しく作った地点タブ・表・種一覧のラベルも切り替わっていること．
  - 保存した TSV/JSON の列名と `DELETE` 列の値が英語のままであること
    (ここが変わると `ecan::read_biss()` が壊れる)．
  - 「表を非表示 / 表を表示」の切替と，列の「非表示 → 表示: 全列」の並びが崩れていないこと
    (`table_hide_show.js` の子要素数の判定を 2 → 3 に変えたため)．
- **未翻訳の残り**: 表の中のボタン (`DELETE`，`UPDATE_TIME_GPS`) は仕様上あえて英語のまま．
  日本語で見せたい場合は，セルのデータを列名から取るようにする改修が別途必要．

#### B. 開発環境・ツールの不整合 (優先度 中)

- **`R/code_analysis.R` のパスが古い**: 5行目・8行目が `D:/matu/work/ToDo/biodiv/` を指しており，
  現在の場所 (`D:/Dropbox/ToDo/biodiv/`) では動かない．
  `www/run_inliner2.bat` と同じ原因なので，相対パス化するのが望ましい．

#### C. 整理・確認 (優先度 低)

- **マニュアルと現行機能の突き合わせ**: `_jp.md` / `_en.md` の内容が現行版の挙動と合っているか確認する．
  最終更新は 2023年で，その後の変更 (入力データの保存，区切り文字の追加，多言語化) が
  反映されていない．とくに言語セレクタの説明は両方に追記が要る．
- **`www/tools/` の整理**: 試作・検証用の断片が多数残っている
  (`not_used.js`，`unused.js`，`old/`，`jquery-3.6.0.js` など)．配布物には含まれない．
- **`biodiv2.html` 内の TODO**: `var` → `const` への置き換えと，関数のドキュメント整備．
- **ビルド副産物のコミット**: `2310veg/missfont.log` など，追跡不要なファイルが入っている．

### 補足: 配布物とソースの同期状況

`js2/`・`css2/`・`biodiv2.html` を改修したら `www/biss2.html` を再ビルドすること．
再ビルドを忘れると，配布物だけが古いまま公開される．
