// Create a td for a column, with the input that its data type asks for.
function createTd(col_name, data_type, select, table_data){
  let td;   // one declaration: case "auto" used to assign it without any
  switch(data_type){
    case "auto": {  // date, no, GPS
      const auto = autoValue(col_name);
      if(auto !== void 0        ) td = crEl({ el: 'td', tc: auto });
      if(col_name === COL.NO    ) td = crEl({ el: 'td', tc: 1    });
      if(col_name === COL.SAME_AS) td = crEl({ el: 'td', tc: ''  });
      break;
    }
    case "text":
      if(Array.isArray(select)){ select = select.join(""); }
      td = createTdWithChild( crEl({ el:'input', ats:{type: data_type, value: table_data, size: select} }) );
      break;
    case "number":
      // The value, like a text column: a table built from data that was
      // entered (a restored survey) has to come back with its numbers.
      td = createTdWithChild(
        crEl({ el:'input', ats:{type: data_type, value: table_data, inputmode: "numeric", min: "0", step: select} }) );
      break;
    case "checkbox":
      td = createTdWithChild( crEl({ el:'input', ats:{type: data_type} }) );
      td.firstChild.checked = !!table_data;
      break;
    case "fixed":
      // A cell holds data, not markup: textContent, so that a name with
      // & or < is kept as typed and comes back the same (getCellData()).
      td = crEl({ el:'td', tc: table_data });
      break;
    case "button":
      if(col_name === COL.DELETE)         { td = createTdWithChild( createDelButton() ); }
      if(col_name === COL.UPDATE_TIME_GPS){ td = createTdWithChild( createUpdateButton() ); }
      break;
    case "list": {
      const options = select.concat('');   // concat, not push: the caller reuses the options
      // -1 (not among the options) picks the first one
      td = createTdWithChild( createSelectOpt(options, Math.max(0, options.indexOf(table_data))) );
      break;
    }
  }
  return td;
}

// Add the header row (th) built from the column names.
function addThTr(table, col_names){
  const tr = document.createElement('tr');
  for(let Ni = 0; Ni < col_names.length; Ni++){
    if(col_names[Ni] !== ""){
      const th = crEl({ el: 'th', tc: col_names[Ni] });
      tr.appendChild(th);
    }
  }
  table.appendChild(tr);
  return table;
}

// Every table BISS builds has the same three parts, in this order.
//   makeTableJO() puts them there: addThTr(), then addHideRowTr(), then the
//   data. Anything that reaches into a table by row number means one of these.
const ROW_HEADER     = 0;   // the column names, as th
const ROW_HIDE       = 1;   // one Hide button per column
const ROW_FIRST_DATA = 2;   // the first record

// The row that holds the first record, or undefined when there is none.
function firstDataRow(table){
  return table.rows[ROW_FIRST_DATA];
}
// How many records a table holds.
function nDataRow(table){
  return table.rows.length - ROW_FIRST_DATA;
}
// The row that holds the column names.
function headerRow(table){
  return table.rows[ROW_HEADER];
}

// Number of rows in a table.
function nRow(table){
  return table.rows.length;
}
// Number of cells in the first row of a table.
function nCol(table){
  return headerRow(table).cells.length;
}

// Add the second row, which holds a hide button for every column.
function addHideRowTr(table){
  const tr = crEl({ el: 'tr', ats: {class: 'hide_button'} });
  for(let i = 0; i < nCol(table); i++){
    const td = crEl({ el: 'td', ih: "" });
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
  const select = crEl({ el:'select', ats:{id: id} });
  for(let j = 0; j < n_list; j++){
    const option = document.createElement('option');
    if(selected_no === j){ option.setAttribute('selected', 'true'); }
    option.textContent = list[j];
    select.appendChild(option);
  }
  return select;
}


// Read a table back into the table definition it was built from.
//    The definition is what makeTableJO() takes, what a settings file holds,
//    and what the saved survey data is made of.
//    @param table  A table element.
//    @return  An object with four parts.
//               biss_c_names: the column names, which become the th.
//               biss_d_types: the data type of each column, which decides the input.
//               biss_selects: the options of a 'list' column, null for the others.
//               biss_inputs : the data, keyed by column name.
function getTableData(table){
  const c_names = getColNames(table);
  const d_types = getDataTypes(table);
  // an object, not an array: JSON.stringify() of an array with string keys writes []
  const inputs = getColsData(table, c_names);
  const selects = [];
  for(let i = 0; i < d_types.length; i++){
    selects.push( (d_types[i] === "list") ? getSelectOne(table, c_names[i]) : null);
  }
  return {
    biss_c_names: c_names,
    biss_d_types: d_types,
    biss_selects: selects,
    biss_inputs : inputs
  }
}

// Press the DELETE button of the row that holds a value in a column.
//    Reaching a row by its number (tr:nth-child(7)) means a row added to
//    data.js above it deletes something else instead. Say which row is meant.
//    @param table   A table element.
//    @param c_name  A string, the column to look in.
//    @param value   A string, the value that names the row.
//    @return        true when a row was deleted.
function deleteRowByValue(table, c_name, value){
  const c_names = getColNames(table);
  const col_no = c_names.indexOf(c_name);
  const del_no = c_names.indexOf(COL.DELETE);
  if(col_no < 0 || del_no < 0){ return false; }
  for(let Ri = ROW_FIRST_DATA; Ri < table.rows.length; Ri++){
    if(getCellData(table.rows[Ri].cells[col_no]) === value){
      table.rows[Ri].cells[del_no].firstChild.click();
      return true;
    }
  }
  return false;
}

// Build a table out of a table definition.
//   @param table_data  A table definition: biss_c_names, biss_d_types,
//                        biss_selects and biss_inputs.
//   @param table_name  A string. The id of the table.
//   @return  A table element.
function makeTableJO(table_data, table_name){
  const col_names = table_data.biss_c_names;
  const dat_types = table_data.biss_d_types;
  const selects   = table_data.biss_selects;
  const inputs    = table_data.biss_inputs ;
  let table = crEl({ el: 'table', ats:{id: table_name} });
  table = addThTr(table, col_names);                                    // tr with th (col names)
  table = addHideRowTr(table);                                          // tr with hide buttons
  table = addTableData(table, col_names, dat_types, selects, inputs);   // table data
  return table;
}

// Add one tr per record, filling each td through createTd().
function addTableData(table, col_names, dat_types, selects, inputs){
  // What is the same for every record is worked out once: the number of
  // columns (only rows are added below) and the options of each column.
  const n_col = nCol(table);
  const options = [];
  for(let Cj = 0; Cj < n_col; Cj++){ options.push(uniq(selects[Cj])); }
  const n_row = inputs[col_names[0]].length;
  for(let Ri = 0; Ri < n_row; Ri++){
    const tr = document.createElement('tr');
    for(let Cj = 0; Cj < n_col; Cj++){
      if(col_names[Cj] !== ""){
        tr.appendChild( createTd(col_names[Cj], dat_types[Cj], options[Cj], inputs[col_names[Cj]][Ri]) );
      }
    }
    table.appendChild(tr);
  }
  return table;
}

// Turn a settings table (item, type, value per row) into a table definition, where the items become the column names.
function convertTableData(table_data){
  // var table_data = temp1;
  const c_names = table_data['biss_inputs']['item'];
  const d_types = table_data['biss_inputs']['type'];
  const selects = [];
  const inputs  = {};   // keyed by column name
  for(let i = 0; i < d_types.length; i++){
    const inputs_value = table_data['biss_inputs']['value'][i];
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
