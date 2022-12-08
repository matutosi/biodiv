# How to use Investigation Support System (BiSS) 生物多様性調査支援アプリ(BiSS)の使い方

# Settings 設定

## Initial settings 初期画面

Initial settings is as below. 
Can use auto saving and select several setting for plots and occurrences. 

初期画面は以下のとおり．
自動保存や地点・観察の入力項目の設定が可能である．

<img src="img/crop_settings00.png" width="50%">

## Auto save 自動保存

一定間隔(1,3,5,10,15,30,60分)で入力したデータを保存できる．
自動保存を有効にするには，以下の設定が必要．
一定間隔で保存を続けるので，10分や15分間隔程度での保存を推奨．

### Select auto save intervals 保存間隔の選択

Select auto save interval (minutes) form the pull-down menu.
After setting interval, all plots and occurrences data will be downloaded. 

自動保存の間隔(分)をプルダウンメニューから選択する．
保存間隔を設定すると，地点情報と観察情報の全てがダウンロードされる．

<img src="img/crop_settings_autosave01.png" width="50%">

### Downloading the first data データのダウンロード開始

When set to 5-minute intervals, the first data will be downloaded 5 minutes after setting.
Directory for download depends on your browser settings.

5分間隔に設定した場合は，設定の5分後に1回目のデータがダウンロードされる．ダウンロード先のフォルダは，ブラウザの設定による．

<img src="img/crop_settings_autosave02.png" width="50%">


### Allowing multiple file downloads 複数ファイルダウンロードの許可

During the second download of 10 minutes, a warning may appear about allowing multiple files to be downloaded.
In that case, select "Allow".

2回目の10分後のダウンロード時に，複数ファイルのダウンロードの許可の警告が出る場合がある．
その場合は，「許可」を選択する．

<img src="img/settings_autosave03.png" width="15%">


### Auto saving data データの自動保存

Data is then downloaded according to the interval setting.

その後，設定した間隔に従ってデータがダウンロードされる．

<img src="img/crop_settings_autosave04.png" width="50%">


### Data format データの形式

- file name ファイル名 :yyyy\_mm\_dd\_hh\_mm_ss.json   
- format 形式: text file with UTF8 encoding  

<img src="img/crop_settings_autosave05.png" width="50%">


### Inport data into R Rへのデータの取り込み

See "Inport data into R" to use data in R.

Rでデータを使うには，「Rでのデータの取り込み」を参照．


## Setting of input items 入力項目の設定

データを入力する前に，地点情報と観察情報の項目を設定する．

- Select a basic combination and add/delete items (recommended)   
- Start with the empty and add items with button (recommended)   
- Setting all items by yourself (not recommended)   
- 基本的な組み合わせを選んで，追加・削除する(推奨)   
- 空の設定に必要な項目をボタンで追加する(推奨)   
- 全て自分で設定する(非推奨)   

### Select a basic combination 基本的な組み合わせの選択

To select a basic combination and add/delete items, 
at first select the close setting to be used from pull-down menu.

基本的な組み合わせを選んで追加・削除する場合，まず使用する近い設定を選ぶ．

- empty: Empty configuration
- full: Contains all items that might be needed in a vegetation or flora survey   
- \_5\_layers: For vegetation survey with 5 layers (T1, T2, S1, S2, H)   
- \_3\_layers: For vegetation survey with 3 layers (T, S, H)   
- no\_layers: For vegetation survey without layers   
- flora: For flora survey   

- empty: 空の設定    
- full: 植生調査や植物相調査で必要になりそうな項目を全て含む   
- \_5\_layers: 5階層(T1, T2, S1, S2, H)の植生調査用   
- \_3\_layers: 3階層(T, S, H)の植生調査用   
- no\_layers: 階層なしの植生調査用   
- flora: 植物相調査用   

<img src="img/crop_settings_main01.png" width="50%">

For vegetation surveys, it is recommended to use "full" or "_5_layers". 
Delete necessary items with "DELETE" button. 

植生調査の場合は，「full」か「_5_layers」をもとにすることをおすすめする．
不要な行を「DELETE」で削除する．

<img src="img/crop_settings_main02.png" width="50%">


If you do not see what you need, add rows by clicking "Add rows" at the bottom. 
If you want to add multiple rows, change the values on the left and press "Add rows". 

必要な項目がない場合は，一番下の「Add rows」で行を追加する．
複数行を追加したい場合は，左の数値を変更してから「Add rows」を押す．

<img src="img/crop_settings_main03.png" width="50%">



### Start with the empty and add with buttons 空の設定からボタンを追加

Add items based on the empty setting, select EMPTY above. 
Add items with "date_GPS" button etc. 

空の設定をもとに，必要な項目を追加する場合は，上記のemptyを選択する．
"date_GPS"などのボタンを押して，項目を追加する．

<img src="img/crop_settings_main04.png" width="50%">



### Save/load settings 設定の保存・復元

<img src="img/crop_settings_main06save.png" width="50%">
<img src="img/crop_settings_main07save.png" width="50%">

The settings of plots and occurrences can be saved and restored. 
To save, enter a file name in the text box to the right of the "Save" button and click the "Save" button. 
The saved file is a text file in JSON format (UTF8) with the extension "json". 

地点項目と観察項目は，それぞれ設定を保存・復元することが可能．
保存するには，「Save」ボタンの右にあるテキストボックスにファイル名を入力し，「Save」ボタンをクリックする．
保存したファイルはJSON形式のテキストファイル(UTF8)で，拡張子は「json」．

<img src="img/crop_settings_main05.png" width="50%">


To restore the saved settings, click the "Choose file" button to the right of "Laod" and select the saved file.
保存した設定を復元するには，「Laod」の右側にある「Choose file」ボタンをクリックして，保存したファイルを選択する．


### Setting all items by yourself (not recommended) 全項目を手動で設定(非推奨)

All items can also be set manually.
However, this is not recommended because it requires understandings of the system specifications.
Explanation of the setting method and system specifications has not yet been prepared.

全項目を手動で設定することも可能．
ただし，システム仕様を理解する必要があるため，非推奨．

<!--
設定方法やシステムの仕様の説明は未作成．
-->
<!--  -->

- item: 項目の名称   
  - 変更不可の項目名: 「DATE」「LOC_LAT」「LOC_LON」「LOC_ACC」「UPDATE_TIME_GPS」「DELETE」「DATE」「Layer」「Species」「Identified」「SameAs」   
  - 使用不可の文字列: 先頭での数字   
    <!-- 「,」「.」は不可? -->
  - 項目名の重複不可   
- type: 入力タイプ   
  - auto: 自動入力(システムで利用)，項目名の変更不可   
  - button: ボタン(システムで利用)，項目名の変更不可   
  - checkbox: チェックボックス   
  - fixed: 固定値のテキスト   
  - list: プルダウンリスト   
  - text: テキストボックス   
  - number: 数値   
- value: typeによって動作が異なる   
  - checkboc: 空のときはチェックなし，入力があるときはチェックあり(分かりやすくするため，「checked」などのテキストを推奨)  
  - fixed: 固定値の内容   
  - list: 「:」区切りでのプルダウンメニューの項目名   
- DELETE: 行の削除ボタン(設定自体には関係なし)   
- memo: 使用者用のメモ(設定自体には関係なし)    


### Hide/Show setting tables 設定表の表示・非表示

The table of geographic features and observation features can be shown or hidden.
To avoid accidentally changing the settings after setting each item, it is recommended to hide them.

Press "Hide table" in the upper left corner to hide the table.
When the table is hidden, press "Show table" to display it.

地点項目と観察項目の表は，表示/非表示の切り替えが可能．
それぞれを設定後に，間違えて設定を変更しないようにするには，非表示にしておくと良い．

表の左上ににある「Hide table」を押すと，非表示になる．
非表示のときに，「Show table」を押すと，表示される．

<img src="img/crop_settings_hide_show.png" width="50%">



### Tips for setting items 項目設定のコツ

The horizontal order (left/right) of items in input tables depend on the vertical order (up/down) in setting tables. 
To change the order in a setting table, enter a numbr in the "memo" field and click on the column name "memo". 
This will allow you to reorder the columns according to the number. 
Clicking again switches the ascending/descending order.

調査データの入力表での横並びの順序(左右)は，設定表の縦並びの順序(上下)に従う．
入力表での順序を並べ替えたい場合は，「memo」の項目に数値を入力してから列名の「memo」をクリックする．
そうすることで，入力した数値の順序に並べ替え可能．
さらにクリックすると，昇順・降順が入れ替わる．

# Input plot and occurrence data 地点情報と観察情報の入力

地点情報と観察情報を入力するには，まず「+ PLOT」をクリックする．
ポップアップ画面に地点名を入力する．
地点名には，英数字・日本語文字が使用可能．
「_」(アンダーバー)「,」(カンマ)「.」(ピリオド)などの記号や空白は使用不可．
また，地点名の重複はできない．

<!-- 
ポップアップの画面を追加する
-->

以下では，サンプルデータを用いて，地点情報と観察情報の入力方法を説明する．

# editing now

## Show example サンプルデータの表示

Click "Show example" in the upper right corner to display example data.

右上にある「Show example」をクリックすると，サンプルデータが表示される．

<img src="img/crop_example00.png" width="80%">

表の上部には地点情報，下部には観察情報の表が表示される．

## Contents of example data サンプルデータの内容

- Settings of the plot and occurrence items: "\_5\_layers" (for vegetation survey with 5 layers).   
- Plots: 2 plots (BiSS01 and BiSS02)  
- Occurrences: Randomly displays the layers (T1, T2, S1, S2, H), species (sp1, sp2, ...) and cover (0-100). 
- サンプルデータでの地点項目と観察項目: 「\_5\_layers」(5階層の植生調査用)．   
- Plots: BiSS01とBiSS02の2地点   
- Occurrences: ランダムに階層(T1, T2, S1, S2, H)，種名(sp1, sp2, ...)，被度(0-100)が表示される

<img src="img/crop_example01.png" width="80%">

## 表の表示変更・操作(地点・観察共通)

地点情報と観察情報の表は以下の操作が可能．

- 表の表示/非表示   
- 表の幅の設定変更  
- 列の表示/非表示   
- 行の並べ替え   
- テキストデータの検索   

### 表の表示/非表示   

地点情報と観察情報の両方とも，表示/非表示の切り替えが可能．
入力後に操作を誤ったデータの変更を防ぐには，非表示にしておくと良い．
表の左上ににある「Hide table」を押すと，非表示になる．
非表示のときに，「Show table」を押すと，表示される．

### 表幅の設定変更  

地点情報の初期状態は画面幅に合わせた形で折り返され，観察情報は折り返しなしで右に伸びた状態である．
表の左上にある「Extend width」をクリックすると，表幅が広がって折り返しなしの状態になる．
「Fit width」をクリックすると，画面幅で折り返される．

### 列の表示/非表示   

折り返しなしの状態のとき，表の2列目に「Hide」ボタンが表示される．
「Hide」ボタンをクリックすると，その列が非表示になる．
非表示になった列は，表の上部に「Show」に続いて列名がボタンとして表示される．
それぞれの列名のボタンをクリックすると，再度表示することが可能．
また，「All cols」をクリックすると，非表示の全ての列を一斉に表示できる．

### 行の並べ替え

折り返しなしの状態のときに列名をクリックすると，その列の入力内容に従って並べ替えができる．
再度列名をクリックすると
入力表での順序を並べ替えたい場合は，「memo」の項目に数値を入力してから列名の「memo」をクリックする．
そうすることで，入力した数値の順序に並べ替え可能．
さらにクリックすると，昇順・降順が入れ替わる．

なお，1地点での地点情報では1行しかないため，並べ替えは無意味．

### テキストデータの検索

表の左上のテキストボックスに入力をすると，入力情報の検索が可能．
一致するものだけが表示されるため，種名の確認などができる．
なお，ここでの検索対象は，表示されている列のテキストボックス・固定値(fixed)のテキストである．
検索対象から地点名などを除外する場合は，「Hide」により非表示にしておくと良い．

## データの入力

- テキストボックス: 種名などをテキストで入力   
- チェックボックス: 「Identified」(同定済み)をチェック   
- 数値: 数値を入力．△▽では1単位で増減．キーボードでは小数点以下の入力可能   
- 自動入力項目: 「PLOT」「NO」
- 「DATE」「LOC_LAT」「LOC_LON」「LOC_ACC」は，「UPDATE_TIME_GPS」ボタンを押と更新．GPSデータは，「StartGPS」ボタンを押してGPSデータの使用を許可する必要あり．    
- 

## 観察情報の行の追加・削除

「+ PLOT」で新規の地点を追加すると，観察情報は4行の入力欄が表示される．
左下のプルダウンの数字で行数を選択して，「Add rows」をクリックすると，新たな入力行が追加できる．

## 観察情報の入力

<img src="img/crop_example02_add.png" width="80%">


<img src="img/crop_example03_added.png" width="80%">



## 階層ごとの被度の計算

Select "Cover" for "Value" and "Layer" for "Group" in the lower left of the observation information, 
and click "Calculate" to display the result of calculating sum of cover for each layer.
Note that "Value" displays number items in the occurrence data, and "Group" pull-down list, 
so it is possible to calculate other than "Cover" and "Layer".

観察情報の左下にある「Value」に「Cover」，「Group」に「Layer」を選択して，「Calculate」をクリックすると，階層ごとの被度を計算した結果が表示される．
なお，「Value」には観察情報のうち数値の項目が表示され，「Group」にはプルダウンのリストの項目が表示されるため，「被度」「階層」以外の集計も可能．

<img src="img/crop_example02_calc.png" width="80%">



## 未作成


<img src="img/tools13en.png" width="80%">


<img src="img/crop_example02_01.png" width="80%">



<img src="img/crop_tools02.png" width="50%">
<img src="img/crop_tools02en.png" width="50%">



# Show all inputs 全入力情報の表示

「All Plots」のタブには，入力済みの全データが表示されている．
具体的には，全ての地点情報と観察情報である．
また，組成表形式の表も表示される．
これらによって，地点情報や地点間での観察情報の比較ができる．
なお，「All Plots」の表は閲覧のみで，内容の変更は不可．

「All Plots」の3つの表のいずれも，地点情報や観察情報の表と同様に以下の操作が可能である．

- 表の表示/非表示   
- 表の幅の設定変更  
- 列の表示/非表示   
- 行の並べ替え   
- テキストデータの検索   

詳細は，「地点情報と観察情報の入力」の「表の表示変更・操作」を参照．

内部的なことではあるが，自動保存機能で保存しているのは「All Plots」のデータである．

# Tools 

種名の検索，種名リストの作成・保存などができる．
また，検索した種名やリストからデータ入力が可能である．

種名リストはテキストファイル(UTF8)から登録可能．
テキストファイルは，1つの種名を1行ごとに入力しておく．
「Add species to list」の右にある「Choose file」でファイル名を選択し，「開く」をクリックする．

テキストファイル内の種名がボタン形式で表示される．
表示されている種名を使用している端末のブラウザ内に名前をつけて保存可能．
保存先として「browser」を選択して，「File name」にリストの名称を入力し，「Save」ボタンをクリックするとブラウザに保存される．

種名リストとして登録すると，
「Select species list:」の右側にあるプルダウンメニュー内に追加される．
リストを選択すると，

なお，種名には入力済みの種名も同時に表示される．
未同定の種名(「Identified」にチェックされていない種)には，「種名_地点A」のような形式で地点名が合わせて表示される．
その種名を選択して，観察情報として追加すると，SameAsの列に既出の地点名(上記の例では「地点A」)が自動的に入力される．

<!-- 入力済みの種名を含めるかどうか選択することができれば便利かも -->
<!-- 種名リストの削除機能が必要 -->

※註釈
種名リストの保存にはブラウザのLocalStorageを利用している．
LocalStorage内の情報は，ブラウザでのサイト閲覧時「容易に」他者に漏洩する可能性がある．
そのため，通常保存することはないはずだが，個人情報等は種名リスト(LocalStorage)には保存するべきではない．


## Search species name 種名の検索


<img src="img/tools00.png" width="50%">
<img src="img/tools00en.png" width="50%">
<img src="img/tools01.png" width="50%">
<img src="img/tools02.png" width="50%">
<img src="img/tools02en.png" width="50%">
<img src="img/tools03en.png" width="50%">
<img src="img/tools04en.png" width="50%">
<img src="img/tools05en.png" width="50%">
<img src="img/tools06en.png" width="50%">
<img src="img/tools07en.png" width="50%">
<img src="img/tools08en.png" width="50%">
<img src="img/tools09en.png" width="50%">
<img src="img/tools10en.png" width="50%">
<img src="img/tools11en.png" width="50%">
<img src="img/tools12en.png" width="50%">


- Choose "Tools" tab
![tools_tab](img/03_00.png)    

- Input wamei and Choose "Search Text"  
- Show results  
![search_wamei](img/03_01.png)  
![search_wamei_res](img/03_02.png)  

- Use space (" ") to search including [A and B]  
- Results of [A and B]  
![search_wamei_multi](img/03_03.png)  
![search_wamei_multi_res](img/03_04.png)  

- Can use [A and B and C]  
![search_wamei_multi](img/03_05.png)  

- Case of results over 100  
- Alert will be desplayed and show only 100 results  
![search_wamei_over100](img/03_06.png)  
![search_wamei_over100_alert](img/03_07.png)  
![search_wamei_over100_res](img/03_08.png)  

- 空欄でSearch Textを選択すると，検索結果がクリアされる  
![search_wamei_clear](img/03_09.png)  
![search_wamei](img/03_01.png)  


# Inport data into R Rでのデータの取り込み

```{r}
read_biss <- function(json, join = TRUE){
  biss <- jsonlite::fromJSON(json)
  plot <- data.frame(biss$plot)
  occ  <- data.frame(biss$occ)
  if(join){
    return(dplyr::left_join(plot, occ))
  }else{
    return(list(plot = plot, occ = occ))
  }
}

library(jsonlite)
url <- "https://raw.githubusercontent.com/matutosi/biodiv/main/man/example.json"
json <- readr::read_tsv(url, col_names = FALSE)$X1

read_biss(json)
read_biss(json, join = FALSE)

```


<!--
- Toolsタブを選択  
- wameiに検索したい和名を入力して，Search Textを選択すると，検索結果が表示される  
- 「A かつ Bを含む」で検索したいときは，スペースで区切る  
- 「ヤハズ かつ エンドウを含む」の結果  
- 「A かつ B かつ C」も可能  
- 検索結果が100を超える場合(例：「カシ」)  
- 100を超えることの警告が表示され，結果は100個だけ表示  
- 空欄でSearch Textを選択すると，検索結果がクリアされる  

Basic use in a table
* Hide button: hide a col
* DELETE: delete a row
* Click col names: sort
* add row: copy last rows
* Search text: filter by text
* Hide/Show table
* Fit/Extend width to page
* Calculate cover
   in each layer
* Can add species from list
   by Add species to PLOT
-->
<!--  -->
