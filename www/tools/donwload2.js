// https://phper.pro/352
// 一応動く

function getNow(){
   var now = new Date();
   const yr  = now.getFullYear();
   const mo  = String(now.getMonth()).padStart(2, `0`);
   const dd  = String(now.getDate()).padStart(2, `0`);
   const hh  = String(now.getHours()).padStart(2, `0`);
   const mi  = String(now.getMinutes()).padStart(2, `0`);
   const ss  = String(now.getSeconds()).padStart(2, `0`);
   document.write(`${yr}_${mo}_${dd}_${hh}_${mi}_${ss}.tsv`)
}


//CSV出力＆ダウンロード
function handleDownload() {
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]); //文字コードをBOM付きUTF-8に指定
  var table = document.getElementById('table1'); //id=table1という要素を取得
  var data_tsv=""; //ここに文字データとして値を格納していく

  for(var i = 0;  i < table.rows.length; i++) {
    for(var j = 0; j < table.rows[i].cells.length; j++) {
      data_tsv += table.rows[i].cells[j].innerText; //HTML中の表のセル値をdata_tsvに格納
      if(j == table.rows[i].cells.length-1) data_tsv += "\n"; //行終わりに改行コードを追加
      else data_tsv += "\t"; //セル値の区切り文字として\tを追加
    }
  }

  var blob = new Blob([ bom, data_tsv], { "type" : "text/tsv" }); //data_tsvのデータをtsvとしてダウンロードする関数
  //     if (window.navigator.msSaveBlob) { //IEの場合の処理
  //       window.navigator.msSaveBlob(blob, "test.tsv");
  //     // window.navigator.msSaveOrOpenBlob(blob, "test.tsv");// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
  //   } else {
  //     document.getElementById("download").href = window.URL.createObjectURL(blob);

  objUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objUrl;
  link.download = getNow();
  link.click();

  delete data_tsv; //data_tsvオブジェクトはもういらないので消去してメモリを開放
}
