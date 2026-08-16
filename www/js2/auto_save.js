// Rows of a table as an array, without the second row (the hide buttons).
function getTableDataAsArray(id_table){
  const data = table2array(id_table, false);
  const data_array =[];
  for(let i=0; i<data.length; i++){
    if(i !== 1){ // skip delete button
      data_array.push(data[i]);
    }
  }
  return data_array;
}

// Save the plot data and the occurrence data as two TSV files.
function saveAllTableDataAsCSV(){
  const occ  = getTableDataAsArray('occ_all_tb');
  const plot = getTableDataAsArray('plot_all_tb');
  saveArrayToTsv(occ,  "biss_" + getNow() +  "_occ.tsv");
  saveArrayToTsv(plot, "biss_" + getNow() + "_plot.tsv");
}

// The plot data and the occurrence data as one JSON string.
function getAllPlotOccDataAsJSON(){
  const plot = getTableData( document.getElementById('plot_all_tb') );
  const occ  = getTableData( document.getElementById('occ_all_tb' ) );
  const data = { plot: plot.biss_inputs, occ: occ.biss_inputs }
  const json = JSON.stringify(data);
  return json;
}

// Write the input data out as a JSON file, without asking.
function autoSave(){
  downloadStrings(getAllPlotOccDataAsJSON(), 'biss_' + getNow() + '.json', "text/json");
}

// The handle of the auto save timer, or undefined while nothing is scheduled.
//   Read by changeAutoSaveSttting(), written by setAutoSave().
let timerId;

// Restart the auto save timer with the interval just selected.
function changeAutoSaveSttting(obj){
  const n = obj.value;
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
  const min = 1000 * 60; // 1 min: 1000ms * 60sec
  timerId = setInterval(autoSave, n * min );
}
