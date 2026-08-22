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

## 詳しくはこちら

| ファイル | 中身 |
|---|---|
| [notes/history.md](notes/history.md) | 進捗状況の履歴 (完了分)・課題一覧の履歴 (対処済み分・A〜D・G) |

## 進捗状況

### 現在の状態

2026-08-22 (このセッション)
**CLAUDE.md を短縮した**．完了済みの進捗履歴 (2026-08-19 06:36 分まで) と，
対処済みの課題一覧 (A〜D・G) を [notes/history.md](notes/history.md) へ切り出した．
本体には概要・構成・手順などの参照情報と，現在有効な残件だけを残した
(todo と下位のプロジェクト共通のルール．詳しくは
[../../.claude/notes/learnings.md](../../.claude/notes/learnings.md) の「CLAUDE.md の書き方」)．

- `develop` は `origin/develop` と一致し，中身はすべて `main` に入っている．
  `www/` に未コミットの変更は無く，公開物 (`biss2.html`・`biss.html`) は最新のまま．
- lint 0件・jsdom 36件・browser 29件がすべて緑．コード側で着手すべき残件は無い．
- 残る積み残しは下の「残っている手作業」(`npm rm -g npm` を3台で) と，
  「課題一覧 (残っているもの)」の実機確認・見送り事項だけ．

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
| `LAPTOP-ONKK9573` | **済** | 2026-08-19 | 9.6.1 | 10.9.8 | 22.23.1 |
| (2 台目: hostname を書く) | 未 |    |            |            |      |
| (3 台目: hostname を書く) | 未 |    |            |            |      |

- **hostname は `hostname` か `$env:COMPUTERNAME` で分かる**．
  別の PC で作業を始めたら，その場で表の空欄を埋める．
- **その PC がグローバル npm を入れていなければ** `npm rm -g npm` は何もしない
  (`npm -v` が前後で変わらない)．それも「済」として記録してよい．
- ついでに `node -v` も控えておくと，版の食い違いが起きたときに見比べられる．
- **他のグローバルツールは消えない**．`LAPTOP-ONKK9573` では 236 パッケージ
  (npm 自身の依存) が消えただけで，`inliner` 1.13.1 と `@google/gemini-cli` は残った
  (`npm ls -g --depth=0` で確認)．`inliner` は配布物のビルドに使うので，
  実行後に `inliner --version` が返ることを見ておくと安心．

### 課題一覧 (残っているもの)

方針が決まったもの・対処済みのもの (A〜D・G) は
[notes/history.md](notes/history.md) の「課題一覧の履歴」を見る．

#### E. 人の目でしか確認できないこと

- **見た目の崩れ全般**．テストは要素の表示・非表示までしか見ない．
- **スマートフォン・タブレットでの操作**．
- **控えと復元 (`backup.js`) の実機での確認**．とくに，
  **スマートフォンで別のアプリに切り替えて戻したときに控えが残るか**
  (iOS Safari は `visibilitychange` の扱いが違うことがある)．
  復元の文言とボタンの見え方も．ブラウザテストが見ているのは
  Chromium で開き直したときの往復だけ．

#### F. 見送っているもの (案3)

単一 HTML でオフライン配布という要件に対して，ビルド系の入れ替えが見合わないため保留．

- グローバル関数 175 個．イベントハンドラが文字列 (`onclick: "delRow(this)"`)．
- モジュールシステムが無い．

### 補足: 配布物とソースの同期状況

`js2/`・`css2/`・`biodiv2.html` を改修したら `www/biss2.html` を再ビルドすること．
再ビルドを忘れると，配布物だけが古いまま公開される．

**`pytest` がこれを見張る**．同じテストを `biodiv2.html` と `biss2.html` の両方に流すので，
再ビルドを忘れると配布物の側だけが失敗する．`main` へマージする前に必ず走らせる．
