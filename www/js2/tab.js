function changeTab(){
  var targetid = this.href.substring(this.href.indexOf('#')+1,this.href.length);
  // show delected tab
  for(var i = 0; i < pages.length; i++) {
    if( pages[i].id != targetid ) {
      pages[i].style.display = "none";
    }
    else {
      pages[i].style.display = "block";
    }
  }
  // show front
  for(var i = 0; i < tabs.length; i++) {
    tabs[i].style.zIndex = "0";
  }
  this.style.zIndex = "10";

  // needs not to move tab
  return false;
}

function updateTab(){
  // get elements
  var tabs = document.getElementById('tabcontrol').getElementsByTagName('a');
  var pages = document.getElementById('tabbody').getElementsByTagName('div');
  // when clicked, enable to run changeTab() in all tab
  for(var i = 0; i < tabs.length; i++) {
    tabs[i].onclick = changeTab;
  }
}

function addPlotId(plot_data, id){
  // var plot_data = temp1;
  plot_data['biss_c_names'].unshift('PLOT');
  plot_data['biss_d_types'].unshift('fixed');
  plot_data['biss_selects'].unshift('');
  plot_data['biss_inputs']['PLOT'] = [id];
  return plot_data;
}

function addPlotNo(plot_data, no){
  // var plot_data = temp1;
  plot_data['biss_c_names'].unshift('NO');
  plot_data['biss_d_types'].unshift('fixed');
  plot_data['biss_selects'].unshift('');
  plot_data['biss_inputs']['NO'] = [no];
  return plot_data;
}

function getPlotMaxNo(){
  var tables = document.querySelectorAll("table[id^='input_plot']");
  var max_no = [0];
  for(tb of tables){
    max_no.push(getColData(tb, "NO")[0]);
  }
  return Math.max.apply(Math, string2Numeric(max_no));
}

// Add a tab
//   in progress
function addTab(obj){
  // input PLOT name
  var id = prompt("Input PLOT name", "");
  if(null !== document.getElementById(id)){
    alert(id + " is already exist. PLOT should NOT be DUPLICATED !");
    return void 0; 
  }
  // create tabcontrol
  var a = crEl({ el: 'a', ats: {href: "#" + id}, ih: id });
  document.getElementById('tabcontrol').insertBefore(a, obj);

  // create tabbody
  var tabbody = document.getElementById('tabbody');
  var div = crEl({ el: 'div', ats: {id: id} });
  tabbody.appendChild(div);

  // create input tables
      // PLOT
  var plot_setting = convertTableData( getTableData( document.getElementById("setting_plot_tb")));
  var plot_setting = addPlotNo(plot_setting, getPlotMaxNo() + 1);
  var plot_setting = addPlotId(plot_setting, id);
      // OCC
  var occ_setting  = convertTableData( getTableData( document.getElementById("setting_occ_tb" )))
  var occ_setting  = addPlotId(occ_setting, id);
  // console.log(occ_setting );
  div.appendChild( tableModule({
                      table_data: plot_setting, ns: 'input_plot_' + id, 
                      id_text: true, 
                      hide_button: true, fit_button: true }) );
  document.getElementById('input_plot_' + id + '_fit').onclick();
  div.appendChild( tableModule({
                      table_data: occ_setting, ns: 'input_occ_' + id, 
                      id_text: true, search_input: true,
                      hide_button: true, fit_button: true, 
                      add_button: true, calc_button: true}) );
  document.getElementById('input_occ_' + id + '_nrow').value = 3;
  document.getElementById('input_occ_' + id + '_add_rows').onclick();
  updateTab();
  tabs[tabs.length - 1].onclick();  // move tab
  setSortable('input_occ_' + id + '_tb');  // Should setSortable() after appendChild()
}

function updateAllInputsTables(obj){
  var plots = document.querySelectorAll("table[id^='input_plot']");
  var occs  = document.querySelectorAll("table[id^='input_occ']");
  var pl_c_names = [];
  var oc_c_names = [];
  for(let i = 0; i < plots.length; i++) {
    var pl_c_names = pl_c_names.concat(getColNames(plots[i]));
    var oc_c_names = oc_c_names.concat(getColNames(occs[i] ));
  }
  var pl_c_names = uniq(pl_c_names);
  var oc_c_names = uniq(oc_c_names);

  // editing now
  // no need cols: DELETE DATE UPDATE_TIME_GPS

  var pl_inputs = [];
  for(c_name of pl_c_names){
    pl_inputs[c_name] = [];
    for(pl of plots){
      pl_inputs[c_name] = pl_inputs[c_name].concat(getColData(pl, c_name));
    }
  }
  var oc_inputs = [];
  for(c_name of oc_c_names){
    oc_inputs[c_name] = [];
    for(oc of occs){
      oc_inputs[c_name] = oc_inputs[c_name].concat(getColData(oc, c_name));
    }
  }
  var pl_d_types = []; for(let i = 0; i <pl_c_names.length; i++){ pl_d_types.push('fixed'); }
  var pl_selects = []; for(let i = 0; i <pl_c_names.length; i++){ pl_selects.push(''); }
  var pl_data = {
    biss_c_names: pl_c_names,
    biss_d_types: pl_d_types,
    biss_selects: pl_selects,
    biss_inputs : pl_inputs
  }

  var oc_d_types = []; for(let i = 0; i <oc_c_names.length; i++){ oc_d_types.push('fixed'); }
  var oc_selects = []; for(let i = 0; i <oc_c_names.length; i++){ oc_selects.push(''); }
  var oc_data = {
    biss_c_names: oc_c_names,
    biss_d_types: oc_d_types,
    biss_selects: oc_selects,
    biss_inputs : oc_inputs
  }

  // var table_data_jo = oc_data;
  var all_pl_table = makeTableJO(pl_data, 'pl_all');
  var all_oc_table = makeTableJO(oc_data, 'oc_all');

  document.getElementById('pl_all').replaceWith(all_pl_table);
  document.getElementById('oc_all').replaceWith(all_oc_table);
  setSortable("pl_all");
  setSortable("oc_all");
}

function changePlotName(obj){
  var new_name = obj.previousElementSibling.value;
 // var old_name = obj.parentNode.
  // change tab name
  //   document.getElementById('tabcontrol').insertBefore(a, obj);
  //   document.getElementById('tabbody').appendChild(div);
  // 

  //   var document.
  
}

