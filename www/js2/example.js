function showExample(obj){

  // select settings: '_5_layers'
  changeSettingsByName('_5_layers');
  // delete 'rank' and 'abundance'
  document.querySelector("#_5_layers_occ_tb > tr:nth-child(7) > td:nth-child(4) > input[type=button]").click()
  document.querySelector("#_5_layers_occ_tb > tr:nth-child(7) > td:nth-child(4) > input[type=button]").click()

  // add plots
  addInputTab({ obj:document.getElementById('add_tab'), id:'biss01' });
  addInputTab({ obj:document.getElementById('add_tab'), id:'biss02' });

  // sample occ
  var tb_1 = document.getElementById('input_occ_biss01_tb');
  var tb_2 = document.getElementById('input_occ_biss02_tb');
  layers     = ['T1','T2','S1','S2','H'];
  species    = ['sp1','sp2', 'sp3','sp4','sp5','sp7','sp8','sp9'];
  identified = ['checked'];
  addSampleOcc(tb_1, 6, layers, species, identified)
  addSampleOcc(tb_2, 5, layers, species, identified)

  // delete default data
  for(let i = 1; i < 5; i++){ tb_1.rows[2].cells[1].firstChild.click(); }
  for(let i = 1; i < 5; i++){ tb_2.rows[2].cells[1].firstChild.click(); }

  // update "all inputs tables" and "input species list"
  var sp_nara   = grepArray(wamei, /ナラ/);
  var sp_buna   = grepArray(wamei, /ブナ/);
  var sp_kusu   = grepArray(wamei, /クス/);
  var sp_tabu   = grepArray(wamei, /タブ/);
  var sp_kaya   = grepArray(wamei, /カヤ/);
  var sp_susuki = grepArray(wamei, /ススキ/);
  addSLinLS(sp_nara  , 'nara');
  addSLinLS(sp_buna  , 'buna');
  addSLinLS(sp_kusu  , 'kusu');
  addSLinLS(sp_tabu  , 'tabu');
  addSLinLS(sp_kaya  , 'kaya');
  addSLinLS(sp_susuki, 'susuki');

  // all update
  updateInputsPlotLayerSpecies()

  tabs[tabs.length - 2].onclick();  // move tab

  obj.remove();
}

function addSampleOcc(plot, n ,layers, species, identified){
  var ly = randSample(n, layers,  false);
  var sp = randSample(n, species, false);
  var cv = randInt(n-1, 100).concat(['']);
  var cv = randSort(cv);
  var id = randSample(n-1, identified, false).concat(['']);
  var id = randSort(id);
  for(let i = 0; i<n; i++){
    addRowWithValues({ table: plot, values:{ Layer: ly[i], Species:sp[i], Cover:cv[i], Identified: id[i] } }); 
  }
}
