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

function changePlotName(obj){
  var new_name = obj.previousElementSibling.value;
 // var old_name = obj.parentNode.
  // change tab name
  //   document.getElementById('tabcontrol').insertBefore(a, obj);
  //   document.getElementById('tabbody').appendChild(div);
  // 

  //   var document.
  
}

