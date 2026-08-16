// Create a td for a column, with the input that its data type asks for.
function createTd(col_name, data_type, select, table_data){
  let td;   // one declaration: case "auto" used to assign it without any
  switch(data_type){
    case "auto": // date, no, GPS
      if(col_name === "DATE"  )  td = crEl({ el: 'td', ih: getNow() });
      if(col_name === "LOC_LAT") td = crEl({ el: 'td', ih: getLat() });
      if(col_name === "LOC_LON") td = crEl({ el: 'td', ih: getLon() });
      if(col_name === "LOC_ACC") td = crEl({ el: 'td', ih: getAcc() });
      if(col_name === "NO"     ) td = crEl({ el: 'td', ih: 1        });
      if(col_name === "SameAs" ) td = crEl({ el: 'td', ih: ''       });
      break;
    case "text":
      if(Array.isArray(select)){ select = select.join(""); }
      td = createTdWithChild( crEl({ el:'input', ats:{type: data_type, value: table_data, size: select} }) );
      break;
    case "number":
      td = createTdWithChild(
        crEl({ el:'input', ats:{type: data_type, value: "", inputmode: "numeric", min: "0", step: select} }) );
      break;
    case "checkbox":
      td = createTdWithChild( crEl({ el:'input', ats:{type: data_type} }) );
      td.firstChild.checked = !!table_data;
      break;
    case "fixed":
      td = crEl({ el:'td', ih: table_data });
      break;
    case "button":
      if(col_name === "DELETE")         { td = createTdWithChild( createDelButton() ); }
      if(col_name === "UPDATE_TIME_GPS"){ td = createTdWithChild( createUpdateButton() ); }
      break;
    case "list":
      select.push('');
      // -1 (not among the options) picks the first one
      td = createTdWithChild( createSelectOpt(select, Math.max(0, select.indexOf(table_data))) );
      break;
  }
  return td;
}

// Add the header row (th) built from the column names.
function addThTr(table, col_names){
  var tr = document.createElement('tr');
  for(let Ni = 0; Ni < col_names.length; Ni++){
    if(col_names[Ni] !== ""){
      var th = crEl({ el: 'th', ih: col_names[Ni] });
      tr.appendChild(th);
    }
  }
  table.appendChild(tr);
  return table;
}

// Number of rows in a table.
function nRow(table){
  return table.rows.length;
}
// Number of cells in the first row of a table.
function nCol(table){
  return table.rows[0].cells.length;
}

// Add the second row, which holds a hide button for every column.
function addHideRowTr(table){
  var tr = crEl({ el: 'tr', ats: {class: 'hide_button'} });
  for(let i = 0; i < nCol(table); i++){
    var td = crEl({ el: 'td', ih: "" });
    td.appendChild( createHideTableColButton() );
    tr.appendChild(td);
  }
  table.appendChild(tr)
  return table;
}
// Create the button that hides the column it sits in.
function createHideTableColButton(){
  return createInput({ type:"button", value: msg('hide'), 'data-msg': 'hide', onclick: "hideTableCol(this)" });
}

// Helper to create input with select options
//    when selected_no is given, 
//    its <option> (start with 0) will be set as "selected".
function createSelectOpt(list, selected_no = 0, id = ''){
  const n_list = list.length;
  //   var select = document.createElement('select');
  var select = crEl({ el:'select', ats:{id: id} });
  for(let j = 0; j < n_list; j++){
    var option = document.createElement('option');
    if(selected_no === j){ option.setAttribute('selected', 'true'); }
    option.innerHTML = list[j];
    select.appendChild(option);
  }
  return select;
}


// Get data and optional information from a table.
//    getTableDataPlus() retrieve table data as well as column names, data types, selects. 
//    @param id_table      A string to specify table id.
//    @return               A string with 4 parts as shown below. 
//                          Each part is JSON format.
//                            c_names: Column names of table, which will be used for making th.
//                            d_types: Data types of each column for judging the td and input types.
//                            selects: Select options for 'list' element. null for other types.
//                            t_data : Table data for making td values or innnerHTML.
function getTableData(table){
  // var table = document.getElementById("setting_plot_tb");
  var c_names = getColNames(table);
  var d_types = getDataTypes(table);
  // getInputs
  var t_data = [];
  for(let name of c_names){
    t_data[name] = getColData(table, name);
  }
  var selects = [];
  for(var i = 0; i < d_types.length; i++){ 
    selects.push( (d_types[i] === "list") ? getSelectOne(table, c_names[i]): '');
  }
  return{
    biss_c_names: c_names,
    biss_d_types: d_types,
    biss_selects: selects,
    biss_inputs : t_data
  }
}

// Build a table out of a table definition.
//   @param table_data  A table definition: biss_c_names, biss_d_types,
//                        biss_selects and biss_inputs.
//   @param table_name  A string. The id of the table.
//   @return  A table element.
function makeTableJO(table_data, table_name){
  var col_names = table_data.biss_c_names;
  var dat_types = table_data.biss_d_types;
  var selects   = table_data.biss_selects;
  var inputs    = table_data.biss_inputs ;
  var table = crEl({ el: 'table', ats:{id: table_name} });
  table = addThTr(table, col_names);                                    // tr with th (col names)
  table = addHideRowTr(table);                                          // tr with hide buttons
  table = addTableData(table, col_names, dat_types, selects, inputs);   // table data
  return table;
}

// Add one tr per record, filling each td through createTd().
function addTableData(table, col_names, dat_types, selects, inputs){
  for(let Ri = 0; Ri < inputs[col_names[0]].length; Ri++){
    var tr = document.createElement('tr');
    for(let Cj = 0; Cj < nCol(table); Cj++){
      if(col_names[Cj] !== ""){
        tr.appendChild( createTd(col_names[Cj], dat_types[Cj], uniq(selects[Cj]), inputs[col_names[Cj]][Ri]) );
      }
    }
    table.appendChild(tr);
  }
  return table;
}

// Turn a settings table (item, type, value per row) into a table definition, where the items become the column names.
function convertTableData(table_data){
  // var table_data = temp1;
  var c_names = table_data['biss_inputs']['item'];
  var d_types = table_data['biss_inputs']['type'];
  var selects = [];
  var inputs  = [];
  for(var i = 0; i < d_types.length; i++){
    var inputs_value = table_data['biss_inputs']['value'][i];
    selects.push( (d_types[i] === 'list' ) ? inputs_value.split(':') : inputs_value );
    inputs[c_names[i]] = [ /fixed|checkbox/.test(d_types[i]) ? inputs_value : '' ];
  }
  return {
    biss_c_names: c_names,
    biss_d_types: d_types,
    biss_selects: selects,
    biss_inputs : inputs 
  }
}


  // editing now
  // var table_name = "setting_occ_default";
  // var table_name = "input_plot_default";
  // var table_name = "setting_plot_01";
  // var table = document.getElementById(table_name);
  // var table_data = getTableData(table);
  // var t_data = convertTableData(table_data);
  // var table_new = makeTableJO(t_data, "test")
  // document.getElementById("setting_occ_default").replaceWith(table_new);


  // data_00["setting_plot_01"]["biss_inputs"]["item"]
  // JSON.stringify(data_00)
  // JSON.parse(JSON.stringify(data_00))
