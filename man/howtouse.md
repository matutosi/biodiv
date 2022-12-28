# How to use Investigation Support System (BiSS) 
# 生物多様性調査支援アプリ(BiSS)の使い方

# Settings
# 設定

## Initial settings
## 初期画面

Initial settings is as below. 
Can use auto saving and select several setting for plots and occurrences. 

初期画面は以下のとおり．
自動保存や地点・観察の入力項目の設定が可能である．

<details>
<img src="img/settings00.png" width="70%">
</details>


## Change font size
## 文字サイズの変更


To change the font size of the entire screen, click "small" and "LAGE" buttons.
The size can be changed by approximately 0.83 (1/1.2) and 1.2 times, respectively.

「small」「LAGE」ボタンで画面全体の文字サイズの変更が可能．
それぞれ，約0.83(1/1.2)倍・約1.2倍になる．

<details>
<img src="img/font_large.png" width="70%">
<img src="img/font_small.png" width="70%">
</details>

## Change to full screen
## 全画面表示への変更

The browser is displayed in a normal window at startup. 
To prevent accidental termination of the application, full screen is recommended.
Click "FULL SC <=> windowed" to switch between full-screen and windowed mode.

起動時のブラウザは，通常のウィンドウ表示である．
誤操作によるアプリの終了を防ぐには，全画面表示を推奨．
「FULL SC <=> windowed」をクリックすると，ウィンドウ表示と全画面表示が入れ替わる．


## Use GPS
## GPSの使用

To use GPS data obtained by a tablet or computer, permission is required.
Click the "Use GPS" button, then a message for permission will be desplayed and click 'Allow'.
To stop GPS, click "Stop GPS".

端末で取得したGPS情報を入手するにはGPSの使用許可が必要．
「Use GPS」のボタンをクリックするとメッセージが表示されるので，「承諾」をクリックする．
GPSの使用を終了するには，「Stop GPS」をクリック．

## Launch mailer
## 電子メールアプリの起動

Enter an e-mail address and click "Launch mailer" to start the default e-mail application.
The default e-mail application can be set by your tablet or computer.

電子メールアドレスを入力し，「Launch mailer」をクリックすると既定の電子メールアプリを起動できる．
既定の電子メールアプリについては，端末で設定する．

- Subject: biss\_yyyy\_mm\_dd\_hh\_mm\_ss    
- Body: Survey data in JSON format    
- 件名: biss\_yyyy\_mm\_dd\_hh\_mm\_ss    
- 本文: JSON形式の調査データ    

To use the data in R, save the body of the email as text data.
For the subsequent operations, see "Inport data into R".

調査データをRで利用するには，メールの本文をテキストデータとして保存する．
その後の操作は，「Rでのデータの取り込み」を参照．

## Auto save
## 自動保存

Data can be saved at a interval (1, 3, 5, 10, 15, 30, 60 minutes). 
To enable automatic saving, the following settings should be set. 
This function continues to save a new file periodically. 
Therefore, a large number of files are saved at short intervals. 
Generally, it is recommended to save at intervals of 10 or 15 minutes. 

一定間隔(1,3,5,10,15,30,60分)で入力したデータを保存できる．
自動保存を有効にするには，以下の設定が必要．
一定間隔で保存を新しいファイルの保存を続ける．
そのため，短い間隔の場合は多くのファイルが保存される．
一般的には，10分や15分間隔程度での保存を推奨．

### Select auto save intervals
### 保存間隔の選択

Select auto save interval (minutes) form the pull-down menu.
After setting interval, all plots and occurrences data will be downloaded. 

自動保存の間隔(分)をプルダウンメニューから選択する．
保存間隔を設定すると，地点情報と観察情報の全てがダウンロードされる．

<details>
<img src="img/settings_autosave01.png" width="70%">
</details>

### Downloading the first data
### データのダウンロード開始

When set to 5-minute intervals, the first data will be downloaded 5 minutes after setting.
Directory for download depends on your browser settings.

5分間隔に設定した場合は，設定の5分後に1回目のデータがダウンロードされる．ダウンロード先のフォルダは，ブラウザの設定による．

<details>
<img src="img/settings_autosave02.png" width="70%">
</details>


### Allowing multiple file downloads
### 複数ファイルダウンロードの許可

During the second download of 10 minutes, a warning message may appear about allowing multiple files to be downloaded.
In this case, select "Allow".

2回目の10分後のダウンロード時に，複数ファイルのダウンロードの許可の警告が出る場合がある．
この場合は，「許可」を選択する．

<details>
<img src="img/settings_autosave03.png" width="30%">
</details>


### Auto saving data
### データの自動保存

Data is then downloaded according to the interval setting.

その後，設定した間隔に従ってデータがダウンロードされる．

<details>
<img src="img/settings_autosave04.png" width="70%">
</details>


### Data format
### データの形式

- file name ファイル名 :biss\_yyyy\_mm\_dd\_hh\_mm\_ss.json   
- format 形式: text file with UTF8 encoding  

<details>
<summary>
example

データ例

</summary>

> {"plot":{"PLOT":["biss01","biss02"],"NO":["1","2"],"DATE":["2022\_12\_08\_20\_56\_33","2022\_12\_08\_20\_56\_34"],"Investigator":["",""],"Location":["",""],"LOC\_LAT":["undefined","undefined"],"LOC\_LON":["undefined","undefined"],"LOC\_ACC":["undefined","undefined"],"Altitude":["",""],"Aspect":["",""],"Inclination":["",""],"T1\_height":["",""],"T2\_height":["",""],"S1\_height":["",""],"S2\_height":["",""],"H\_height":["",""],"T1\_cover":["",""],"T2\_cover":["",""],"S1\_cover":["",""],"S2\_cover":["",""],"H\_cover":["",""],"Photo":["",""],"Memo":["",""]},"occ":{"PLOT":["biss01","biss01","biss01","biss01","biss01","biss01","biss02","biss02","biss02","biss02","biss02"],"Layer":["T1","T2","T1","T1","S1","S1","S1","S1","H","H","T2"],"Species":["sp1","sp3","sp7","sp4","sp4","sp9","sp1","sp9","sp5","sp7","sp7"],"Cover":["18","89","57","76","","99","","11","65","74","99"],"Sampled":["false","false","false","false","false","false","false","false","false","false","false"],"Identified":["false","true","true","true","true","true","false","true","true","true","true"],"Photo":["","","","","","","","","","",""],"Memo":["","","","","","","","","","",""],"SameAs":["","","","","","","","","","",""]}}
</details>

### Inport data into R
### Rへのデータの取り込み

See "Inport data into R" to use data in R.

Rでデータを使うには，「Rでのデータの取り込み」を参照．


## Setting of input items
## 入力項目の設定

Before inputting data, the plot and occurrence items must be set.
The following three methods are available. 

データ入力の前に，地点情報と観察情報の項目を設定する．
設定方法としては以下の3つがある．

- Select a basic combination and add/delete items (recommended)   
- Start with the empty and add items with button (recommended)   
- Setting all items by yourself (not recommended)   
- 基本的な組み合わせを選んで，追加・削除する(推奨)   
- 空の設定に必要な項目をボタンで追加する(推奨)   
- 全て自分で設定する(非推奨)   

### Select a basic combination
### 基本的な組み合わせの選択

To select a basic combination and add/delete items, 
at first select the close setting to be used from pull-down menu.

基本的な組み合わせを選んで追加・削除する場合，まず使用するものに近い設定を選ぶ．

- empty: Empty settings
- full: Contains all items that might be needed in a vegetation survey or flora survey   
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

<details>
<img src="img/settings_base01.png" width="70%">
</details>

For vegetation surveys, it is recommended to use "full" or "\_5\_layers". 
Delete unnecessary items with "DELETE" button. 

植生調査の場合は，「full」か「\_5\_layers」をもとにすることをおすすめする．
不要な行を「DELETE」で削除する．

<details>
<img src="img/settings_base02.png" width="70%">
</details>


If you can not find what you need, add rows by clicking "Add rows" at the bottom. 
To add multiple rows, change the values on the left and press "Add rows". 

必要な項目がない場合は，一番下の「Add rows」で行を追加する．
複数行を追加したい場合は，左の数値を変更してから「Add rows」を押す．

<details>
<img src="img/settings_base03.png" width="70%">
</details>

### Start with the empty and add with buttons
### 空の設定からボタンを追加

Start with the empty setting, select empty above. 
Add items with "date\_GPS" button etc. 

空の設定をもとに，必要な項目を追加する場合は，上記のemptyを選択する．
"date\_GPS"などのボタンで項目を追加する．

<details>
<img src="img/settings_base04.png" width="70%">
<img src="img/settings_base05.png" width="70%">
</details>


### Save/load settings
### 設定の保存・復元

The settings of plots and occurrences can be separately saved and restored. 
To save, enter a file name in the text box to the right of the "Save" button and click the "Save" button. 
The saved file is a text file in JSON format (UTF8) with the extension "json". 

地点項目と観察項目の設定は，個別に保存・復元可能．
保存するには「Save」の右にあるテキストボックスにファイル名を入力し，「Save」ボタンをクリックする．
保存したファイルはJSON形式のテキストファイル(UTF8)で，拡張子は「json」．

<details>
<img src="img/settings_save01.png" width="70%">
</details>

<details>
<summary>
settigs of no_layers

no_layersの設定
</summary>

> {"biss\_c\_names":["item","type","value","DELETE","memo"],"biss\_d\_types":["text","list","text","button","text"],"biss\_selects":[null,["auto","button","checkbox","fixed","list","text","number","","","","","","","","","","","","","","",""],null,null,null],"biss\_inputs":{"item":["DATE","Investigator","Location","LOC\_LAT","LOC\_LON","LOC\_ACC","UPDATE\_TIME\_GPS","Altitude","Aspect","Inclination","Height","Cover","Photo","Memo"],"type":["auto","fixed","text","auto","auto","auto","button","number","text","number","number","number","text","text"],"value":["","","","","","","","","","","","","",""],"DELETE":["DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE"],"memo":["","","","","","","","","","","","","",""]}}
</details>

<details>
<summary>
settigs of flora

floraの設定
</summary>

> {"biss\_c\_names":["item","type","value","DELETE","memo"],"biss\_d\_types":["text","list","text","button","text"],"biss\_selects":[null,["auto","button","checkbox","fixed","list","text","number","","","","",""],null,null,null],"biss\_inputs":{"item":["DATE","Investigator","Location","Memo"],"type":["auto","fixed","text","text"],"value":["","","",""],"DELETE":["DELETE","DELETE","DELETE","DELETE"],"memo":["","","",""]}}
</details>

To restore the saved settings, click the "Choose file" button to the right of "Laod" and select the saved file.

保存した設定を復元するには，「Laod」の右側にある「Choose file」ボタンをクリックして，保存したファイルを選択する．


### Setting all items by yourself (not recommended)
### 全項目を手動で設定(非推奨)


> **Note**   
> All items can also be set manually.
> However, this is not recommended because it requires understandings of the system specifications.
> Explanation of the setting method and system specifications has not yet been prepared.

> **Note**   
> 全項目を手動で設定することも可能．
> ただし，システム仕様を理解する必要があるため，非推奨．


<details>
<summary>
Item details

項目の詳細
</summary>

- item: Item name   
  - Item names that cannot be changed: "DATE", "LOC\_LAT", "LOC\_LON", "LOC\_ACC", "UPDATE\_TIME\_GPS", "DELETE", "DATE", "Layer", "Species", "Identified", "SameAs".   
  - Disabled strings: numbers at the beginning   
  - Duplicate item names are not allowed.   
- type: Input type   
  - auto: Auto input (used by system), item name cannot be changed   
  - button: button (used by system), item name cannot be changed   
  - checkbox: Checkbox   
  - fixed: Fixed value text   
  - list: pull-down list   
  - text: Text box   
  - number: Numeric value   
- value: behavior depends on type   
  - checkbox: unchecked if empty, checked if input is present (text such as "checked" is recommended for clarity)  
  - fixed: content of fixed value   
  - list: pull-down menu item names separated by ":"    
  - number : the range of increase or decrease step, 1 will be set when empty or non-numeric    
  - text : width of text box, 20 when empty or non-numeric

- DELETE: button to delete a row (not related to the setting itself)   
- memo: memo for user (not related to setting itself)    

- item: 項目名   
  - 変更不可の項目名: 「DATE」「LOC\_LAT」「LOC\_LON」「LOC\_ACC」「UPDATE\_TIME\_GPS」「DELETE」「DATE」「Layer」「Species」「Identified」「SameAs」   
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
  - checkbox: 空のときはチェックなし，入力があるときはチェックあり(分かりやすくするため，「checked」などのテキストを推奨)  
  - fixed: 固定値の内容   
  - list: 「:」区切りでのプルダウンメニューの項目名   
  - number: 入力時の数値の増減幅，空の時や数値以外のときの増減幅は1
  - text: テキストボックスの幅，空の時や数値以外のときは20
- DELETE: 行の削除ボタン(設定自体には関係なし)   
- memo: 使用者用のメモ(設定自体には関係なし)    
</details>

### Hide/Show setting tables
### 設定表の表示・非表示

The setting tables can be set shown or hidden.
To avoid accidental change of the settings, it is recommended to hide them.

Press "Hide table" in the upper left corner to hide it.
When the table is hidden, press "Show table" to display it.

地点項目と観察項目の表は，表示/非表示の切り替えが可能．
それぞれを設定後に，間違えて設定を変更しないようにするには，非表示にしておくと良い．

表の左上ににある「Hide table」を押すと，非表示になる．
非表示のときに，「Show table」を押すと，表示される．

<details>
<img src="img/settings_hide_show.png" width="70%">
</details>


### Tips for setting items
### 項目設定のコツ

The horizontal order (left/right) of items in input tables depend on the vertical order (up/down) in setting tables. 
To change the order, enter a numbr in the "memo" field and click on the column name "memo". 
This will allow you to reorder the columns according to the number. 
Clicking again switches the ascending/descending order.

調査データの入力表での横並びの順序(左右)は，設定表の縦並びの順序(上下)に従う．
順序を並べ替えたい場合は，入力表の項目「memo」に数値を入力してから列名の「memo」をクリックする．
そうすると，入力した数値の順序に並べ替え可能．
さらにクリックすると，昇順・降順が入れ替わる．

# Input plot and occurrence data
# 地点情報と観察情報の入力

## Add a new plot
## 新しい地点の追加

Before entering plot and occurrence data, click "+ PLOT".

地点情報と観察情報を入力するには，まず「+ PLOT」をクリックする．

<details>
<img src="img/add_plot00.png" width="70%">
</details>

Enter the PLOT name in the pop-up window. 
Alphanumeric and Japanese characters can be used for the PLOT name. 

ポップアップ画面に地点名を入力する．
地点名には，英数字・日本語文字が使用可能．

> **Warning**   
> Only spaces and "\_" (underscore) are not allowed.
> Duplicate PLOT names are not allowed.

> **Warning**   
> 空白のみや「\_」(アンダーバー)は使用不可．
> また，地点名の重複はできない．

<details>
<img src="img/add_plot01.png" width="30%">
</details>

After inputing PLOT name and click "OK", a new tab will be shown.

地点名を入力して「OK」を選択すると，新しい地点のタブが表示される．

<details>
<img src="img/add_plot02.png" width="70%">
</details>


In the following sections, you can see how to input plot and occurrence data with example.

以下では，サンプルデータを用いて地点情報と観察情報の入力方法を説明する．

## Show example
## サンプルデータの表示

Click "Show example" in the upper right corner to display example data.

右上にある「Show example」をクリックすると，サンプルデータが表示される．

<details>
<img src="img/add_plot00.png" width="70%">
</details>

The upper part of the table displays plot data and the lower part displays occurrence data.

表の上部には地点情報，下部には観察情報の表が表示される．

## Contents of example data
## サンプルデータの内容

- Settings of the plot and occurrence items: "\_5\_layers" (for vegetation survey with 5 layers).   
- Plots: 2 plots (BiSS01 and BiSS02)  
- Occurrences: Randomly displays the layers (T1, T2, S1, S2, H), species (sp1, sp2, ...) and cover (0-100). 
- サンプルデータでの地点項目と観察項目: 「\_5\_layers」(5階層の植生調査用)．   
- Plots: BiSS01とBiSS02の2地点   
- Occurrences: ランダムに階層(T1, T2, S1, S2, H)，種名(sp1, sp2, ...)，被度(0-100)が表示される


<details>
<img src="img/example01.png" width="90%">
</details>

## Table display changes and operations (common to plot and occurrence)
## 表の表示変更・操作(地点・観察共通)

Can operate the table of plot and occurrence. 

地点情報と観察情報の表は以下の操作が可能．

- Show/hide the table   
- Change table width  
- Show/hide columns   
- Sort rows   
- Search input text   
- 表の表示/非表示   
- 表幅の変更  
- 列の表示/非表示   
- 行の並べ替え   
- テキストデータの検索   

### Show/hide the table
## 表の表示/非表示

Both the plot and occurrence tables can be displayed or hidden.
To prevent accidental changes, it is recommended to hide the table.
Press "Hide table" in the upper left corner of the table to hide the table.

地点情報と観察情報の両方とも，表示/非表示の切り替えが可能．
誤操作による変更を防ぐには，非表示にしておくと良い．
表の左上ににある「Hide table」を押すと，非表示になる．

<details>
<img src="img/example_hide_table02.png" width="90%">
</details>


When the table is hidden, pressing "Show table" will show it.

非表示のときに，「Show table」を押すと，表示される．

<details>
<img src="img/example_hide_table01.png" width="90%">
</details>


### Change table width
### 表幅の設定変更

The initial state of the plot table is wrapped to fit the screen width, while the occurrence table is extended to the right without wrapping.
Clicking on "Extend width" in the upper left corner of the table expands the width of the table without wrapping.

地点情報の初期状態は画面幅に合わせた形で折り返され，観察情報は折り返しなしで右に伸びた状態である．
表の左上にある「Extend width」をクリックすると，表幅が広がって折り返しなしの状態になる．

<details>
<img src="img/example_width01.png" width="90%">
</details>

Clicking on "Fit width" will wrap the table to fit the screen width .

「Fit width」をクリックすると，画面幅で折り返される．

<details>
<img src="img/example_width02.png" width="90%">
</details>



### Show/hide columns
### 列の表示/非表示

In a no-wrap table, the "Hide" button appears in the second row.
Clicking the "Hide" button hides the column.
The hidden column names are displayed at the top of the table following "Show".
Clicking the button for each column name allows the column to be displayed again.
Click "All cols" to display all columns at once.

折り返しなしの状態のとき，表の2行目に「Hide」ボタンが表示される．
「Hide」ボタンをクリックすると，その列が非表示になる．
非表示になった列は，表の上部に「Show」に続いて列名がボタンとして表示される．
それぞれの列名のボタンをクリックすると，再表示が可能．
「All cols」をクリックすると全列を一斉に表示できる．

<details>
<img src="img/example_hide_cols01.png" width="90%">
</details>


### Sort rows
### 行の並べ替え

Clicking on a column name in the "no wrap" state allows sorting according to the input contents of the column.

折り返しなしの状態のときに列名をクリックすると，その列の入力内容に従って並べ替えができる．

<details>
<img src="img/example_sort01.png" width="90%">
</details>

Clicking the column name again switches the ascending or descending order.

再度列名をクリックすると，昇順・降順が入れ替わる．

<details>
<img src="img/example_sort02.png" width="90%">
</details>

Note that sorting is meaningless for the plot data, since there is only one row.

なお，1地点での地点情報では1行しかないため，並べ替えは無意味．


### Search input text
### テキストデータの検索

Entering text in the text box in the upper left corner of the table allows you to search for text inputs.
Only matched rows are displayed, so you can check the species name etc.

表の左上のテキストボックスに入力をすると，表示中の入力情報の検索が可能．
一致するものだけが表示されるため，種名の確認などができる．

<details>
<img src="img/example_search01.png" width="90%">
</details>

The search targets here are the text boxes and fixed value text in the displayed columns.
To exclude the name of a plot from the search, you can hide it by clicking "Hide".

なお，ここでの検索対象は，表示されている列のテキストボックス・固定値(fixed)のテキストである．
検索対象から地点名などを除外する場合は，「Hide」により非表示にしておくと良い．


<details>
<img src="img/example_search04.png" width="90%">
<img src="img/example_search05.png" width="90%">
</details>

## Input data
## データ入力

- Textbox: Enter text, e.g., species name   
- Checkbox: Check "Identified ets.     
- Numer: Enter a number or up and down number by up and down buttons by step. The step are set by setting. Decimal points can be entered using the keyboard.    
- Auto-fill items: "PLOT", "NO", "DATE", "LOC".    
- DATE", "LOC\_LAT", "LOC\_LON" and "LOC\_ACC" are updated by pressing "UPDATE\_TIME\_GPS" button.     
- テキストボックス: 種名などをテキストで入力     
- チェックボックス: 「Identified」(同定済み)などをチェック    
- 数値: 数値を入力．上下のボタンでも操作可能．増減間隔は設定で指定したもの．キーボードでは小数点以下の入力可能    
- 自動入力項目: 「PLOT」「NO」    
- 「DATE」「LOC\_LAT」「LOC\_LON」「LOC\_ACC」は，「UPDATE\_TIME\_GPS」ボタンを押と更新．GPSデータは，「StartGPS」ボタンを押してGPSデータの使用を許可する必要あり．     

<details>
<img src="img/example01.png" width="90%">
</details>


## Add/delete rows in a occurrence table
## 観察情報の行の追加・削除

When a new location is added with "+ PLOT", four lines of occurrence rows are displayed.
Select the number of rows from the pull-down number in the lower left corner, 
and click "Add rows" to add a new input row.

「+ PLOT」で新規の地点を追加すると，観察情報は4行の入力欄が表示される．
左下のプルダウンの数字で行数を選択して，「Add rows」をクリックすると，新たな入力行が追加できる．

<details>
<img src="img/example_addrows01.png" width="90%">
<img src="img/example_addrows02.png" width="90%">
</details>

## Add species from a list
## リストから種名を追加

The registered list is displayed as the pull-down menu below the occurrence table.
Select the list to use, and the names of the species in the list will be displayed.
See "Species Name List" in the Tools menu, to register or delete a species list.

種名リストを登録しておくと，観察情報の表の下に種名一覧のプルダウンメニューにリスト名が表示される．
使用したいリストを選択すると，そのリストの種名が一覧として表示される．
なお，種名リストの登録・削除方法は，ツールの種名リストを参照．

<details>
<img src="img/example_species_list01.png" width="90%">
</details>

Click on a species name button in the list, the name is moved to the upper part of the list as a temporary registration.
The temporary registered species name is not clickable in the species list below.
Clicking on a temporary registered species button cancels the temporary registration.

一覧に表示されている種名ボタンをクリックすると，その種名が仮登録として上の部分に移動する．
仮登録したものは，種名一覧ではクリックできない状態になる．
仮登録した種名ボタンをクリックすると，仮登録がキャンセルされる．

Select a layer to add from the pull-down menu.
Species names that do not have a species name button can be registered with the text box.
When registering multiple species in the text box, separate them with "," (comma).

仮登録した種名を登録したい階層等をプルダウンメニューから選択する．
種名ボタンのない種名は，テキストボックスから登録可能．
テキストボックスで複数種を登録するときには「,」(半角カンマ)で区切る．

<details>
<img src="img/example_species_list02.png" width="90%">
</details>

Click "Add Species to" to add the species name to the occurrence table.
The temporary registered species will be returned to the species list.

「Add Species to」をクリックすると種名が観察情報に追加できる．
種名リストの仮登録の種は，種名一覧に戻る．

<details>
<img src="img/example_species_list03.png" width="90%">
</details>

When "Include composition" is checked, the names of species that have already been entered for all sites are added to the list of species names and displayed.
Unidentified species (those not checked in "Identified") will be displayed with the name of the site in a format such as "sp8\_biss02".

「Include composition」にチェックを入れると，全地点での入力済の種名が種名一覧に追加されて表示される．
未同定の種名(「Identified」にチェックされていない種)には，「sp8\_biss02」のような形式で地点名が合わせて表示される．

<details>
<img src="img/example_species_list05.png" width="90%">
</details>

If you select "sp8\_biss02" and add it to the occurrence table, the existing location name ("biss02" in this example) will automatically be entered in the "SameAs" column.

「sp8\_biss02」を選択して観察情報に追加すると，既出の地点名(この例では「biss02」)が「SameAs」の列にが自動的に入力される．

<details>
<img src="img/example_species_list06.png" width="90%">
</details>


## Calculate cover in eac layer
## 階層ごとの被度の計算

Select "Cover" for "Value" and "Layer" for "Group" in the lower left of the occurrence table, 
and click "Calculate" to display the result of calculating sum of cover for each layer.
Note that "Value" displays number items in the occurrence data, and "Group" pull-down list. 
Thus, it is possible to calculate other than "Cover" and "Layer".

観察情報の左下にある「Value」に「Cover」，「Group」に「Layer」を選択して，「Calculate」をクリックすると，階層ごとの被度を計算した結果が表示される．
なお，「Value」には観察情報のうち数値の項目が表示され，「Group」にはプルダウンのリストの項目が表示される．
そのため，「被度」「階層」以外の集計も可能．


<details>
<img src="img/example_calculate01.png" width="90%">
</details>

# Show all input data
# 全入力情報の表示

The "All Plots" tab shows all the data: all of the plots, occurrence and composition tables, 
which allow for comparison among plots.
Note that the "All Plots" tables can only be viewed, and its contents cannot be changed.
Nothing will be shown before inputting data.

「All Plots」のタブには，入力済みの全データが表示されている．
具体的には，全ての地点情報と観察情報である．
また，組成表形式の表も表示される．
これらによって，地点情報や地点間での観察情報の比較ができる．
なお，「All Plots」の表は閲覧のみで，内容の変更は不可．
また，地点が未入力の場合は何も表示されない．

<details>
<img src="img/example_all_plots.png" width="90%">
</details>

All tables in "All Plots" allow the following operations, as well as the tables of plots and occurrence data.

「All Plots」の3つの表のいずれも，地点情報や観察情報の表と同様に以下の操作が可能である．

- Show/hide the table   
- Change table width  
- Show/hide columns   
- Sort rows   
- Search input text   
- 表の表示/非表示   
- 表の幅の設定変更  
- 列の表示/非表示   
- 行の並べ替え   
- テキストデータの検索   

Ssee "Table Display Changes and Operations" for details.

詳細は，「地点情報と観察情報の入力」の「表の表示変更・操作」を参照．

> **Note**   
> "All Plots" data is used for auto-saving. 

> **Note**   
> "All Plots" data is used for auto-saving. 
> 内部的なことではあるが，自動保存機能で保存しているのは「All Plots」のデータである．


# Tools to find species
# 種名ツール

You can search for species names, create and save species name lists.
Species can be input into a PLOT from searched species or species list.
You can use multiple small species lists and a larg species list.

種名の検索，種名リストの作成・保存などができる．
小規模な種名リストを複数および大規模な種名リストを1つ利用可能である．

<details>
<img src="img/tools_list00.png" width="70%">
</details>

## Small species lists
## 小規模な種名リスト

A small list of species names is intended to be displayed all in a screen, about 100 to 200 species.
It is useful to register frequent species.
Multiple species lists can be registered, so you can switch them.
The selected list is displayed in alphabetical order.
Selecting a species displayed in the list allows you to enter it as occurrence data.

小規模な種名リストは，一覧として常に表示できるぐらいの規模，つまり100-200種程度の利用を想定している．
高頻度で出現する種を登録しておくと便利である．
複数を登録できるため，必要に応じて切り替えが可能である．
選択したリストは，アルファベットあるいは50音順で表示される．
表示されたものを選択すると，調査データとして入力できる．

<details>
<img src="img/tools_list02.png" width="70%">
</details>

### Load and register a species list from a file
### ファイルから種名リストの登録

Species names can be registered from a text file (UTF8).
In the text file, enter one species name per line.
Select a file name from the "Choose file" menu to the right of "Add species to list" and click "Open".

種名はテキストファイル(UTF8)から登録可能．
テキストファイルは，1つの種名を1行ごとに入力しておく．
「Add species to list」の右にある「Choose file」でファイル名を選択し，「開く」をクリックする．
テキストファイルの種名がボタン形式で表示される．

When registered as a species list, it will be added in the pull-down menu on the right side of the "Species list".
The list is displayed when selected.

種名リストとして登録すると，「Species list」の右側にあるプルダウンメニュー内に追加される．
リストを選択すると一覧が表示される．

<details>
<summary>

> **Note**   
> The scientific and Japanese names in the following data do not match.

> **Note**   
> 以下の種名の学名と和名は対応していない．

example(abc.txt)

データ例(xyz.txt)

</summary>
Adansonia digitata<br>
Adansonia grandidieri<br>
Adansonia gregorii<br>
Adansonia madagascariensis<br>
Adansonia perrieri
Adansonia rubrostipa<br>
Adansonia suarezensis<br>
Adansonia za<br>
アイ<br>
アイアシ<br>
アイグロマツ<br>
アイズイヌナズナ<br>
アイズシモツケ<br>
アイズスゲ
アイダガヤ<br>
アイダクグ<br>
</details>

> **Warning**   
> LocalStorage of the browser is used to store the species list.
> The information in LocalStorage can be "easily" leaked to others when browsing the site.
> Therefore, personal information should not be stored in the species list (LocalStorage).

> **Warning**   
> 種名リストの保存にはブラウザのLocalStorageを利用している．
> LocalStorage内の情報は，ブラウザでのサイト閲覧時「容易に」他者に漏洩する可能性がある．
> そのため，通常保存することはないはずだが，個人情報等は種名リスト(LocalStorage)には保存するべきではない．

### Delete a species list
### 種名リストの削除

Select a species name list from the pull-down menu to the right of "DELETE" and click the "DELETE" button.

「DELETE」の右側にあるプルダウンメニューから種名リストを選択して「DELETE」ボタンをクリックすると，該当の種名リストが削除される．

<details>
<img src="img/tools_list03.png" width="70%">
</details>


### Use a small species list
### 種名リストの利用

The registered list is displayed as the pull-down menu.
Select the list to use, and the names of the species in the list will be displayed.

登録した小規模な種名リストは，プルダウンメニューに表示される．
使用したいリストを選択すると，そのリストの種名が一覧として表示される．

<details>
<img src="img/tools_list04.png" width="70%">
</details>

Click on a species name button in the list, the name is moved to the upper part of the list as a temporary registration.
The temporary registered species name is not clickable in the species list below.
Clicking on a temporary registered species button cancels the temporary registration.

メニューに表示されている種名ボタンをクリックすると，その種名が仮登録として上の部分に移動する．
仮登録したものは，種名一覧ではクリックできない状態になる．
仮登録した種名ボタンをクリックすると，仮登録がキャンセルされる．

<details>
<img src="img/tools_list05.png" width="70%">
</details>

Change the number to the right of "No. of cols" to change the number of columns displaying the species name.

「No. of cols」の右にある数字を変更すると，種名の表示列数を変更できる．

<details>
<img src="img/tools_list06.png" width="70%">
</details>

Select a PLOT and a layer from the pull-down menu. 
The pull-down menu displays a list of items such as layer.
Species cannot be added to more than one PLOT or layer at one time.
Selecting a PLOT is required, while not layer etc.

仮登録した種名について地点および階層をプルダウンメニューから選択する．
プルダウンメニューには，階層等のリスト形式の項目が表示される．
一度に複数地点・複数階層等には登録できない．
また，地点の選択は必須で，階層等は非必須．

Species names that do not have a species name button can be registered with the text box.
When registering multiple species in the text box, separate them with "," (comma).

種名ボタンのない種名は，テキストボックスから登録可能．
テキストボックスで複数種を登録するときには「,」(半角カンマ)で区切る．

<details>
<img src="img/tools_list08.png" width="70%">
</details>

Click "Add Species to" to add the species name to the occurrence table.
The temporary registered species will be returned to the species list.

「Add Species to」をクリックすると種名が観察情報に追加できる．
種名リストの仮登録の種は，種名一覧に戻る．

When "Include composition" is checked, the names of species that have already been entered for all sites are added to the list of species names and displayed.
Unidentified species (those not checked in "Identified") will be displayed with the name of the site in a format such as "sp8\_biss02".

「Include composition」にチェックを入れると，全地点での入力済の種名が種名一覧に追加されて表示される．
未同定の種名(「Identified」にチェックされていない種)には，「sp8\_biss02」のような形式で地点名が合わせて表示される．

<details>
<img src="img/tools_list07.png" width="70%">
</details>


If you select "sp8\_biss02" and add it to the occurrence table, the existing location name ("biss02" in this example) will automatically be entered in the "SameAs" column.

「sp8\_biss02」を選択して観察情報に追加すると，既出の地点名(この例では「biss02」)が「SameAs」の列にが自動的に入力される．

<details>

</details>


## Large species lists
## 大規模な種名リスト

A large species list is assumed to be 1000 species or more in size.
It is useful to register all species that are likely to occur, although they occur infrequently.
In other words, it is better to register a list of all species in the country or region where you investigate.
Only one species list can be registered, and the file must be reloaded to switch between species.
The list of registered species is not displayed on the screen when it is only loaded.
A list of species that match the search in the text box will be displayed.
Selecting a species displayed allows you to enter it as occurrence data.

大規模な種名リストは，1000種あるいはそれ以上の規模を想定している．
出現頻度は低いが，出現する可能性のある種名を全て登録しておくと便利である．
つまり，使用する国や地域の全種の一覧を登録しておくのが良い．
1つしか登録できず，切り替えにはファイルの再読み込みが必要である．
登録種の一覧は画面上には表示されない．
テキストボックスで検索して，合致した種の一覧が表示される．
表示された種を選択すると，調査データとして入力できる．


### Register a large species list
### 種名リストの登録

Species names can be registered from a text file (UTF8).
In the text file, enter one species name per line.
Select a file name from the "Choose file" menu to the right of "Add species to list" and click "Open".

種名はテキストファイル(UTF8)から登録可能．
テキストファイルは，1つの種名を1行ごとに入力しておく．
「Add species to list」の右にある「Choose file」でファイル名を選択し，「開く」をクリックする．

<details>
<img src="img/tools_list10.png" width="70%">
</details>

Only one large list of species names can be registered, so when a new one is registered, the old one is deleted.

大規模な種名リストは1つしか登録できないため，新しいものを登録すると古いものは削除される．

### Search species from a large list
### 種名の検索

A large species list can be searched by text string.
Enter a search string in the text box labeled "Input text" and click "Search" to display a button with the name of the species that matches the search results.
If there are more than 200 matches, a pop-up window will appear with the warning "Over 200 matches, showing 200 matches" and only the first 200 matches will be displayed.

大規模な種名リストは，文字列の検索が可能である．
「Input text」と薄く表示された検索用のテキストボックスに検索文字列を入力して「Search」をクリックすると，検索結果に合致する種が種名のボタンとして表示される．
合致したものが200種を超える場合は，「Over 200 matches, showing 200 matches」という警告がポップアップ画面で表示され，最初の200種のみが表示される．

<details>
<img src="img/tools_list12.png" width="70%">
</details>


Multiple character strings separated by spaces can be entered to narrow down the search (more than three items can be searched).
In other words, a search for "aaa bbb" will display only those matching the words "aaa" and "bbb".
If the search text box is left blank and "Search" is clicked, the search results will be reset and the species name button will disappear.

複数の文字列をスペースで区切って入力すると，絞り込み検索が可能である(3項目以上でも検索可能)．
つまり，「アイ ガヤ」で検索すると，「アイ」かつ「ガヤ」に合致するものだけが表示される．
検索のテキストボックスを空欄にして「Search」をクリックすると，検索結果がリセットされて種名のボタンが消える．

<details>
<img src="img/tools_list09.png" width="70%">
</details>


The input method for the occurrence data is the same as for the small species list.

調査データへの入力方法は，小規模リストと同様である．


# Inport data into R
# Rでのデータの取り込み

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
