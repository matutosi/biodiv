// https://phper.pro/352

function getNow(){
   var now = new Date();
   const yr  = now.getFullYear();
   const mo  = String(now.getMonth()).padStart(2, `0`);
   const dd  = String(now.getDate()).padStart(2, `0`);
   const hh  = String(now.getHours()).padStart(2, `0`);
   const mi  = String(now.getMinutes()).padStart(2, `0`);
   const ss  = String(now.getSeconds()).padStart(2, `0`);
   return(`${yr}_${mo}_${dd}_${hh}_${mi}_${ss}.tsv`)
}


window.addEventListener('load', () => {
  const download_button = document.getElementById('download');
  download_button.addEventListener('click', download_button_clicked);
});

function download_button_clicked(evt) {
  evt.preventDefault();
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);  //set encoding UTF-8 with BOM
  var table = document.getElementById('table1'); //get "id = table1"
  var data_tsv = "";                             // data_tsv is data holder

  for(var i = 0;  i < table.rows.length; i++) {
    for(var j = 0; j < table.rows[i].cells.length; j++) {
      data_tsv += table.rows[i].cells[j].innerText;           // save data in cellls
      if(j == table.rows[i].cells.length-1) data_tsv += "\n";  // add line break
      else data_tsv += "\t";                                   // add "\t" as separater
    }
  }

  var blob = new Blob([ bom, data_tsv], { "type" : "text/tsv" });  // download tsv data from data_tsv
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = getNow();
  a.href = url;
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
  delete data_tsv;
}
