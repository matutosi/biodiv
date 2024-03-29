// TODO: write documents


// Create input table module
//   In a module has a table and other input elements, 
//   which operate the table.
// @param ns    A string to specify input table module.
// @param table A table element.
// @retrun  A span including a table and other elements.
function inputTableModule(ns, table = null){
  // Up span
  var up = crEl({ el:'span', ats:{id: "up_" + ns} });
  up.appendChild( crEl({ el: 'B', tc: ns}) );
  up.appendChild( createSearchInput() );
  up.appendChild( createSaveInputButton() );
  up.appendChild( createShortTable() ); 
  up.appendChild( createHideButton() );
  up.appendChild( crEl({ el: 'br' }) );
  up.appendChild( crEl({ el: 'span'}) );

  // Table
  if(table === null){ var table = restoreTable(ns, ""); }

  // Down span
  var dn = crEl({ el:'span', ats:{id: "dn_" + ns} });
  dn.appendChild( createNrowInput() );
  dn.appendChild( createAddRowButton() );

  var occ = ns.split("_")[1] === "occ";
  if(occ){
    dn.appendChild( crEl({ el: 'br' }) );
    dn.appendChild( crEl({ el: 'span', ih: "<b>Value: </b>" }) );
    dn.appendChild( createSelectOpt( colByType(table, "number") ) );
    dn.appendChild( crEl({ el: 'span', ih: "; <b>Group: </b>" }) );
    dn.appendChild( createSelectOpt( colByType(table, "list") ) );
    dn.appendChild( createSumButton() );
  }

  // Main
  var main   = crEl({ el:'span', ats:{id: "main_"   + ns} });
  main.appendChild(up);
  main.appendChild(table);
  main.appendChild(dn);
  main.appendChild( crEl({ el: 'hr' }) );

  return main;
}

// Create setting table module
//   In a module has a table and other input elements, 
//   which operate the table.
// @param ns    A string to specify input table module.
// @retrun  A span including a table and other elements.
function settingTableModule(ns){
  // var ns = "occ_input_table_example_01";
  var main  = crEl({ el:'span', ats:{id: "main_"   + ns} });

  // Up span
  var up = crEl({ el:'span', ats:{id: "up_" + ns} });
  up.appendChild( crEl({ el: 'B', tc: ns}) );
  up.appendChild( crEl({ el: 'br' }) );

  up.appendChild( crEl({ el: 'span', ih: "<b>Load settings: </b>" }) );
  up.appendChild( createFileButton() );

  up.appendChild( createInput({ type: "text", placeholder: "File name" }) );
  up.appendChild( createSaveSettingButton() );

  up.appendChild( createHideButton() );
  up.appendChild( crEl({ el: 'br' }) );
  up.appendChild( crEl({ el: 'span'}) );
  main.appendChild(up);

  // Table
  var table = restoreTable(ns, "");

  // Down span
  var dn = crEl({ el:'span', ats:{id: "dn_" + ns} });
  dn.appendChild( createNrowInput() );
  dn.appendChild( createAddRowButton() );

  var plot = (ns.split("_")[1] === 'PLOT');
  if(plot){ dn.appendChild( createMakePlotButton() );}  

  main.appendChild(up);
  main.appendChild(table);
  main.appendChild(dn);
  main.appendChild( crEl({ el: 'hr' }) );

  return main;
}


// Create occurrence table module
//   @param obj  A input element.
//                 Normally use "this". 
//   @retrun  A span including a table and other elements.
function makeNewOccTableModule(obj){
  var table = makeNewOccTable(obj);
  if(table === null){ return void 0 ;}  // no table
  var module = inputTableModule(table.id, table = table);
  var tab_inputs = document.getElementById("tab_inputs");
  tab_inputs.appendChild(module);
  setSortable(table.id);
  obj.setAttribute("disabled", true)
}

// Helper for makeNewOccTableModule()
//   @param obj  A input element.
//                 Normally use "this". 
//   @retrun  A table element.
function makeNewOccTable(obj){
  // var obj = temp1;
  var tr = obj.parentElement.parentElement;
  var table = obj.parentElement.parentElement.parentElement;
  var c_no = getColNames(table).indexOf("PLOT");
  var plot = tr.cells[c_no].firstChild.value;
  if(plot === ""){
    alert("Input PLOT!");
    return null;
  }
  if(hasDupPlot(plot)){ return null;}
  // create new input table for occurrence and appendChild()
  var tab_settings = document.getElementById("tab_settings");
  var setting_table = tab_settings.querySelectorAll("table")[1];
  var table = makeOccTable(setting_table, plot);
  return table;
}

// Make plot input module
//   @param obj  A input element.
//                 Normally use "this". 
//   @retrun  A plot input module and change input tab.
function makePlotInputModule(obj){
  var table = makePlotTable(obj);
  var module = inputTableModule(table.id, table);
  var tab_inputs = document.getElementById("tab_inputs");
  tab_inputs.appendChild(module);
  setSortable(table.id);  // Should setSortable() after appendChild()
  shortTable(table.previousElementSibling.children[3])  // Short table
  tabs[1].click();        // move to tab_inputs
}

// Helper for makeNewOccTableModule() and makeNewOccTable()
//   @param setting_table  A setting table
//   @param plot           A string to specify a plot name
//   @return  A occurrence table
function makeOccTable(setting_table, plot){
  var setting_c_names = getColNames(setting_table);
  var c_names = getColData(setting_table, setting_c_names[0]);
  var d_types = getColData(setting_table, setting_c_names[1]);
  var selects = getColData(setting_table, setting_c_names[2]);
  var id_table = setting_table.id.replace("setting", "input");
  var old_plot = id_table.split("_")[2];
  id_table = id_table.replace(old_plot, plot);

  var table = crEl({ el: 'table', ats: {id: id_table} });

  // th: colnames
  const n_col = c_names.length;
  var tr = document.createElement('tr');
  tr.appendChild( crEl({ el: 'th', ih: "PLOT" }) );
  for(let Ni = 0; Ni < n_col; Ni++){
    if(c_names[Ni] !== ""){
      var th = crEl({ el: 'th', ih: c_names[Ni] });
      tr.appendChild(th);
    }
  }
  table.appendChild(tr)

  // td: hide buttons
  var tr = document.createElement('tr');
  for(let Ni = 0; Ni < n_col + 1; Ni++){
    if(c_names[Ni] !== ""){
      var td = crEl({ el: 'td', ih: "" });
      td.appendChild( crEl({ el: 'input', ats:{type:"button", value:"Hide", onclick:"hideTableCol(this)"} }) ); 
      tr.appendChild(td);
    }
  }
  table.appendChild(tr)


  // td: data
  var tr = document.createElement('tr');
  var td = crEl({ el: 'td' })
  tr.appendChild( crEl({ el: 'td', ih: plot }) );
  for(let i = 0; i < c_names.length; i++){
    if(setting_c_names[i] !== ""){
      var td = createInputTd(d_types[i], c_names[i], selects[i]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

// Helper for makePlotInputModule(
//   @param obj  A input element.
//                 Normally use "this". 
//   @return  A plot table
function makePlotTable(obj){
  var setting_table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  var setting_c_names = getColNames(setting_table);
  var c_names = getColData(setting_table, setting_c_names[0]);
  var d_types = getColData(setting_table, setting_c_names[1]);
  var selects = getColData(setting_table, setting_c_names[2]);
  var id_table = setting_table.id.replace("setting", "input");
  var table = crEl({ el: 'table', ats: {id: id_table} });

  // th: colnames
  const n_col = c_names.length;
  var tr = document.createElement('tr');
  var th = crEl({ el: 'th', ih: "Make" });
  tr.appendChild(th);
  for(let Ni = 0; Ni < n_col; Ni++){
    if(c_names[Ni] !== ""){
      var th = crEl({ el: 'th', ih: c_names[Ni] });
      tr.appendChild(th);
    }
  }
  table.appendChild(tr)

  // td: hide buttons
  var tr = document.createElement('tr');
  for(let Ni = 0; Ni < n_col + 1; Ni++){
    if(c_names[Ni] !== ""){
      var td = crEl({ el: 'td', ih: "" });
      td.appendChild( crEl({ el: 'input', ats:{type:"button", value:"Hide", onclick:"hideTableCol(this)"} }) ); 
      tr.appendChild(td);
    }
  }
  table.appendChild(tr)

  // td: data
  var tr = document.createElement('tr');
  var td = crEl({ el: 'td' })
  td.appendChild( createNewOccButton() );
  td.appendChild( createHideRowButton("plot info") );
  tr.appendChild( td );
  for(let i = 0; i < n_col; i++){
    if(c_names[i] !== ""){
      var td = createInputTd(d_types[i], c_names[i], selects[i]);
      tr.appendChild(td);
    }
  }
  table.appendChild(tr);
  return table;
}

// Helper for makeOccTable() and makePlotTable()
//   td is basic element, createInputTd() create 
//   from data type, column name, and  optional.
//   @param dat_type  A string to specify data type.
//   @param col_name  A string to specify column name.
//   @param optional  A string to specify optional.
//   @return  A td element
function createInputTd(dat_type, col_name, optional){
  // console.log(dat_type);
  // console.log(col_name);
  // console.log(optional);
  var td = document.createElement('td');
  //   var col_name = col_name.toLowerCase();
  switch(dat_type){
    case "auto": // date, no, GPS
      if(col_name === "DATE")   td.innerHTML = getNow();
      if(col_name === "LOC_LAT") td.innerHTML = getLat();
      if(col_name === "LOC_LON") td.innerHTML = getLon();
      if(col_name === "LOC_ACC") td.innerHTML = getAcc();
      if(col_name === "NO")     td.innerHTML = 1;
      break;
    case "button": // DELETE, update button
      if(col_name === "DELETE")   { td.appendChild( createDelButton() );    };
      if(col_name === "UPDATE_TIME_GPS"){ td.appendChild( createUpdateButton() ); };
      break;
    case "fixed":
      if(optional === ""){ 
//        alert("Fixed columns should be input!");
        var optional = "NO INPUT";
      }
      td.innerHTML = optional;
      break;
    case "checkbox":
    case "text":
      td.appendChild(createInput({ type: dat_type }));
      break;
    case "number":
      td.appendChild(createInput({ type: dat_type, inputmode: "numeric", min: "0"} ));
      break;
    case "list":
      arry_list = optional.split(':').concat(Array(""));
      td.appendChild(createSelectOpt(arry_list, arry_list.length - 1));
      break;
  }
  return td;
}

// DONE: update date GPS

// Update "DATE", "LOC_LAT", "LOC_LON", "LOC_ACC"
//    When "Update" bottun clicked, update informations in the row.
//    @param obj Clicked row.
//    @return null.
function updateTimeGPS(obj){
  // settings
  var cols = ["DATE", "LOC_LAT", "LOC_LON", "LOC_ACC"];
  var funs = [getNow, getLat, getLon, getAcc]
  // clicked things
  var table = obj.parentNode.parentNode.parentNode;
  var tr = obj.parentNode.parentNode;
  var row_no = tr.sectionRowIndex;
  // update
  for(let i = 0; i < cols.length; i++){
    var col_no = getColNames(table).indexOf(cols[i]);
    var cell = table.rows[row_no].cells[col_no];
    cell.innerHTML = funs[i]();
  }
}

// DONE: 

// Sum numeric with groups.
//     In BISS, number input is the subject to sum, 
//     list input is the options to group.
//   @param obj  A input element.
//                 Normally use "this". 
function sumWithGroup(obj){
  var array = obj.previousElementSibling.previousElementSibling.previousElementSibling.value;
  var group = obj.previousElementSibling.value;
  var table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  var array_val = getColData(table, array);
  var group_val = getColData(table, group);
  var grouped_array = splitByGroup(array_val, group_val);
  // set groups order with 'list'
  var c_no = getColNames(table).indexOf(group);
  var opts = table.rows[2].cells[c_no].firstChild.options;
  var groups = [];
  for(let o of opts){ groups.push(o.value); }
  var sum_array = [];
  for(let i = 0; i < groups.length; i++){ sum_array[groups[i]] = 0; }
  for(let i = 0; i < groups.length; i++){
    if(grouped_array[groups[i]] !== void 0){
      var gr_ar = grouped_array[groups[i]];
      for(let j = 0; j < gr_ar.length; j++){
        sum_array[groups[i]] += Number(gr_ar[j]);
      }
    }
  }
  for(let i = 0; i < groups.length; i++){
    sum_array[groups[i]] = Math.round(sum_array[groups[i]] * 10000) / 10000;  // avoid dicimal error
    if(sum_array[groups[i]] === 0){ delete sum_array[groups[i]]; }
  }
  sum = hash2table(sum_array);
  // add th
  var tr = document.createElement('tr');
  tr.appendChild( crEl({ el: 'th', tc: group }) );
  tr.appendChild( crEl({ el: 'th', tc: array }) );
  sum.insertBefore(tr, sum.firstChild);
  // Show sum
  if(obj.parentNode.lastElementChild === obj){
    obj.parentNode.appendChild(sum);
  } else {
    obj.parentNode.replaceChild(sum, obj.parentNode.lastElementChild);
  }
}



// DONE: utils ???
//    @param table  A table element.
//    @param type   A string to specify a data type, 
//                    which can be retrive by getDataTypes() as shown below.
//                    "fixed", "text", "button", "checkbox", 'list','number'. 
//    @return  A string array.
//    @examples
function colByType(table, type){
  var types = getDataTypes(table);
  var c_names = getColNames(table);
  var cols = [];
  for(let i = 0; i < types.length; i++){
    if(types[i] === type){ cols.push(c_names[i]); }
  }
  return cols;
}

// Create td with a child element. 
//    @param child A child element.
//    @return  A td element with a child element
function createTdWithChild(child){
  var td = document.createElement('td');
  td.appendChild(child);
  return td;
}

// Helper to create input with select options
//    when selected_no is given, 
//    its <option> (start with 0) will be set as "selected".
function createSelectOpt(list, selected_no = 0){
  const n_list = list.length;
  var select = document.createElement('select');
  for(let j = 0; j < n_list; j++){
    var option = document.createElement('option');
    if(selected_no === j){ option.setAttribute('selected', 'true'); }
    option.innerHTML = list[j];
    select.appendChild(option);
  }
  return select;
}


// Check if the same plot has already existed. 
//   @param plot A string to specify plot.
//   @return  A logical.
function hasDupPlot(plot){
  var tab_inputs = document.getElementById("tab_inputs");
  var input_tables = tab_inputs.querySelectorAll("table");
  for(let table of input_tables){
    if(table.id.split("_")[1] === "occ"){
      if(table.id.split("_")[2] === plot){
        alert("Duplicated PLOT!");
        return true;
      }
    }
  }
  return false;
}


// DONE: Save and load Settings 

// Load settings and replace setting table for plot or occurrence.
//   @param obj  A input element.
//                 Normally use "this". 
async function replaceTable(obj){
  var text = await readFile(obj.files[0]);
  var text = text.split(";");
  var table_name = obj.value.split("\\").slice(-1)[0].replace("\.conf", "")
  var new_table = makeTable(text, table_name, false);
  // Table
  var old_table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  old_table.replaceWith(new_table);
  // Title
  var old_title = obj.parentNode.parentNode.querySelectorAll("b")[0];
  var new_title = crEl({ el: 'B', tc: table_name})
  old_title.replaceWith( new_title );
}
// Helper for replaceTable(). 
function readFile(file){
  // https://www.delftstack.com/ja/howto/javascript/open-local-text-file-using-javascript/
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = x=> resolve(reader.result);
    reader.readAsText(file);
  })
}

// Save settings of plot or occurrence data.
//   @param obj  A input element.
//                 Normally use "this". 
function saveSettings(obj){
  var table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  var table_data = getTableDataPlus(table.id, shift_one = false);
  var f_name = obj.previousElementSibling.value;
  if(f_name === ""){ 
    f_name = table.id + ".conf"; 
  } else {
    f_name = table.id.split("_")[0] + "_" + table.id.split("_")[1] + "_" + f_name  + ".conf";
  }
  downloadStrings(strings = table_data, file_name = f_name)
}

// Save inputs of a table
//   @param obj  A input element.
//                 Normally use "this". 
function saveInputs(obj){
  var table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  var table_data = getTableDataPlus(table.id, shift_one = true);
  var f_name = table.id + "_" + getNow() + ".txt"
  downloadStrings(strings = table_data, file_name = f_name)
}

// Load example data
//   Using in example.html, run like as click buttons in html.
//   @param obj  A input element.
//                 Normally use "this". 
function loadExample(obj){
  // PLOT
  var make_plot_button = document.getElementById("dn_setting_plot_default").children[2];
  make_plot_button.click();
  var table = document.getElementById("input_plot_default");
  table.rows[2].cells[1].firstChild.value = "exam01";
  table.rows[2].cells[0].firstChild.click()
  // occ
  var main = obj.parentNode;
  var main = document.getElementById("tab_inputs");
  var occ_example = "input_occ_exam01";
  var new_module = inputTableModule(occ_example);
  main.children[4].replaceWith(new_module);
  setSortable(occ_example); // Can not set sortable in a function

  obj.nextElementSibling.remove(); // <br>
  obj.remove();
}
