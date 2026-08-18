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
| `man/`          | 使い方マニュアル (`01-howtouse_jp.md` / `_en.md`) とサンプルデータ      |
| `man/img/`      | 英語版マニュアルの画像 (`e2e/shoot_manual.py --en` が撮る)              |
| `man/img_jp/`   | 日本語版マニュアルの画像 (`e2e/shoot_manual.py` が撮る)                 |
| `R/`            | `code_analysis.R` (コードの静的な確認用)                               |
| `test/`         | jsdom の回帰スモークテスト (`npm test`)                                |
| `e2e/`          | Playwright のブラウザテスト (`pytest`)                                 |
| `2210veg/`      | 2022年10月 植生学会 発表資料 (要旨・ポスター用画像)                    |
| `2310veg/`      | 2023年10月 植生学会 発表資料 (要旨・ポスター用画像)                    |

## ビルド手順

`js2/`・`css/` を編集したあと，inliner で単一ファイルにまとめる．

```
npm install -g inliner
inliner --inlinemin biodiv2.html > biss2.html
```

`www/run_inliner2.bat` が上記を実行する．
配布するのは `www/biss2.html` (旧版は `www/biss.html`)．

**JavaScript は圧縮されない**．inliner が同梱する uglify が古く ES5 しか解釈できないため，
`js2/` の ES6 記法 (`...args`，アロー関数，`let`) で圧縮に失敗し，そのまま埋め込まれる．
動作に問題はなく，ファイルが 2% ほど大きくなるだけ (旧版 `biss.html` は圧縮済みのまま)．

**注意**: inliner は標準入力が端末でないとき，引数のファイルではなく標準入力を読もうとする．
このため cmd やエクスプローラから `.bat` を実行する分には問題ないが，
スクリプトや自動化から `inliner ... > biss2.html` を実行すると**空のファイルができる**．
自動化から実行するときは Node の API を使う．

`www/` の中で次を実行する (`npm root -g` でグローバルの場所が分かる)．

```
node -e "const I=require('C:/Users/matutosi/AppData/Roaming/npm/node_modules/inliner');
const fs=require('fs');new I('biodiv2.html',(e,h)=>{if(e)throw e;fs.writeFileSync('biss2.html',h)})"
```

出力は `.bat` の `--inlinemin` とほぼ同じになる (差は加えた変更の分だけ)．

**サイズを比べるときは行末に注意**．作業ディレクトリの `biss2.html` は CRLF，
git のオブジェクトは LF なので，約 29,800 行ぶん (約 29 kB) 見かけの差が出る．
中身が減ったわけではない．比較は `git show HEAD:www/biss2.html | wc -c` と揃える．

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
  種名・地点名・階層名，動作を分岐する option の値 (`no save`，`NEW`)．
- **表の中のボタン** (`DELETE`，`UPDATE_TIME_GPS`) は**翻訳する**．
  英語のラベルは従来どおりに保ち，日本語だけ足してある (`del_row`・`update_time_gps`)．
  `getCellData()` が `value` をセルのデータとして書き出すので，
  日本語表示で保存した**設定 JSON** には「削除」が入るが，実害はない．
  - 調査データ (TSV/JSON) には入らない．`createAllInputsTable()` (`js2/tab.js`) が
    `DELETE`・`UPDATE_TIME_GPS` の2列を落としてから `plot_all_tb`・`occ_all_tb` を作るため，
    `ecan::read_biss()` は元から両列を見ていない (`man/example.json` にも無い)．
  - 設定 JSON を読み直すときは `makeTableJO()` が**列名**からボタンを組み立て直すので，
    保存された値は使われない．英語で保存したファイルもそのまま読める．

## 配信 (GitHub Pages)

`.github/workflows/pages.yml` が `main` への push で `www/` の中身をサイトのルートとして配信する．

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

## 開発ツール

リファクタリングのために入れた．**配布物 (`www/biss2.html`) には一切入らない**
(inliner は `biodiv2.html` が読む `js2/`・`css2/` だけをまとめるため)．
`node_modules` は `.gitignore` 済み．

| ファイル | 内容 |
| -------- | ---- |
| `package.json`         | `npm run lint` / `npm test` の定義と devDependencies．`engines` で Node の下限 |
| `.node-version`        | この機械で使う Node の版 (fnm・Volta 等が読む) |
| `.npmrc`               | `engine-strict=true` (版が足りなければ `npm ci` で止める) |
| `eslint.config.js`     | ESLint の設定 (flat config) |
| `test/biss.js`         | jsdom で `www/biodiv2.html` を組み立てる土台 |
| `test/smoke.test.js`   | 調査の流れと保存形式の回帰テスト (22件) |
| `test/feature.test.js` | 周辺機能のテスト (15件．集計・GPS・自動保存・控えと復元・文字サイズ・メール・植物相) |
| `requirements-dev.txt` | ブラウザテストの Python 依存 |
| `pytest.ini`           | pytest の設定 |
| `e2e/conftest.py`      | Playwright で実ブラウザに読み込ませる土台 |
| `e2e/test_biss.py`     | ブラウザでしか確認できないテスト (13件 × 2ページ + 配布物のみ1件) |
| `e2e/test_read_biss.py`| 保存した JSON を実際の R で `ecan::read_biss()` に通す (1件 × 2ページ) |
| `R/read_biss_check.R`  | 上のテストが呼ぶ R 側．読み込んだ結果を JSON で返す (手元の保存ファイルにも使える) |
| `e2e/shoot_manual.py`  | マニュアルの画像を撮り直す (テストではない．`--en` で英語版) |
| `.github/workflows/test.yml` | push・PR で lint と `npm test` を Node 4 版で走らせる |

**テストは 2 段構え**．jsdom は速いので編集のたびに，Playwright は遅いので区切りで走らせる．

| | `npm test` (jsdom) | `pytest` (Playwright) |
| --- | --- | --- |
| 速さ | 約 9 秒 | 約 8 秒 (初回のブラウザ取得は別) |
| 対象 | `biodiv2.html` + `js2/` | `biodiv2.html` **と** `biss2.html` の両方 |
| 見るもの | ロジック・データ・列名 | ファイル選択ダイアログ，実際のダウンロード，表示・非表示，配布物の自己完結 |

- `npm run lint` … `www/js2/` を検査する．旧版 (`www/js/`)・配布物 (`biss*.html`)・
  和名辞書 (`wamei*.js`) は対象外．
  BISS は**イベントハンドラを文字列で書いている** (`onclick: "delRow(this)"`) ため
  全関数がグローバルである必要がある．`eslint.config.js` は `js2/` と `biodiv2.html` を読んで
  トップレベルの宣言を集め，globals として登録する．手書きの一覧を保守せずに
  `no-undef` でタイプミスや宣言漏れを拾うための仕掛け．
- `npm test` … jsdom で実際にページを組み立て，「設定を選ぶ → 地点を追加 → 種を追加 →
  全地点の表を作る → TSV の中身を見る」を通す．
  とくに **`ecan::read_biss()` が読む列名と列順を固定**し，
  `DELETE`・`UPDATE_TIME_GPS` が保存側に出ないことを見張る．
- 直っていないバグは `{ todo: '...' }` を付けたテストとして残す．
  失敗しても `npm test` は緑のままで，直ると `# TODO` が消える．
- jsdom に無くてブラウザにはあるものは `test/biss.js` の `stub()` で補う
  (`innerText`，`HTMLCollection` の反復，`URL.createObjectURL`，geolocation，各ダイアログ)．
  ページは `http://biss.test/` から配ったことにする．`file://` だと origin が無く
  `localStorage` が使えないため．

### Node の版ちがい (複数の PC で作業するため)

PC ごとに入っている Node の版が違うので，**版に依存する書き方をしない**ことと，
**版差を機械に見張らせる**ことで対処する (版そのものを揃えるのは必須にしない)．

- **テストの起動は `node --test` (引数なし)** にする．
  位置引数の解釈が版ごとに揺れるため，`node --test test/` や
  `node --test "test/**/*.test.js"` は書かない．
  - `node --test "test/**/*.test.js"` … glob の展開が **Node 21 以降**でしか効かない．
    しかも 22 では 36件のうち 35件しか拾わない．
  - `node --test test/` … **Node 22 で位置引数がディレクトリとして扱われなくなり**，
    `Cannot find module ...\test` で落ちる (2026-08-19 に踏んだ)．
  - 引数なしなら既定の探索が `test/**/*.test.js` を拾う．**36件**．
- **下限は `package.json` の `engines` (`>=18.18`)** で宣言する．
  eslint 9 が要求する下限に合わせてある．`.npmrc` の `engine-strict=true` と組で，
  古い PC では `npm ci` が理由を出して止まる (原因不明の失敗にしない)．
- **`.node-version` は 24.19.0** (LTS "Krypton")．fnm・Volta・nvm-windows・asdf を
  入れている PC では自動で切り替わる．入れていない PC では単に無視される．
- **CI (`.github/workflows/test.yml`) が Node 18.18 / 20 / 22 / 24 で lint と `npm test` を回す**．
  どの PC で書いても，版差で壊れる書き方は push した時点で分かる．
  ブラウザテストは CI に載せていない (Playwright の取得に数分かかるため)．手元で走らせる．
- **npm は Node 同梱のものを使う**．過去にグローバルへ `npm i -g npm` した PC では，
  `%APPDATA%\npm` に入った古い npm が使われ続け，PC ごとに npm の版が変わる．
  **PATH の順番の問題ではない**．`nodejs/npm` の起動スクリプト自身が
  グローバルの prefix (`npm-prefix.js` が返す場所) にある npm を同梱版より優先する作りなので，
  PATH で `C:\Program Files\nodejs` が先にあっても古い方が動く
  (この機械では PATH は 26 番目 対 47 番目で同梱版が先なのに `npm -v` は 9.6.1 だった)．
  **`npm rm -g npm`** で消せば同梱版に戻り，Node を入れ替えるたびに npm も追随する．
  → 各 PC での実施状況は「進捗状況 > 残っている手作業」の表を参照．
- **`node_modules/` と `.venv/` は Dropbox の同期の中にある**点に注意．
  `.gitignore` は効いても Dropbox は別勘定で，とくに **`.venv` は絶対パスを埋め込むので
  PC 間・Python の版の入れ替えで壊れる** (2026-08-19 に実際に壊れていた:
  `No Python at '...\Python312\python.exe'`)．
  おかしくなったら作り直す (`requirements-dev.txt` の手順)．
  **Dropbox がファイルを掴んでいて `rm -rf .venv` が `Device or resource busy` になる**ので，
  `mv .venv .venv_old` で退かしてから作り直し，あとで消すとよい．

### ブラウザテスト (Playwright + pytest)

初回だけ準備が要る (`.venv` は `.gitignore` 済み)．

```
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements-dev.txt
.venv/Scripts/python.exe -m playwright install chromium
.venv/Scripts/python.exe -m pytest
```

- **`biodiv2.html` と `biss2.html` の両方に同じテストを流す**．
  `js2/` を直したのに `biss2.html` を再ビルドし忘れると，**配布物の側だけ失敗する**．
  再ビルド忘れの見張りを兼ねている (実際に A7 で機能することを確認済み)．
- **`file://` で開く**．野外での使い方 (1ファイルを落として offline で開く) に合わせる．
  Chromium は `file://` でも `localStorage` を使えるので，jsdom のような細工は要らない．
- 見ているのは，jsdom では届かないところ．
  ファイル選択ダイアログ (種一覧の登録)，実際のダウンロード
  (保存した TSV をファイルとして読み，ヘッダが `ecan::read_biss()` の列と一致すること)，
  表と列の非表示・再表示 (レイアウトが要る)，配布物が外部へ通信しないこと，
  言語切替後の実際の表示．
- **ロケールは `en-US` に固定する** (`conftest.py` の `browser_context_args`)．
  BISS はブラウザの言語で起動するので，日本語環境と英語環境でテストの結果が変わってしまう．
  切り替えそのものは，切替のテストの中で明示的に行う．

#### R まで通すテスト (`e2e/test_read_biss.py`)

**調査の行き先は解析なので，保存した JSON を実際の R で読ませる**．
ブラウザで保存 → `Rscript --vanilla R/read_biss_check.R <file>` →
`ecan::read_biss()` の結果を JSON で受け取り，打った通りかを Python 側で判定する．

- 見ているのは **HTML が食べたがる文字** (`&` `<` `>` `"` `\`) と日本語の種名．
  A8 が実際にこれで壊れていた (`&` が `&amp;` になり，`<i>` はタグとして消えた)．
- 地点側も1列 (`Location`) 見る．`Investigator` は `_5_layers` では `fixed` (設定で1度書く列)
  なので入力欄が無く，ここでは使えない．
- **R か `ecan` が無ければ skip する**．開発の必須条件にはしない
  (入れるには `install.packages('ecan')`．依存に vegan などが付く)．
- `--vanilla` で呼ぶ．`Rprofile.site` が tidyverse を読み込む環境があり，起動が遅くなるため．
- 種を入れなかった階層は空の行のまま残る (画面と同じ)．判定は空を除いてから行う．

## 進捗状況

### 現在の状態

2026-08-19 06:31 (JST) 更新．

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
- **表の中のボタンも翻訳した** (`DELETE`・`UPDATE_TIME_GPS`)．
  影響を調べたところ，保存する調査データには元から両列が入らないことが分かったので
  (`js2/tab.js` の `createAllInputsTable()` が除外)，翻訳を避ける理由は無かった．
  英語のラベルは変えず，日本語だけ足している (「多言語」の節を参照)．
  `man/01-howtouse_jp.md` の該当箇所と，前回のファイル選択の変更で古くなった
  「Choose file」の記述も直した (`_en.md` は英語ラベルを変えていないので修正不要)．
- **積み残しの課題を片づけた** (課題一覧の B と C)．
  - `R/code_analysis.R` を相対パス化した (作業ディレクトリはプロジェクトルート)．
    出力先を `dup_codes.txt` に変え，最後のブロックが落ちる `ecodes_funs` のタイプミスも直した．
  - マニュアルを現行版に合わせた．言語セレクタと「入力データを保存」(TSV 2ファイル) の節を
    日英に追加し，種名の区切りが「,」「，」「、」であることを明記．
    日本語版に残っていた英語のボタン名は，実際に表示される日本語ラベルに置き換えた．
  - **`www/tools/` を削除した**．試作・検証用の断片 54ファイル (jquery・prototype.js などの
    第三者ライブラリ，`old/` 一式を含む) で，配布物にも配信対象にも入っていなかった．
    必要になったら git の履歴から取り出す (`R/code_analysis.R` のコメントが参照している
    `unused.js` も同様)．
  - `biodiv2.html` の TODO を解消した．`var` を `const`/`let` に整理し
    (`tabs`・`pages` は他ファイルから参照する live collection なので `const`，
    `column_no`・`column_no_prev`・`dir` は `sortable.js` が書き換えるので `let`)，
    `js2/` の全 189 関数に1行の説明コメントを入れた．
  - `2310veg/missfont.log` を追跡から外し，`.gitignore` に LaTeX の生成物を足した．
  - 以上を7つのコミットに分け，`develop` から `main` へマージして `origin` へ push した
    (公開済み)．
- **ブラウザでの動作確認が溜まっている**．次の4つは実機で未確認のまま公開している．
  問題があれば `main` を戻す．
  - 多言語化 (言語セレクタ・切替後のラベル・保存ファイルの列名)
  - ファイル選択のボタン (`Choose file` / 「ファイルを選ぶ」でダイアログが開くこと)
  - 表の中のボタン (「削除」「日時・GPS」と，行削除・日時 GPS 更新の動作)
  - `biodiv2.html` の `const`/`let` 化 (とくに列見出しをクリックしたときの並べ替え．
    `sortable.js` が `column_no`・`dir` を書き換えるため)
- **リファクタリングに着手した**．方針は「案1 安全第一」(振る舞いを変えず，
  実バグの修正・暗黙のグローバル撲滅・`var`→`let`/`const`・死にコード削除・重複統合まで．
  ES モジュール化などの構造変更はしない)．手順は
  「未確認4件の確認 → ツール導入 → 実バグ(A) → 言語仕様(B) → 整理(C) → 再ビルド → マージ」．
- **開発ツールを導入した** (「開発ツール」の節を参照)．`package.json`・`eslint.config.js`・
  `test/` を新規作成した．配布物 `www/biss2.html` は inliner が `js2/` から作るので，
  これらは**配布物に一切入らない**．
  - ESLint の初回結果は**エラー 102 件・警告 530 件** (警告はほぼ `no-var`・`prefer-const`)．
  - jsdom のスモークテストは 14 件中 13 件成功，1 件は未修正のバグ (A6) を記録する `todo` (約 9 秒)．
  - **テストが新しい実バグ (A6) を見つけた**．地点名にハイフンを含めると種一覧が壊れる．
- **コードを点検して問題を4つに分類した**．
  - **A. 実バグ (6件)** (発見時の記録．いずれも修正済み):
    (A1) `table.js:133` の `createSpeciesListTable()` が未定義で，`makeTableJO()` に配列を渡すと
    ReferenceError． (A2) `gps.js:40` が参照する `poslog` 要素が `biodiv2.html` に無く，
    GPS エラー時に TypeError． (A3) `table_change_view.js:33` の `wideTable()` が
    `createFitTable()` を id 無しで呼ぶため，「横長に」で `input_occ_*_fit` の id が消える．
    (A4) `sortable.js` の `column_no`・`column_no_prev`・`dir` が全表で共有され，
    表をまたぐと並べ替えの方向が混線する． (A5) `auto_save.js:45` の `delete json;` は無意味
    (strict mode では SyntaxError)．
    (A6) **地点名にハイフンを含めると種一覧モジュールが壊れる**．
    `tab.js` の `updateSpeciesList()` と `ul_module.js` の各所が `id.split('-')[1]` で
    名前空間を取り出しており，`sp_list_select-sito-A` が `sito` に切られる．
    `addInputTab()` は「`_` は使えないので `-` を使ってください」と案内するので，
    利用者は必ず踏む (`sito-A` で `Cannot read properties of null (reading 'checked')`)．
    スモークテストが見つけた．
  - **B. 言語仕様レベル**: `var` 525 に対し `let`/`const` 129．
    `f(a, id = 'x')` という名前付き引数のエミュレーションが**グローバル変数を作ってから**値を渡している
    (`strings`・`file_name`・`selected_no`・`id`・`value`・`first_option`・`n`・`list_with_index`)．
    宣言なしの代入によるグローバルも多数 (`Ri`・`i`・`sum`・`new_array`・`selected_opt`・
    `layers`・`species`・`identified`・`timerId`・`span`)．
  - **C. 設計上の脆さ**: DOM を `parentNode.nextSibling` の4連で辿る，配列をハッシュとして使う，
    `table.rows[2]` (最初のデータ行) というマジックインデックスが6箇所，列名リテラルの散在，
    `readFile()` が2箇所に重複，`getTableData()` と `getTableDataPlus()` がほぼ同一，
    死にコード (`createNewOccButton`・`createSelectLayer`・`saveHTML`)．
  - **D. 体制**: テストと lint が無かった → 導入済み．
- **案2 (D1〜D4) を `main` へマージして公開した**．
  D4 で見つけた実バグ2件 (設定の読込が設定表を2つに増やす，
  「表を非表示」が非表示列の一覧を残す) が配布物に入った．
- **残りの課題を洗い直した** (課題一覧を A〜F に整理し直した)．
  記録上の課題がほぼ消化済みになったので，コードを実測して並べ替えた．
  - **性能を測ったら，これが最大の実害だと分かった**．
    `updateAllInputsTables()` はタブを切り替えるたびに走り，
    8地点432行で 709 ms かかる (jsdom)．内訳は課題一覧 B を参照．
    `getMultiTableInputs()` が (表 × 列) ごとに `getColData()` を呼び直しているのが主因で，
    振る舞いを変えずに直せる．
  - **集計 (`sumWithGroup`) は正しく動くことを確認した**が，テストが無い．
    ほかに GPS・メール・自動保存・文字サイズ・フルスクリーン・植物相の入替も未テスト．
  - `example.js` が位置指定のセレクタ (`tr:nth-child(7) > td:nth-child(4)`) で
    設定行を消している．`data.js` の行が増減すると別の項目を消す．
- **案2 (中規模) に着手した．D1〜D4 は完了 (未コミット)**．
  実バグが 2 件出てきた．どちらも「案1 では触らない」と決めていた場所に潜んでいたもの．
  - **D1 JSON の文字列連結をやめた**．`addSpecies()` と `addSettingPart()` が
    値を文字列で連結して JSON を組み立ててから `JSON.parse` していた．
    **種名に「"」や「\」が入ると SyntaxError になり，そのとき追加した種が全部消えていた**
    (1件だけでなく，その回のまとめて全部)．オブジェクトを直接組み立てる形にした．
    `getSelectOptionsAsJSON()` は実態に合わせて `getSelectOptionsValues()` に改名
    (文字列ではなくオブジェクトを返す)．
  - **D2 列名を `www/js2/columns.js` にまとめた** (新規ファイル)．
    `COL` に特別扱いする列名を，`BUTTON_COLS` にボタン列を，`AUTO_COLS` に自動で埋める列を置いた．
    とくに **`DATE`/`LOC_LAT`/`LOC_LON`/`LOC_ACC` → 値を取る関数，という対応表が3箇所**
    (`createTd`・`updateTimeGPS`・`addRow`) に書かれていたので `autoValue()` 1つにした．
    `autoValue()` を関数にしたのは，`gps.js`・`utils.js` の読み込み順に依存しないため．
    ついでに `updateTimeGPS()` に，設定が LOC_* を持たないときに落ちない guard を入れた．
  - **D3 表の行構造に名前を付けた**．「0行目: 列名 / 1行目: 非表示ボタン / 2行目以降: データ」が
    数値のまま散らばっていたので，`ROW_HEADER`・`ROW_HIDE`・`ROW_FIRST_DATA` と
    `headerRow()`・`firstDataRow()`・`nDataRow()` にまとめた (`table.js`)．
  - **D4 DOM の兄弟辿りを id ベースにした**．13箇所が1箇所になった
    (残る1つは `clickFileInput()` で，ボタンと隠し入力を同じ関数で並べて作っているペア)．
    `moduleNS()`・`moduleSpan()`・`moduleTable()` を足し，
    `tableModule()` が作る `span#<ns>_up` / `table#<ns>_tb` / `span#<ns>_dn` を名前で引くようにした．
    設定タブの2つのモジュールは，id を持つ入れ物 (`setting_plot_holder`・`setting_occ_holder`) に
    入れる形にした．初回は差し替える相手がまだ無いため．
- **D4 で実バグを2件見つけて直した**．どちらも兄弟を辿っていたのが原因．
  - **設定の読込が壊れていた**．`replaceTable()` が `obj.parentNode.parentNode` で
    モジュールを探しており，**`span#<ns>_up` の方を差し替えていた**ため，
    設定表が2つに増えていた．多言語化のときに `createFileInput()` が file 入力を
    span で包み，階層が1つ深くなったことによる後退．
    **ファイルダイアログが要るので，これまで確認できていなかった箇所**．
    Playwright で実際にファイルを読ませるテストを足して再現・修正した．
  - **「表を非表示」が，非表示にした列の一覧を残していた**．
    `obj.nextElementSibling.nextElementSibling` が，「幅を狭く」ボタンのある
    モジュールでは `<br>` を指していた．
- **回帰テストを足した** (jsdom 20件・ブラウザ 19件，すべて成功)．
  引用符を含む種名，設定ファイルの読み込み，表と列の非表示の連動．
- **C1・C2 を片づけた．ESLint の指摘が 0 件になった** (エラーも警告も)．
  `js2/` は 3,049 行から 2,865 行に減った (和名辞書を除く)．
  - **C1 死にコード**．参照が無い関数を消したところ**連鎖した**ので，
    「消す → 走査し直す」を繰り返して 0 になるまで続けた．
    `createAddCompButton` (「組成から追加」ボタン．どこにも置かれていなかった) を消すと
    `addComp` が浮き，それを消すと `addSpeciesList` が浮き，さらに
    `getGrandChildrenValues` が浮いた．
    ほかに `createNewOccButton` (未定義の `makeNewOccTableModule` を呼ぶ)，
    `createSelectLayer` (`createSelectOptions` に置き換わっていた)，
    `NS` (shiny 風の名前空間ヘルパ)，`removeSLinLSAll`，
    `saveHTML` (`biodiv2.html` の呼び出しはコメントの中だった．HTML 側も消した)．
    未使用になったメッセージ 3件 (`add_from_comp`・`layer_label`・`new_occ_table`) も消した．
    コメントアウト済みの塊 (`utils.js` の `getDataType`，`table.js` 末尾の作業メモ) と，
    未使用の局所変数 4件も消した．
    **必要になれば git の履歴から取り出せる** (走査スクリプトは使い捨て)．
  - **`biodiv2.html` の `show_select_layer : true` を `show_select_options : true` に直した**．
    `createSpecieUlModule()` にそんな引数は無く，指定は無視されていた．
    それでも階層のプルダウンが見えていたのは，起動直後の `updatePlotLayer({})` が
    `display:none` の付いていない要素に差し替えるため．見た目は変わらない．
  - **C2 重複**．
    `readFile()` が `table_module.js` と `ul_module.js` に同じ実装で2つあったので
    `utils.js` に1つ置いた．
    `getTableData()` と `getTableDataPlus()` は，違いが
    「`biss_inputs` を配列で作って後から object に変換するか，最初から object か」と
    「list でない列の `biss_selects` が `''` か `null` か」だけだったので1つにした．
    `null` は `data.js` と保存済みの設定ファイルが元から使っている形で，
    `''` の側の呼び出し元は `biss_selects` を見ていない．
    `larger()`/`smaller()` は倍率を引数に取る `changeFontSize()` にまとめた．
    `autoSave()` が書き直していた Blob とリンクの手順は `downloadStrings()` に寄せた
    (MIME を引数にして，従来の `text/json` を保つ)．
    同じ値を n 個積むループは `Array(n).fill()` にした．
  - **キーが列名なら配列ではなく object にした** (6箇所)．
    配列に文字列のキーを入れる書き方は動くが，`JSON.stringify()` が `[]` を書くため
    `getTableDataPlus()` は `Object.assign({}, inputs)` で辻褄を合わせていた．
    object にしたのでその変換も要らなくなった．
  - **保存形式が変わっていないことをテストで固定した**．
    設定 JSON が `JSON.stringify` → `JSON.parse` → `makeTableJO()` を往復すること，
    list でない列の `biss_selects` が `null` であること，
    自動保存の JSON が列名をキーに持つこと (`npm test` は 17 → 19件)．
- **B1〜B3 を片づけた．ESLint のエラーが 102 件から 0 になった**．
  - **B1 名前付き引数のエミュレーション (6箇所)**．`f(a, id = 'x')` は「`id` という
    グローバル変数を作ってから値を渡す」動作なので，位置引数の呼び出しに直した．
    消えたグローバルは `list_with_index`・`selected_no`・`id`・`strings`・`file_name`・
    `value`・`first_option`．
  - **B2 暗黙のグローバル (8種)**．宣言なしの代入を宣言した．
    `timerId` は `auto_save.js` の先頭で `let timerId;` として明示
    (`changeAutoSaveSttting()` が読み `setAutoSave()` が書く)．
    ほかは `layers`・`species`・`identified`・`span`・`new_array`・`i`・`selected_opt`・
    `sum`・`Ri` で，いずれも関数内のローカルにした．
  - **B3 `var` → `let`/`const`**．**`var` は 525 箇所から 0 になった** (`let`/`const` は 129 → 568)．
    - 先に `no-redeclare` 49件を手で直した．同じ名前を同じスコープで何度も `var` する書き方で，
      多くは「分岐の両方で宣言」「`var x = f(x)` の連鎖」「switch の各 case で `var td`」．
      `let` にすると壊れるので，宣言を1つに寄せてから残りを代入に変えた．
      `createTd()` の `td` は **case "auto" だけ宣言が無く**，ほかの `var td` の巻き上げで
      動いていた．関数の先頭で `let td;` と宣言した．
    - そのうえで `eslint --fix` をかけた (466 → 14 警告)．
    - ESLint が触らずに残したトップレベルの `var` 8件は手で変換した．
      `var` はグローバルなら `window` の属性になるが `let` はならないため，
      自動修正が避けている．`window.msgs` のような参照が無いことを確かめてから変えた
      (`lang.js` の `LANGUAGES`・`LANGUAGE_KEY`・`currentLanguage`・`msgs`，
      `gps.js` の `watchId`・`positionOptions`・`locations`)．
  - **変数のスコープが正しいことは `no-undef` が保証する**．0 件ということは，
    ブロックの外から中の変数を参照している箇所が無いということ．
    `var` → `let` でいちばん危ないのがこれなので，機械で確かめられる意味は大きい．
  - 残る警告は5件で，すべて未使用の変数 (C1 の対象)．
    `full_screen.js` の `button`，`tab.js` の `pages`，`wamei_search.js` の `parent`，
    `lang.js` の `catch(e)` 2件．
- **`www/biss2.html` を再ビルドした** (779,382 バイト)．
- **実バグ A1〜A6 を直した**．リファクタリング (B・C) の前に，まず動作の誤りを片づけた．
  - **A1** `table.js` の `makeTableJO()` から，未定義の `createSpeciesListTable()` を呼ぶ分岐を消した．
    この関数は `3e6c690` (2022-11) で種一覧が表から `<ul>` に変わったときに削除され，
    呼び出しだけが残っていた．`makeTableJO()` に配列が渡る経路は無いので，分岐ごと削除．
  - **A2** `gps.js` の `errorCallback()` が，存在しない `poslog` 要素に書こうとして
    TypeError になっていた (元にした書籍のサンプルに合わせた名残)．`console.error` に変えた．
    位置が取れなくても調査は続けられるべきなので，止めない．
  - **A3** 「幅を狭く」と「横長に」を往復すると，ボタンの id が失われていた
    (`createFitTable()` を id 無しで呼んでいた)．両方のボタンが id を持ち回るようにした．
    `addInputTab()` が id でこのボタンを取るので，失うと2回目以降が壊れる．
  - **A4** 並べ替えの方向が `column_no`・`column_no_prev`・`dir` の3グローバルにあり，
    **全表で共有**されていた．表 A を昇順にしてから表 B の同じ列番号を押すと降順から始まる．
    `setSortable()` のクロージャに入れて**表ごとの状態**にした．
    未使用になった3つのグローバルは `biodiv2.html` から削除した．
  - **A5** `auto_save.js` の `delete json;` を消した (変数への delete で無意味)．
  - **A6** 地点名のハイフン．`id.split('-')[1]` を使う10箇所を，
    **最初の `-` より後ろを全部取る** `getSlNs()` に置き換えた
    (`ul_module.js` 9箇所・`tab.js` 1箇所)．
    あわせて `getSelectOptionsAsJSON()` のセレクタを引用符で囲み `-` で固定した．
    囲まないと ident にならない地点名で壊れ，固定しないと
    `all` が `small` にも一致してしまう．列名の取り出しも，
    最初の `-` で切るのをやめ，既知の接頭辞と名前空間を削る形にした
    (列名にも `-` を使えるため)．
- **回帰テストを足した** (jsdom 17件・Playwright 8件×2ページ=17件，すべて成功)．
  A6 は jsdom と Playwright の両方に置いた．
  Playwright に置いたのは，**配布物の再ビルド忘れを見張るのは Playwright 側だけ**のため
  (ソースと配布物の両方に流すのは Playwright)．
  実際，A6 を直した直後は `biodiv2.html` が成功・`biss2.html` が失敗になり，
  再ビルドの必要がその場で分かった．
- **`www/biss2.html` を再ビルドした** (778,352 バイト)．A1〜A6 が配布物に入った．
- **ブラウザテスト (Playwright + pytest) を入れた** (「開発ツール」の節を参照)．
  jsdom で届かない範囲 — ファイル選択ダイアログ，実際のダウンロード，表示・非表示，
  配布物の自己完結 — を実ブラウザで見る．8件のテストを
  `biodiv2.html` と `biss2.html` の**両方**に流すので，計16件．約8秒．
  - **配布物の再ビルド忘れを見張れることを確かめた**．
    `biss2.html` を再ビルド前に戻すと，ソース側は成功したまま**配布物側だけが失敗**し，
    「the species disappeared on coming back」と出た．
- **`www/biss2.html` を再ビルドした** (777,934 バイト，git 上は前回比 +708 バイト)．
  ラベル変更と A7 修正が配布物に入った．外部参照が残っていないことは
  ブラウザテストが毎回確かめる．
- **ブラウザでの確認で見つかった不具合 (A7) を直した**．**修正済み**．
  ツールで種一覧を選んだあと，別のタブに移って戻ると一覧の表示が消えていた．
  `tab.js` の `updateSpeciesList()` が，種一覧のプルダウンを探すセレクタに
  **表示用 (`sp_list_select-`) と削除用 (`sp_list_delete_name-`) の両方**を入れており，
  同じ `sp_list_sp_list-<ns>` を2回作り直していた．2回目は削除用プルダウンの値
  (常に空) から作るため，1回目に並べた種が消える．
  削除用プルダウンがあるのはツール (`ns = 'all'`) だけなので，ツールでしか起きなかった．
  選択肢の貼り直しは両方に行い，**表示する一覧を決めるのは表示用だけ**に変えた．
  貼り直しで要素が入れ替わるため，値は貼り直した後の要素から読む．
  回帰テストを2件足した (表示が残ること，種一覧の削除が従来どおり動くこと)．
- **ブラウザでの確認は，これ以外は問題なしとの報告を得た** (課題一覧 A の未確認4件)．
- **種一覧のチェックボックスのラベルを変えた** (`include_comp`)．
  「組成を含める」→「**出現種を含める**」，"Include composition" → "**Observed species**"．
  `man/01-howtouse_jp.md`・`_en.md` の該当箇所 (各2件) も合わせた．
  キー名 `include_comp` は変えていない．表示が変わっただけで，
  組成表から種名を集める仕組みそのものは同じため．
- **課題 B (性能) を片づけた**．`updateAllInputsTables()` が **2.6 倍速くなった**．
  同じ条件 (jsdom) で測り直した値．

  | 地点 | occ 行数 | 前 | 後 |
  | ---- | -------- | -- | -- |
  | 4 | 116 | 67 ms | 33 ms |
  | 8 | 232 | 171 ms | 70 ms |
  | 8 | 432 | 337 ms | 129 ms |

  (以前の記録 (346/598/709 ms) は別のマシンで測ったもの．前後の比が意味を持つ)
  - **表は列ごとではなく1回の走査で読む**．`getColsData()` を `utils.js` に足し，
    `getColData()` はその1列版になった．`getMultiTableInputs()` が
    (表 × 列) ごとに `getColNames()` と `querySelectorAll()` をやり直していたのを，
    表ごとに1回にした (27 ms → 10 ms)．`getTableData()` も同じ形にした．
  - **行を作るループから，行ごとに変わらないものを追い出した** (`addTableData`)．
    列数 `nCol(table)` と，列ごとの選択肢 `uniq(selects[Cj])` を先に1回だけ求める．
    選択肢を使い回せるように，`createTd()` の list が `select.push('')` で
    引数を壊すのをやめて `concat` にした．
  - **いちばん効いたのは，セルの中身を innerHTML ではなく textContent で書くこと**
    (194 ms → 55 ms)．HTML の解析器を通さなくなる．
    これは同時に**実バグ (A8) の修正**でもある (下記)．
- **実バグ A8 を直した．表示用の表を通すと `&` が `&amp;` になっていた**．
  種名に `Rosa A & B` と入れると，「全地点」の表と**保存する TSV では `Rosa A &amp; B`**
  になっていた (`ecan::read_biss()` が読むのはこの TSV)．
  `<i>` のような文字列は，文字ではなく**タグとして解釈**されて消えていた．
  セルは innerHTML で書き，`getCellData()` が innerHTML で読み戻していたため．
  データはマークアップではないので，書きも読みも textContent に変えた
  (`createTd`・`addThTr`・`createSelectOpt`・`addRowWithValues`・`addRow`・
  `updateTimeGPS`・`getCellData`・`table2array`・`hash2table`)．
  回帰テストを1件足した (入力の表・全地点の表・保存する TSV の3か所で，打った通りであること)．
- **課題 C (テストの無い機能) を片づけた**．`test/feature.test.js` (jsdom 10件) と
  ブラウザテスト3件を新しく書いた．**jsdom 32件・ブラウザ 25件**，すべて成功．
  - jsdom: 集計 (`sumWithGroup`．Layer ごとに Cover を足して T1=50，2回押しても増えない)，
    GPS (最後の位置を返す・停止で watch を止める・位置が取れなくても止まらない・
    「日時 GPS」ボタンが行を埋める)，自動保存のタイマー (間隔の切り替え)，
    文字サイズ (1.2倍で往復)，メール (宛先の検査と本文)，植物相の入替．
  - ブラウザ: 文字サイズが**実際に描画に効く**こと，フルスクリーンの往復，
    植物相の入替 (3つ目のファイルダイアログ．これで3か所とも見ている)．
- **テストを書いたら実バグが2件出てきた．どちらも直した**．
  - **A9 自動保存で「no save」を選ぶと，止まるどころか全力で保存し続ける経路があった**．
    `changeAutoSaveSttting()` が，タイマーがまだ動いていないときは値を見ずに
    `setAutoSave(Number('no save'))` を呼ぶ．`Number('no save')` は `NaN`，
    `setInterval(fn, NaN)` は `setInterval(fn, 0)` なので，ブラウザが許すかぎりの速さで
    JSON をダウンロードし続ける．値の判定を先に行う形にした．
  - **A10 Windows で書いた種名の一覧を「植物相の入替」で読むと，検索が何も見つけなくなる**．
    `replaceFlora()` が `text.split('\n')` だけで切っており，各行に `\r` が残る．
    検索は `makeLookAheadReg()` が作る `^(?=.*名前).*$` で照合するが，
    **JavaScript の `.` も `$` も `\r` を越えない**ので一致しない．
    `registerSL()` (種一覧の登録) は元から `\r` を落としていたので，入替だけが漏れていた．
    テストのファイルも CRLF にして，この経路を固定した．
- **課題 D (コードの脆さ) を片づけた**．「何番目か」で数えるのをやめ，名前で引くようにした．
  - **`example.js` が設定行を位置で消していた**のを直した．
    `#_5_layers_occ_tb > tr:nth-child(7) > td:nth-child(4)` を2回押す書き方で，
    `data.js` の項目が1つ増減すると**別の項目が消える**．
    `deleteRowByValue(table, COL.ITEM, 'Abundance')` のように**名前で消す**形にした
    (`table.js` に追加)．回帰テストも，例が Abundance と Rank だけを落とすことを見る．
  - **設定タブの表を `getElementsByTagName('table')[0]` / `[1]` で取っていた**のをやめた．
    `settingTable('plot')` / `settingTable('occ')` が，入れ物 (`setting_*_holder`) から引く．
    設定ファイルを読むと表の id が変わる (`mysetting_tb`) ので，名前でも順番でもなく
    入れ物で引くのが正しい．`addSettingPart()` も同じ関数に寄せた．
    ブラウザテストに「設定を読み込んだ後に地点を足す」経路を足した．
  - `COL` に設定表の列 (`item`・`type`・`value`) を足した．
  - `addInputTab()` の `// in progress` を，引数の説明に書き換えた．
- **B・C・D をまとめて `main` へマージし，`origin` へ push した** (公開済み)．
- **「タブを閉じたときの自動保存」を作った** (`www/js2/backup.js` を新規作成)．
  `inhibit_close.js` (離脱の確認ダイアログ) の代わりに，**確認を出さずに控えを残す**方式にした．
  - **ダウンロードでは間に合わない**．ページが閉じられる最中のダウンロードは
    ブラウザが止めるため，`autoSave()` (n分ごとのファイル出力) では閉じた瞬間を守れない．
    そのときでも書けるのは**自分の localStorage** なので，そこへ控えを書く．
  - **書くきっかけは `visibilitychange` (hidden) と `pagehide`**．
    スマートフォンは隠れたタブを `beforeunload` も無しに落とすことがあるため，
    `visibilitychange` が要になる．
  - 控えは**地点ごとの2つの表 (`getTableData()`)** で，`buildPlotTab()` がそれを組み立て直す．
    `addInputTab()` から**タブを作る部分を `buildPlotTab()` に切り出した**ので，
    「設定から作る」も「控えから戻す」も同じ道を通る．
  - 起動時に控えがあれば，画面の上に**「… の入力 (n 地点) が残っています．[復元] [破棄]」**を出す
    (`showRestoreNotice()`)．復元すると消える．破棄は確認してから消す．
  - **入力が1地点も無いときは上書きしない**．見るだけで開いて閉じても，前日の控えが消えない．
  - 同名の地点がすでにあるときは，その地点は復元しない (画面の方が新しい)．
  - **`inhibit_close.js` は削除した** (`biodiv2.html` のコメントアウトも)．
  - **ついでに実バグを1件直した．`number` 列は値を復元できなかった**
    (`createTd()` の `case "number"` が `value: ""` を固定で入れていた)．
    被度のような数値列が，表を組み立て直すたびに空になる．`value: table_data` にした．
    通常の操作では「設定から作る＝空」なので表に出なかったが，控えからの復元では出る．
  - マニュアル (`_jp.md`・`_en.md`) に「入力の復元」の節を足した．
  - テストは jsdom 3件 (控えを書く・戻す・入力が無ければ上書きしない) と
    ブラウザ1件 (**実際にページを離れて開き直し，復元する**)．
    **jsdom 35件・ブラウザ 27件**，すべて成功．
  - **`main` へマージして push した** (公開済み)．
- **実機での確認が2つ溜まっている** (課題一覧 E に追記)．
  復元の見え方と，**スマートフォンで別のアプリに切り替えて戻したときに控えが残るか**
  (iOS Safari は `visibilitychange` の扱いが違うことがある)．
- **控えに設定も入れた．入力の手が止まったときにも控えを書くようにした**．
  - **復元しても設定タブが空のままだった**ので，復元直後に「＋新規地点」を押すと
    `PLOT` 列しかない表ができていた．控えに設定表 (plot・occ) を入れ，
    復元時に戻すようにした．`changeSettings()` から `showSettingModule()` を切り出し，
    基本設定の切り替えも控えからの復元も同じ道を通る．
  - 控えを書くきっかけに **`input`・`change` (3秒の静止後)** を足した．
    「画面を離れたとき」だけでは，ブラウザが突然落ちたときに守れないため．
- **マニュアルの画像を撮り直す仕組みを作った** (`e2e/shoot_manual.py`)．
  Playwright でアプリを操作し，マニュアルの各場面を撮る．
  - **日本語版は `man/img_jp/`，英語版は `man/img/`** に分けた
    (両方のマニュアルが同じ画像を参照していたため，日本語で撮ると英語版が壊れる)．
    `01-howtouse_jp.md` の参照を `img_jp/` に張り替えた．
  - **40枚を両言語で撮り直した**．英語版の画像も，言語セレクタが無い古いものだったので新しくなった．
  - **撮れないものが4枚ある**．`settings_autosave02`・`03`・`04` (ダウンロードの通知・
    複数ダウンロードの許可) と `add_plot01` (地点名の入力欄) は**ブラウザが描く部分**で，
    ページのスクリーンショットには写らない．日本語版もこの4枚だけ `img/` を指したままで，
    その旨をマニュアルに注記した．**開いたプルダウンも同じ理由で撮れない**ので，
    閉じた状態 (選んだ値が見える) で撮っている．
  - 詰まった点2つ: モジュールは inline の `<span>` なので `bounding_box()` が
    見た目と違う矩形を返す (両端の要素を名前で指定して回避)．
    `bounding_box()` はビューポート基準，`full_page` の切り抜きは文書基準なので，
    クリックでスクロールした後は**ずれる** (測る前に先頭へ戻す)．
- **`.venv` を Python 3.12 で作り直した**．作成に使った 3.14 が環境から消えており，
  `pytest` が起動しなくなっていた (`.venv` は `.gitignore` 対象なのでリポジトリには影響なし)．
  `playwright install chromium` もやり直した．
- **撮り直した画像 88枚 (日本語 44・英語 44) を目視で確認し，見つけた不具合を直した**．
  課題一覧 E の「撮り直した画像の見え方」を消化 (結果は下の **G**)．
  画像は日英とも撮り直し，`tools_list11` が増えて **90枚** になった．
  - **検索が効いていなかった (6枚)**．`page.fill()` は `input` しか出さないが，
    検索ボックスは `onkeyup` (`create_input.js` → `searchTableText()`) なので，
    文字だけ入って表が絞られていなかった．実際のキー入力を送る `Shooter.search()` を足した．
    これで `example_search05` (PLOT を非表示にして地点名で検索) が**0行**になり，
    節の主旨どおりの絵になった．
  - **前後の対が別のデータだった**．シーンごとに「例を表示」をやり直すため，
    「押す前 / 押した後」が別の調査になっていた．
    **1つのシーンが複数の画像を撮れるようにした** (`@scene(chapter, *names)` と `s.frame()`)．
    hide_table・width・sort・search04/05・addrows・species_list01〜03・05/06 を対にまとめた．
  - **切れの原因が分かった**．BISS のモジュールは `<span>` (inline) なので，
    `bounding_box()` が中の block の下端を返さない．子孫の矩形も見る `Shooter.edges()` を作り，
    `shot_through()`・`shot_between()` の下端をこれにした．
    これで下端が行の途中で切れる画像が無くなり，`extra=` の下駄も要らなくなった．
  - **`img_jp/example_species_list06.png` の SameAs が切れていた**のを，
    表の右端まで入る幅を測る `width_through()` で直した (日本語だけ 1464px になる)．
  - `settings_base02` は**削除した後**の表にした (図の説明が「削除する」なので)．
  - `example_species_list03` に，テキストボックスに入れた「ススキ,チガヤ」も入るようにした
    (02 で入力した2種が 03 に出てこなかった)．
  - `tools_list12` を単語1つの検索 (「イヌガヤ」9件) にし，
    AND 検索の例を **`tools_list11` (「アイ ガヤ」4件) として新設**した．
    以前は AND 検索の絵が単語1つの説明のところに置かれていた．
  - **マニュアルの誤りも直した** (日英)．
    種名リストの登録は「登録」の右，大規模リストは「植物相の入替」の右
    (「「種を追加」の右」と書いてあった)．
    地点名の入力欄は**問いかけだけアプリの文字列** (`lang.js` の `prompt_plot`) なので，
    「ブラウザが描くので英語のまま」という注記を実態に合わせた．
  - `npm test` が動かなくなっていたので直した．`node --test "test/**/*.test.js"` の
    glob は **Node 21 以降**でしか展開されず，環境の Node が 18 に下がっていた．
    どちらでも動く `node --test test/` にした (36件・約8秒)．
  - `pytest` 27件も緑．
- **保存した JSON を実際の R で読ませるテストを足した** (`e2e/test_read_biss.py` と
  `R/read_biss_check.R`)．課題一覧 E から「`ecan::read_biss()` に通すこと」が消えた
  (人の目でなく機械で見られる)．
  ブラウザで `autoSave()` を押して落ちた JSON を，`Rscript --vanilla` 経由で
  `ecan::read_biss()` に読ませ，`Rosa A & B`・`Carex <sp>`・`Quercus "ao"`・
  `Pinus \ sp`・`ブナ` と地点側の `Sasaki & Co. <field>` が
  **打った通りに R まで届く**ことを見る (`join` は TRUE / FALSE の両方)．
  A8 (`&` が `&amp;` になる) が再発したら，ここで止まる．
  R か `ecan` が無い環境では skip する．**`pytest` は 27件から 29件**になった
  (この機械には `ecan` を CRAN から入れた)．
- **`develop` を `main` へマージして push した** (`bde32f9`)．
  マニュアルの画像・本文の修正，`npm test` の修正，R まで通すテストが公開された．
  GitHub Pages のデプロイも成功 (22秒)．
  - **`main` は fast-forward できない**．毎回マージコミットを積んできたので
    `main` にしか無いコミットがあり，`git fetch . develop:main` は non-fast-forward で断られる．
    `git checkout main` → `git merge --no-ff develop` → push → `git checkout develop` で行う．
- **TSV 側は R まで通していない** (やるかどうかは未定)．
  `ecan::read_biss()` は JSON を読む関数なので，上のテストが見ているのは JSON だけ．
  TSV (「入力データを保存」の2ファイル) は `e2e/test_biss.py` が
  ヘッダと種名1つの有無しか見ておらず，`&` や `<` を含む種名が TSV 経由でも
  壊れないことは未検証 (タブ区切りなので壊れる見込みは薄い)．
  やるなら `readr::read_tsv()` に通す形になる．
- **`.claude/settings.json` を作った** (`.gitignore` 済み，`settings.local.json` も)．
  `"worktree": {"bgIsolation": "none"}` の1項目だけ．
  バックグラウンドのセッションは既定でワークツリーへ隔離され，
  このチェックアウトを直接編集できない (記録の更新まで弾かれる)ため外した．
  **並行セッションが同じチェックアウトを触ると取り合いになる**点は承知のうえ．
- **ここで手を止め，実機での確認待ちにした** (課題一覧 E)．
  コード側で着手すべき残件は無い．lint 0件・jsdom 36件・browser 29件が緑で，
  `develop` と `main` は origin と一致している．
- **状態を確認した**．`develop` は `origin/develop` と一致し，中身はすべて `main` に入っている
  (`main` にしか無いのはマージコミット 21 個だけ)．`www/` に未コミットの変更は無く，
  公開物は最新のまま．残る待ちは課題一覧 E の実機確認だけ．

- **複数の PC で Node の版が違う問題に対処した** (「開発ツール > Node の版ちがい」の節を参照)．
  この機械の Node が 18 から **22.23.1** に上がっており，前回直したはずの `npm test` が
  また落ちていた (`node --test test/` の位置引数が 22 でディレクトリとして扱われなくなり
  `Cannot find module ...\test`)．**版を上げ下げしても直らない書き方の問題**だったので，
  版に依存しない形に直したうえで，版差そのものを機械に見張らせることにした．
  - `package.json` の `test` を **`node --test` (引数なし)** にした．36件すべて緑．
  - `package.json` に **`engines: {"node": ">=18.18"}`** を足し，`.npmrc` に
    **`engine-strict=true`** を置いた．古い PC では `npm ci` が理由を出して止まる．
    下限は devDependency の eslint 9 の要求に合わせた．
  - **`.node-version` (24.19.0)** を置いた．切替ツールを入れた PC だけが読む．
    入れていない PC では無視されるので，全 PC に導入を強制しない．
  - **`.github/workflows/test.yml` を新設**し，push (`main`・`develop`) と PR で
    **Node 18.18 / 20 / 22 / 24** の 4 版で lint と `npm test` を回すようにした．
    これまで CI は Pages への配信 (`pages.yml`) だけで，**テストは誰も走らせていなかった**．
    ブラウザテストは Playwright の取得に数分かかるので CI には載せていない．
- **npm がグローバル導入の 9.6.1 に隠されている**のを見つけた
  (`%APPDATA%\npm` の 9.6.1 が Node 22 同梱の 10.9.8 を PATH で先取りしている)．
  `npm rm -g npm` で消せば同梱版に戻るが，**Claude Code のシェルからは権限で弾かれた**ので
  **ユーザの手で実行してもらう** (各 PC で 1 回ずつ)．
- **`node_modules/` と `.venv/` が Dropbox の同期の中にある**ことに気づき，
  **`.venv` は実際に壊れていた**．Python 3.12 を指したままで
  (`No Python at '...\Python312\python.exe'`)，この機械の Python は 3.14.7 になっていた．
  **3.14 で作り直した** (pytest 9.1.1・Playwright の chromium を入れ直し，**29件すべて緑**)．
  Dropbox の除外設定を入れるかは未定．
- **CI の actions が古い major だった**．最初の CI が全ジョブで
  「Node 20 は非推奨」と警告したので，`test.yml`・`pages.yml` の両方を現行の major に上げた
  (checkout v7・setup-node v7・configure-pages v6・upload-pages-artifact v5・deploy-pages v5)．
  **上げた版での配信も確認済み**．`pages.yml` の path フィルタに自分自身が入っているため
  `main` へマージした時点でデプロイが走り，1分15秒で成功した．
  公開ページも 200 で返る (`biss2.html` 787,637 バイト・`biss.html` 749,055 バイト)．

- **`develop` を `main` へマージして push した**．あわせて，`main` にしか無かった
  `man/01-howtouse_en.md` 末尾の**空の HTML コメント (3行) を消した**．
  これで `develop` と `main` の中身は完全に一致する (差はマージコミットだけ)．
  CI は `main` でも 4 版すべて緑．

- **`npm rm -g npm` を 3 台の PC で片づける**ことにし，
  「進捗状況 > 残っている手作業」に**どの PC で済んだかを書く表**を作った．
  この機械 (`LAPTOP-ONKK9573`) はまだ未実施．
  併せて，古い npm が使われる仕組みを調べ直して記録を直した．
  **PATH で隠されているのではなく**，`nodejs/npm` の起動スクリプトが
  グローバル prefix の npm を同梱版より優先する作りだった
  (PATH は同梱版が先 (26 番目) なのに `npm -v` は 9.6.1 を返していた)．

### 残っている手作業

**`npm rm -g npm` を，作業に使っている 3 台の PC で 1 台ずつ実行する**．
グローバルに居座った古い npm を消し，Node 同梱の npm に戻すため
(仕組みは「開発ツール > Node の版ちがい」を参照)．
**3 台すべて済んだらこの節ごと消してよい**．

Claude Code のシェルからは権限で弾かれるので，**ユーザの手で実行する**
(Claude Code のプロンプトで `! npm rm -g npm` と打てばこの画面から実行できる)．

手順は 1 台につき 3 行:

```
npm -v            # 実行前の版を控える
npm rm -g npm
npm -v            # Node 同梱の版に変わっていることを確認
```

| PC (hostname)     | 状態 | 実施日 | 実行前 npm | 実行後 npm | Node |
| ----------------- | ---- | ------ | ---------- | ---------- | ---- |
| `LAPTOP-ONKK9573` | 未   |        | 9.6.1      |            | 22.23.1 |
| (2 台目: hostname を書く) | 未 |    |            |            |      |
| (3 台目: hostname を書く) | 未 |    |            |            |      |

- **hostname は `hostname` か `$env:COMPUTERNAME` で分かる**．
  別の PC で作業を始めたら，その場で表の空欄を埋める．
- **その PC がグローバル npm を入れていなければ** `npm rm -g npm` は何もしない
  (`npm -v` が前後で変わらない)．それも「済」として記録してよい．
- ついでに `node -v` も控えておくと，版の食い違いが起きたときに見比べられる．

### 課題一覧

方針が決まったもの:

- **旧版の扱い** → 凍結して保存する (「旧版と現行版」の節を参照)．改修は現行版のみ．
- **多言語化 (旧 A-1)** → 実装済み．「多言語」の節を参照．
- **「使い方」のリンク (旧 A-2)** → 修正済み．表示言語に応じて `_jp.md` / `_en.md` を開く．

#### A. 機能として未完了 (優先度 高)

- (未反映の修正は無い．2026-08-17 のマニュアルの画像・本文の修正と
  R まで通すテストは `main` へマージ済み)

#### B. 性能 → 対処済み

- `updateAllInputsTables()` を **2.6 倍速くした** (下表)．タブを切り替えるたびに走る処理．
- 残る時間はほぼ表の組み立て (DOM を作る分) で，構造を変えないかぎりこれ以上は縮まない．
- 20地点・数千行でも，従来の 8地点ぶんより軽い．

#### C. テストが無い機能 → 対処済み

- 集計・GPS・自動保存・文字サイズ・メール・植物相の入替・フルスクリーンに
  テストを書いた (`test/feature.test.js` と `e2e/test_biss.py`)．
- ファイル選択の3か所 (種一覧の登録・設定の読込・植物相の入替) は，すべて
  Playwright が実際のダイアログで見ている．
- 残る未テストは，人の目でしか見られないもの (下の E) だけ．

#### D. コードに残っている脆さ → 対処済み

- 位置で数えるのをやめ，名前で引くようにした (「課題 D」の記録を参照)．
- `inhibit_close.js` (離脱の確認) は**削除した**．確認ダイアログを出す代わりに，
  **閉じたときに控えを残して次回に復元する** (`backup.js`) 方式にした．
- 兄弟辿りで残っているのは `clickFileInput()` の1箇所だけ
  (ボタンと隠し入力を同じ関数で並べて作っている意図的なペアなので，このままでよい)．

#### E. 人の目でしか確認できないこと

- **見た目の崩れ全般**．テストは要素の表示・非表示までしか見ない．
- **スマートフォン・タブレットでの操作**．
- **控えと復元 (`backup.js`) の実機での確認**．とくに，
  **スマートフォンで別のアプリに切り替えて戻したときに控えが残るか**
  (iOS Safari は `visibilitychange` の扱いが違うことがある)．
  復元の文言とボタンの見え方も．ブラウザテストが見ているのは
  Chromium で開き直したときの往復だけ．
- ~~保存した TSV/JSON を実際に `ecan::read_biss()` に通すこと~~
  → **機械で見るようにした** (`e2e/test_read_biss.py`)．人の目は要らなくなった．
- ~~**撮り直した画像の見え方**~~ → 88枚を目視で確認した．結果は下の **G**．

#### F. 見送っているもの (案3)

単一 HTML でオフライン配布という要件に対して，ビルド系の入れ替えが見合わないため保留．

- グローバル関数 175 個．イベントハンドラが文字列 (`onclick: "delRow(this)"`)．
- モジュールシステムが無い．

#### G. 画像の不具合 (2026-08-17 の目視確認) → 対処済み

日本語 44枚・英語 44枚を本文と突き合わせて確認し，見つけた不具合をすべて直した
(直した内容は「進捗状況 > 現在の状態」を参照)．

見つかったのは，検索が効いていない6枚，前後の対のデータ不一致，SameAs の切れ，
`settings_base02` が削除前，`example_species_list03` の入力漏れ，
`tools_list12` の置き場所，マニュアルのボタン名の誤り，下端の切れ．

**残しているもの**

- **`add_plot01` は英語表示のまま**．ブラウザが描くダイアログはページの画像に写らないので，
  手で撮るしかない．問いかけ (「地点名を入力」) はアプリの文字列なので，
  日本語表示では日本語になる旨をマニュアルに注記した．
- **`font_large` は右端がボタンの途中で切れる**．文字を大きくした結果そのものなので，
  意図は伝わる．
- **観察情報の表は右端 (SameAs 付近) が切れる図がある**．折り返しなしの状態を見せる図で，
  実際の画面でもそう見える．値を読ませたい `example_species_list06` だけ幅を広げてある．

### 補足: 配布物とソースの同期状況

`js2/`・`css2/`・`biodiv2.html` を改修したら `www/biss2.html` を再ビルドすること．
再ビルドを忘れると，配布物だけが古いまま公開される．

**`pytest` がこれを見張る**．同じテストを `biodiv2.html` と `biss2.html` の両方に流すので，
再ビルドを忘れると配布物の側だけが失敗する．`main` へマージする前に必ず走らせる．
