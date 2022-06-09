// // // // // // // // // // // // // // // // // // // // // // // // 
// 
// https://webparts.cman.jp/table/download/
// 
// うまく動いていない
//    csv, tsvの両方に対応させる
//    ファイル，クリップボードの両方に対応させる
// 
// // // // // // // // // // // // // // // // // // // // // // // // 



<script type="text/javascript">
function tableClick(argMethod, argForm) {
 // ====================================================
 //  テーブル内容をクライアントに保存
 //   引数1 : 'file'-ファイルへダウンロード
 //           その他-クリップボードへ保存
 //   引数2 : 'comma'-カンマ区切り、その他-タブ区切り
 // ====================================================
  var wResult = false;
  var wMsg    = "";
  // --- メッセージの初期化 --------------------------
  var wObjMsg = document.getElementById('msgArea');
  wObjMsg.style.display = 'none';
  // --- TABLE内容をテキストに変換 -------------------
  var wDownloadString = table_To_text(argForm);
  // --- クリップボードに保存 ------------------------
  if(argMethod == "file"){
    wResult = fileDownload(wDownloadString);
    if(wResult){
      wMsg = 'クライアントにダウンロードしました。';
    }else{
      wMsg = 'ダウンロードに失敗しました。';
    }
  }
  // --- ファイルでダウンロード ----------------------
  else{
    wResult = clipboardCopy(wDownloadString);
    if(wResult){
      wMsg = 'クリップボードに保存しました。<br>Excelやメモ帳に貼り付けてください。';
    }else{
      wMsg = 'クリップボードに保存に失敗しました。';
      }
  }
  // --- 結果メッセージを表示 ------------------------
  wObjMsg.innerHTML = wMsg;
  if(wResult){
     wObjMsg.className = "rcOk";
  }else{
     wObjMsg.className = "rcError";
  }
  wObjMsg.style.display = '';
}
function table_To_text (argForm) {
 // ====================================================
 //  テーブル内容を、テキストに変換
 //   引数： 'comma'-カンマ区切り、その他-タブ区切り
 // ====================================================
  var wRcString = "";
  var wTABLE    = document.getElementById("tableArea");
  var wTR       = wTABLE.rows;
  // --- 行を繰り返す ----------------------------------
  for(var i=0; i < wTR.length; i++){
    var wTD      = wTABLE.rows[i].cells;
    var wTR_Text = "";
    // --- 列を繰り返す --------------------------------
    for(var j=0; j < wTD.length; j++){
      // --- カンマ区切りの場合 ------------------------
      if(argForm == "comma"){
        if(wTR_Text != ""){wTR_Text += ",";}
        wTR_Text += '"' + wTD[j].innerText.replace( new RegExp('"', 'g'), '""') + '"';
      }
      // --- カンマ区切りの場合 ------------------------
      else{
        if(wTR_Text != ""){wTR_Text += "\t";}
        wTR_Text += wTD[j].innerText;
      }
    }
    // --- 行単位に改行を入れる ------------------------
    wRcString += wTR_Text + "\r\n";
  }
  // --- 編集したテキストを返す ------------------------
  return wRcString;
}
function clipboardCopy (argText) {
 // ====================================================
 //  クリップボードへコピー
 //   引数：クリップボードにコピーするテキスト
 // ====================================================
 // --- コピーのためのtextareaを一時的に作成 -----------
 //     透明で作成するので、画面上は見えない
  var tempText            = document.createElement("textarea");
  tempText.value          = argText;
  tempText.style.position = "fixed";
  tempText.style.opacity  = "0";
  document.body.appendChild(tempText);
  // --- textareaを選択 --------------------------------
 tempText.select();
  // --- クリップオードへコピー ------------------------
  var rcCopy = document.execCommand('copy');
  // --- 作成したtextareaを消す ------------------------
  document.body.removeChild(tempText);
  // --- 成功:true , 失敗:false ------------------------
  return rcCopy;
}
function fileDownload (argText) {
 // ====================================================
 //  ファイルに保存
 //   引数：ファイルに保存するテキスト
 // ====================================================
  try {
    // --- Excelに対応するために、BOMを付ける ----------
    var wBom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var wBlob = new Blob([ wBom, argText ], {type: 'text/plain'});
    if (window.navigator.msSaveBlob) { 
      window.navigator.msSaveOrOpenBlob(wBlob, "test.csv");     // IE
    }else{
      document.getElementById("downloadButton").href = window.URL.createObjectURL(wBlob);
    }
  }catch (e){
    return false;
  }
  return true;
}
</script>
