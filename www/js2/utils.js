// convert table into array
//    @param   id_table  A string. A table id.
//    @param   header    A logical. true: add header.
//    @return  An array.
//    @examples
//    var id_table = 'table-1';
//    var header = true;
//    var array = table2array(id_table, header);
function table2array(id_table, header = true){
  const table = document.getElementById(id_table);
  const array = [];
  for(let i=0; i<table.rows.length; i++){
    const row = table.rows[i];
    const array_row = [];
    for(let j=0; j<row.cells.length; j++){
      array_row.push(row.cells[j].textContent);
    }
    array.push(array_row);
  }
  if(header){
    const header_row = [];
    for(let i=0; i<headerRow(table).cells.length; i++){
      header_row.push(headerRow(table).cells[i].textContent);
    }
    array.unshift(header_row);
  }
  return array
}

// save array to csv file
//    @param   array     An array to be saved.
//    @param   filename  A string. A file name.
//    @param   sep       A string. A separator.
//    @param   header    A logical. true: add header.
//    @return  A string.
//    @examples
//    var array = [['a','b','c'],[1,2,3],[4,5,6]];
//    var filename = 'test.csv';
//    var sep = ',';
//    var header = true;
//    saveArrayToCsv(array, filename, sep, header);
function saveArrayToTsv(array, filename, sep = '\t', header = true){
  let csv = ''; 
  if(header){
    csv += array[0].join(sep) + '\n';
    array = array.slice(1);
  }
  for(let i=0; i<array.length; i++){
    csv += array[i].join(sep) + '\n';
  }
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Random sampling
//    @param   n         A number of sample.
//    @param   array     An array to be sampled.
//    @param   only_once A logical. true: each element will be sampled only once.
//    @return  An array.
//    @examples
//    console.log(randInt(3, 100));
//    var array = ['a','b','c','d','e'];
//    console.log(randSample(3, array, true ));
//    console.log(randSample(6, array, true ));
//    console.log(randSample(3, array, false));
//    console.log(randSample(6, array, false));
function randInt(n, max){ 
  const sample = [];
  for(let i=0; i<n; i++){
    sample.push(Math.floor(Math.random() * max));
  }
  return sample
}
// Take n random elements from an array (only_once: never take the same one twice).
function randSample(n, array, only_once = false){
  const sample = [];
  if(only_once){
    const array_copy = Object.assign([], array);
    const m = Math.min(n, array_copy.length);
    for(let i=0; i<m; i++){
      const index = randInt(1, array_copy.length);
      sample.push(array_copy.splice(index, 1)[0]);
    }
  }else{
    for(let i=0; i<n; i++){
      const index = randInt(1, array.length);
      sample.push(array[index]);
    }
  }
  return sample;
}
// Shuffle an array.
function randSort(array){
  return randSample(array.length, array, true);
}


// Make look ahead regular expression
//    @param   A string.
//    @return  A regular expression.
//    @examples
//    var input = 'イシ ナラ';
//    var reg_ex = makeLookAheadReg(input);
//    grepArray(flora, reg_ex);
//    @reference
//      look ahead: https://www-creators.com/archives/5332
function makeLookAheadReg(input){
  const look_ahead = "^(?=.*" + input.replaceAll(" ", ")(?=.*") + ").*$";
  const reg_ex = new RegExp(look_ahead, 'i');  // i: case-insensitive
  return reg_ex;
}

// Convert hasy array table
//    In progress: can not convert hasy that has array as a value
//    @example 
//    var hash_array = sumWithGroup("occurrence", "Cover", "Layer");
//    hash2table(hasy_array);
//    
function hash2table(hash_array){
  const table = document.createElement('table');
  for(let i = 0; i < Object.keys(hash_array).length; i++){
    const tr = document.createElement('tr');
    tr.appendChild( crEl({ el: 'td', tc: Object.keys(hash_array)[i] }) );
    tr.appendChild( crEl({ el: 'td', tc: Object.values(hash_array)[i] }) );
    table.appendChild(tr);
  }
  return table
}

// Check if an object is or has table. 
//    @param obj An object.
//    @return A logical.
function isTable(obj){
  return obj.tagName === 'TABLE';
}
// true when an element holds at least one table.
function hasTable(obj){
  return obj.getElementsByTagName('table').length > 0;
}

// Search parent table of a object
//    Search parentNode of a object.
//    When object has multiple tables, return the first table in default.
//    Can return another table by using index.
//    @param obj   An object.
//    @param index A numeric.
//    @return A table.
function searchParentTable(obj, index = 0){
  while( !isTable(obj) && !hasTable(obj) ){
    obj = obj.parentNode;
  }
  if(isTable(obj)){
    return obj;
  }else{
    return obj.getElementsByTagName("table")[index];
  }
}

// Get column data in a table
//    @param id_table A string.
//    @param col_name A string.
//    @return An array.
//    @examples
//    var table = document.getElementById('input_occ_pl_1_tb');
//    var tds = table.rows[2].cells;
//    for(let name of getColNames(table)){ console.log(getColData(table, name, true)) }
//    for(let td of tds                 ){ console.log(getCellData(td, true)) }
//    for(let td of tds                 ){ console.log(getCellData(td)) }
function getColData(table, c_name, list_with_index = false){
  return getColsData(table, [c_name], list_with_index)[c_name];
}

// Get the data of several columns of a table, in one walk over the rows.
//    getColData() looks the column names up and walks the table again for
//    every column. Reading a whole table one column at a time therefore
//    costs (columns x rows) walks; this costs one.
//    A column the table does not have comes back as empty strings, as in
//    getColData(), so that the columns of several tables can be lined up.
//    @param table A table element.
//    @param c_names A string array of column names.
//    @param list_with_index A boolean, as in getColData().
//    @return An object keyed by column name, holding an array per column.
function getColsData(table, c_names, list_with_index = false){
  const names = getColNames(table);
  const col_no = c_names.map(c_name => names.indexOf(c_name));
  const cols = {};   // keyed by column name
  for(const c_name of c_names){ cols[c_name] = []; }
  const rows = table.querySelectorAll("tr:not([class=hide_button])");
  for(let Ri = 1; Ri < rows.length; Ri++){    // except th (rows[0])
    const cells = rows[Ri].cells;
    for(let Ci = 0; Ci < c_names.length; Ci++){
      cols[c_names[Ci]].push(
        (col_no[Ci] < 0) ? '' : getCellData(cells[col_no[Ci]], list_with_index));
    }
  }
  return cols;
}

// Get input value, list, or innerHTML cell data in a table.
//    In BISS, the values varies input, list, or innerHTML. 
//    getCellData() 
//    @param cell_data A td element in a table.
//    @param data_type A string to specify the data type of the cell, 
//                      which can be retrived with col_type().
//    @return A string.
function getCellData(td, list_with_index = false){
  if(td.firstChild === void 0){ return ''; }
  if(td.firstChild === null  ){ return ''; }
  if(td.firstChild.value === void 0){
    return td.textContent;   // the text of the cell, not its markup
  }else{
    if(td.firstChild.type === 'checkbox'){
      return td.firstChild.checked;
    }else{
      if(list_with_index === true && td.firstChild.tagName === 'SELECT'){
        return td.firstChild.selectedIndex;
      }else{
        return td.firstChild.value;
      }
    }
  }
}


// Get options in select tag in a cell
//    Return string array.
function getSelectOptionInCell(select){
  const select_opt = [];
  const opts = select.children;
  for(let i = 0; i < opts.length; i++){ select_opt.push(opts[i].value); }
  return select_opt;
}

// Split array by group
//    @param array An array.
//    @param group An array.
//    @return Grouped array. 
//    @examples
//    var array = [ 1,   2,   3,   4];
//    var group = ["a", "b", "a", "b"];
//    splitByGroup(array, group);
//    // [a: [1,3], b: [2,4]]
function splitByGroup(array, group){
  if(array.length !== group.length){ return array; }
  const grouped = {};   // keyed by group name
  for(let i=0; i < array.length; i++){ grouped[group[i]] = []; }
  for(let i=0; i < array.length; i++){
    grouped[group[i]].push(array[i]);
  }
  return grouped;
}


// Helper for getDataType()
function getDataTypes(table){
  const types = [];
  const rows = table.querySelectorAll("tr:not([class=hide_button])"); // remove tr with hide buttons
  for(const cell of rows[1].cells){   // the hide row is filtered out, so 1 is the first record
    types.push(getDataTypeCell(cell));
  }
  return types;
}

// Helper for getDataType()
function getDataTypeCell(cell){
  if(cell.firstChild === null){ return "fixed"; }
  let type = (cell.firstChild.type === void 0) ? "fixed" : cell.firstChild.type;
  if(type === 'select-one'){ type = 'list'; }
  return type;
}

// Get column names as a string array.
//   @param table A table element.
//   @return A string array.
function getColNames(table){
  // console.log(table.rows[0]);
  const row_0 = headerRow(table);
  const col_names = [];
  for(let Ri=0; Ri<row_0.cells.length; Ri++){
    col_names[Ri] = row_0.cells[Ri].innerText;
  }
  return col_names
}

// Get time like 2022_05_18_15_51_28: yyyy-mm-dd-hh-mm-ss
function getNow(){
   const now = new Date();
   const yr  = now.getFullYear();
   const mo  = String(now.getMonth()+1).padStart(2, `0`); // getMonth() return 0 when January
   const dd  = String(now.getDate()).padStart(2, `0`);
   const hh  = String(now.getHours()).padStart(2, `0`);
   const mi  = String(now.getMinutes()).padStart(2, `0`);
   const ss  = String(now.getSeconds()).padStart(2, `0`);
   return(`${yr}_${mo}_${dd}_${hh}_${mi}_${ss}`)
}

// Delete a row in a table.
//   When the raw is the only one row in a table, the row will not be deleted.
//   @param  obj An element of input button of a row in a table.
function delRow(obj){
    const table = obj.parentNode.parentNode.parentNode; // clicked table
    if(table.rows.length > 3){                        // delete more than 3 rows (th + tb * 2)
      const tr = obj.parentNode.parentNode;             // clicked row
      tr.parentNode.deleteRow(tr.sectionRowIndex);    // delete clicked row
    }
}

// Helper to createElement(), setAttribute(), innerHTML, textContent
//   @param el A string for element name.
//   @param ats An array with attribute names. {id: "hoge", value: "foo"}
//   @param ih,tc A string for innerHTML and textContent.
//            Both of them are given, ih is overwritten by tc.
//   @return HTML An object.
//   @examples 
//   crEl({ el: 'p', ats: {id: "id_test", class: "some_class"}, ih: "test" });
function crEl({ el, ats, ih, tc }){
  const ele = document.createElement(el);
  if(ats != void 0){
    const keys  = Object.keys(ats);
    for(const key of keys){ ele.setAttribute(key, ats[key]); }
  }
  if(ih != void 0){ ele.innerHTML   = ih; }
  if(tc != void 0){ ele.textContent = tc; }
  return ele;
}

// Read a chosen file as text.
//    Used by whatever reads a file the user picked: a settings JSON,
//    a species list, a flora.
//    @param  file  A File from an <input type="file">.
//    @return       A Promise of the text.
//    @reference
//      https://www.delftstack.com/ja/howto/javascript/open-local-text-file-using-javascript/
function readFile(file){
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  })
}

// Unique array
function uniq(array){
  return Array.from(new Set(array));
}

// Remove every empty string from an array, in place.
function removeEmptyInArray(array){
  while(array.indexOf('') >= 0){
    array.splice(array.indexOf(''), 1);
  }
}
// Every index at which an element appears in an array.
function multiIndexOf(array, element){
  const indices = [];
  let idx = array.indexOf(element);
  while (idx !== -1) {
    indices.push(idx);
    idx = array.indexOf(element, idx + 1);
  }
  return indices;
}
