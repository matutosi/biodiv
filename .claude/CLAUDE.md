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

**JavaScript は圧縮されない**．inliner が同梱する uglify が古く ES5 しか解釈できないため，
`js2/` の ES6 記法 (`...args`，アロー関数，`let`) で圧縮に失敗し，そのまま埋め込まれる．
動作に問題はなく，ファイルが 2% ほど大きくなるだけ (旧版 `biss.html` は圧縮済みのまま)．

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
| `package.json`      | `npm run lint` / `npm test` の定義と devDependencies |
| `eslint.config.js`  | ESLint の設定 (flat config) |
| `test/biss.js`      | jsdom で `www/biodiv2.html` を組み立てる土台 |
| `test/smoke.test.js`| 回帰スモークテスト (14件) |

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

## 進捗状況

### 現在の状態

2026-08-16 06:54 (JST) 更新．

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
  - **A. 実バグ (6件)**:
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

### 課題一覧

方針が決まったもの:

- **旧版の扱い** → 凍結して保存する (「旧版と現行版」の節を参照)．改修は現行版のみ．
- **多言語化 (旧 A-1)** → 実装済み．「多言語」の節を参照．
- **「使い方」のリンク (旧 A-2)** → 修正済み．表示言語に応じて `_jp.md` / `_en.md` を開く．

#### A. 機能として未完了 (優先度 高)

- **実バグ 6件の修正 (A1〜A6)**: 内容は「現在の状態」の分類 A を参照．
  A6 (地点名のハイフン) は**利用者が案内どおりに操作すると必ず踏む**ので優先度が高い．
- **ブラウザでしか確認できないものが残っている**．
  スモークテスト (`npm test`) が見るようになった分は，手で確認しなくてよい．
  - 自動で見ている: 言語切替でデータが消えないこと，保存する列名が英語のままであること，
    既存の行のボタンが言語に追随すること，切替後に作った地点のラベルが新しい言語になること，
    `DELETE` の行削除，`UPDATE_TIME_GPS` の日時更新，列見出しでの並べ替え，
    地点タブの追加，組成表の作成．
  - **手で見るしかない**: ファイル選択ダイアログの3か所 (設定の読込・種一覧の登録・
    植物相の入替)．jsdom では実ダイアログを開けない．
  - **手で見たほうがよい**: 見た目の崩れ全般．とくに「表を非表示 / 表を表示」の切替と，
    列の「非表示 → 表示: 全列」の並び (`table_hide_show.js` の子要素数の判定を 2 → 3 に
    変えたため)．保存した TSV/JSON を実際に `ecan::read_biss()` に通すこと．

#### B. 開発環境・ツールの不整合 (優先度 中)

- (なし．lint とテストは「開発ツール」の節のとおり導入済み)

#### C. 整理・確認 (優先度 低)

- **マニュアルの画像が英語表示のまま**: `man/img/*.png` は英語表示で撮ったもの．
  `01-howtouse_jp.md` のボタン名は日本語に直したので，画像とは表記が食い違う．
  日本語表示で撮り直すのが望ましい (当面は，画像は英語表示である旨の注記で対応)．

### 補足: 配布物とソースの同期状況

`js2/`・`css2/`・`biodiv2.html` を改修したら `www/biss2.html` を再ビルドすること．
再ビルドを忘れると，配布物だけが古いまま公開される．
