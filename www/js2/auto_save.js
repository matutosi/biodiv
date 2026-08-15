// Rows of a table as an array, without the second row (the hide buttons).
function getTableDataAsArray(id_table){
  var data = table2array(id_table, false);
  var data_array =[];
  for(let i=0; i<data.length; i++){
    if(i !== 1){ // skip delete button
      data_array.push(data[i]);
    }
  }
  return data_array;
}

// Save the plot data and the occurrence data as two TSV files.
function saveAllTableDataAsCSV(){
  var occ  = getTableDataAsArray('occ_all_tb');
  var plot = getTableDataAsArray('plot_all_tb');
  saveArrayToTsv(occ,  "biss_" + getNow() +  "_occ.tsv");
  saveArrayToTsv(plot, "biss_" + getNow() + "_plot.tsv");
}

// The plot data and the occurrence data as one JSON string.
function getAllPlotOccDataAsJSON(){
  var plot = getTableData( document.getElementById('plot_all_tb') );
  var occ  = getTableData( document.getElementById('occ_all_tb' ) );
  // need Object.assign({}, obj)
  var data = { plot: Object.assign({}, plot.biss_inputs), occ: Object.assign({}, occ.biss_inputs) }
  var json = JSON.stringify(data);
  return json;
}

// 
function autoSave(){
  var json = getAllPlotOccDataAsJSON();
  var f_name = 'biss_' + getNow() + '.json';
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);  //set encoding UTF-8 with BOM
  var blob = new Blob([bom, json], { "type" : "text/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = f_name;
  a.href = url;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Restart the auto save timer with the interval just selected.
function changeAutoSaveSttting(obj){
  var n = obj.value;
  if(typeof timerId === 'undefined'){
    setAutoSave(Number(n));
  }else{
    clearInterval(timerId);
    if(n === 'no save'){
      return void 0;
    }else{
      setAutoSave(Number(n));
    }
  }
}

// Save every n minutes from now on.
function setAutoSave(n){
  var min = 1000 * 60; // 1 min: 1000ms * 60sec
  // timerId: set as global object
  timerId = setInterval(autoSave, n * min );
}
