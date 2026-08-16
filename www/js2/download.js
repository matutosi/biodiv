// Save a string as a file (UTF-8 with BOM) through a click on a hidden link.
//   @param strings    A string, the content of the file.
//   @param file_name  A string, the name to save it under.
//   @param type       A string, the MIME type of the blob.
function downloadStrings(strings, file_name, type = "text/tsv"){
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);  //set encoding UTF-8 with BOM
  const blob = new Blob([bom, strings], { "type" : type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = file_name;
  a.href = url;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


// Helper for getInputData()
//    @param table      A table element.
//    @param c_names  A string of column name to get options in select element.
//    @return            An array of select options.
function getSelectOne(table, col_name){
  // var table = document.getElementById('flora_plot_tb'); var col_name = "value";
  const col_no = getColNames(table).indexOf(col_name);
  if(col_no < 0){ return []; }  // no col_name
  const options = firstDataRow(table).cells[col_no].firstChild.options;
  const sel_opt = [];
  for(const option of options){
    sel_opt.push(option.innerText);
  }
  return sel_opt;
}
