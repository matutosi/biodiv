// // // // // // // // // // // // // // // // // // 
// 
// Data CAN be sent Email directory.
// But should not send directory, because of security problem.
//   However, not good save password as local data in a browser for security problem.
//   Other web site including JavaScript can get local data easily.
// 
// // // // // // // // // // // // // // // // // // 
// 
// https://programmercollege.jp/column/8922/
// https://developer.mozilla.org/ja/docs/Learn/Forms/Sending_and_retrieving_form_data


// // // // // // // // // // // // // // // // // // 
// 
// Save data using IndexedDB_API
//     Work but can not convert html DOM to Json,
//     local data is enough because easy to use.
// 
// // // // // // // // // // // // // // // // // // 
// https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API
// 
// Work, but can NOT get input values after rendering html
// a = domJSON.toJSON(document.getElementById('table_setting'));
// b = domJSON.toDOM(a);
// b.firstChild
// occ = domJSON.toJSON(document.getElementById('occurrence'));
// oc = domJSON.toDOM(occ);
// oc.firstChild
// 
// script below should be set at the BOTTOM of html
// <script src="domJSON.js"></script>




// Rank of each element in an array (1st version)
//    
//    CAUTION: null or "" will be return as first index
//        if null or "" should return the last use latest version (rank())
//    
//    Rank starts with 0, because rank will be used to sort arrays.
//    In case of tie, return former element with a smaller index.
//      rank([5, 3, 2, 4, 1, 3])
//      >>   [5, 2, 1, 4, 0, 3]
function rank_1(array, dir="asc"){
    array = string2Numeric(array);
    var rank = [];
    var n_array = array.length;
    for (let i=0; i<n_array; i++) { rank[i] = 0; }
    for (let i=1; i<n_array; i++) {
        for (let j=0; j<i; j++) {
            if( array[j] <= array[i] ){ rank[i]++; } // <= : for tie rank
            if( array[j] >  array[i] ){ rank[j]++; }
        }
    }
    if(dir === "desc") return reverseRank(rank);
    return rank;
}

// Helper to reverse rank. 
//    reverseRank([4, 1, 2, 0, 3])
//    >>          [0, 3, 2, 4, 1]
function reverseRank(array){
  n = array.length;
  res_array = [];
  for(let i=0; i<n; i++){
    res_array[i] = (n - 1) - array[i];
  }
  return res_array;
}

// Sort function to test functions: sortByOrder() and rank()
//    // test
//    const a = ["c", "a", "c", "v", "e", "d"];
//    const b = [ 30, 30,  20,  50,  10, 40 ];
//    sortByOrder(a, rank(b))
function sort2(array){
  return sortByOrder(array, rank(array));
}


// add clumn (2nd version)
function addCol_2(id){      var table = document.getElementById(id);  // get table  
    const n_row = table.rows.length;          // number of rows
    const col_name = document.getElementById('col_name');
    // th
    var tr = table.rows[0]
    var th = document.createElement('th');
    th.innerHTML = col_name.value;
    tr.appendChild(th);
    // td
    const editable_cell = '<span contenteditable="true"><pre> </pre></span>';  // enable to input easily
    for(let Ri = 1; Ri < n_row; Ri++){
      var tr = table.rows[Ri]
      var td = document.createElement('td');
      td.innerHTML = editable_cell;
      tr.appendChild(td);
    }
}

// add clumn (1st version)
function addCol_1(id){
    var table = document.getElementById(id);  // get table
    const n_row = table.rows.length;          // number of rows
    const n_col = table.rows[0].cells.length; // number of cols
    const position = n_col - 2;               // 2: delete and date
    const col_name = document.getElementById('col_name');

    var cell = table.rows[0].insertCell(position);
    cell.innerHTML = '<th>' + col_name.value + '</th>';
    const editable_cell = '<span contenteditable="true"><pre> </pre></span>';  // enable to input easily
    for(let Ri = 1; Ri < n_row; Ri++){        // add cell
        var cell = table.rows[Ri].insertCell(position);
        cell.innerHTML = editable_cell;
    }
}

// Create (new) table (1st version)
//   Create (new) table, but exactly not new. 
//   When id of exsiting table with no data and col item are given, 
//   createTable() add header to the table.
//   When table with header are given, return nothing and alert.
//   
function createTable_1(id_table, id_col_item){
  var table = document.getElementById(id_table);
  const n_row = table.rows.length;
  if(n_row != 0){
    alert("Can not create table, \n table already exists")
    return;
  }
  const col_name = ('date,del,' + document.getElementById(id_col_item).value).split(",");
  const n_col = col_name.length;
  var tr = document.createElement('tr');
  for(let Ni = 0; Ni < n_col; Ni++){
    addTh(tr, col_name[Ni])  // returned by side effect
  }
  table.appendChild(tr)
}

// new function is now in biodiv.html
function copyRowUpward_1(id_table){
  var table = document.getElementById(id_table);
  const n_rows = table.rows.length;
  const last_row = table.rows[n_rows - 1].cloneNode(true);
  table.appendChild(last_row);
}

function sortTable(id_table){
// <input type="button" value="sort"  onclick="sortTable(occ_tbl)" />
// var id_table = "occurrence";
  var table = document.getElementById(id_table);
  var trs = table.rows;
  var key = "occ_" + "no";
  var key_cols = getInnerHTML(document.getElementsByClassName(key));
  var new_order = rank(key_cols, dir="desc");
  // th=0, add 1 to others
  for(let i=0; i<new_order.length; i++){ new_order[i]++; }
  new_order.unshift(0);
  var new_trs = sortByOrder(trs, new_order);
  for(let i=0; i<new_trs.length; i++){
    table.appendChild(new_trs[i]);
  }
}

// Helper to create input tag with class, id, type, value, and placeholder (old version)
function createInput_2({type = "text", value = null, placeholder = null, checked = null, max = null, min = null, step = null, inputmode = null, onclick = null, required = null, id = null, clss = null }){
  var input = document.createElement('input');
  if( type        != null){ input.setAttribute("type"       , type       ); }
  if( value       != null){ input.setAttribute("value"      , value      ); }
  if( placeholder != null){ input.setAttribute("placeholder", placeholder); }
  if( checked     != null){ input.setAttribute("checked"    , checked    ); }
  if( step        != null){ input.setAttribute("step"       , step       ); }
  if( max         != null){ input.setAttribute("max"        , max        ); }
  if( min         != null){ input.setAttribute("min"        , min        ); }
  if( inputmode   != null){ input.setAttribute("inputmode"  , inputmode  ); }
  if( onclick     != null){ input.setAttribute("onclick"    , onclick    ); }
  if( required    != null){ input.setAttribute("required"   , required   ); }
  if( id          != null){ input.setAttribute("id"         , id         ); }
  if( clss        != null){ input.setAttribute("class"      , clss       ); }
  return input;
}

// Helper to create input tag with class, id, type, value, and placeholder (old version)
function createInput_1(ty, va, pl, on, im){
  var input = document.createElement('input');
  input.setAttribute("type"       , ty);
  input.setAttribute("value"      , va);
  input.setAttribute("placeholder", pl);
  input.setAttribute("onclick"    , on);
  input.setAttribute("inputmode"  , im);
  return input;
}


// Helper to updateId: Get next id from id_items
//    class when id_items = "occ_date", which includes "occ_date_001", "occ_date_002", "occ_date_004",
//    return "occ_date_005"
//    
// updateId('occ_date_001')
// 'occ_date_001'.split("_").slice(0,-1).join("_");
// getNextId('occ_date')
function updateId(id){
  var id_items = id.split("_").slice(0,-1).join("_");
  return getNextId(id_items);
}

// Helper to updateId: Get next id from id_items
//    class when id_items = "occ_date", which includes "occ_date_001", "occ_date_002", "occ_date_004",
//    return "occ_date_005"
//    
function getNextId(id_items){
  var ids = [];
  const items = document.getElementsByClassName(id_items);
  for(it of items){
    ids.push(Number(it.getAttribute("id").split("_").slice(-1)));
  }
  const max = Math.max.apply(Math, ids);
  return id_items + "_" + String(max + 1).padStart(3, `0`);
}

// Create occurrence table accoding to table settings
//    Three columns as shown below will generate automatically.
//        date (auto), delButton (button), no (auto)
//        These columns should not be operated from users.
//          "date" is hidden only recorded and output.
//          "delButton" is hidden unless clicked "show delButton".
//          "no" is only readable.
//    Other columns will generate accoding to user input.
//        col_name   : Any text. 
//        input_typpe: Select from lists. 
//                     Used as "types" in <input> tag.
//        option     : Available in "fixed" and list "input_typpe". 
//                     Omitted if other types are selected.
// 
function createOccurrenceTable(id_span, id_setting, id_table){
// var id_table = "setting_occ"
  // console.log(id_span);
  // console.log(id_setting);
  // console.log(id_table);
  // var id_span    = "input";
  // var id_setting = "meta_setting_table" ;
  // var id_table   = "meta_table";
  var setting_table = document.getElementById(id_setting);
  var st_cnames = getColNames(setting_table);
  const col_names = getColData(setting_table, st_cnames[0]);
  const dat_types = getColData(setting_table, st_cnames[1]);
  const optionals = getColData(setting_table, st_cnames[2]);
  //   const optionals = getColData(table, col_names[3]);

  // 
  var table = document.createElement('table');
  var span = document.getElementById(id_span);
  span.appendChild(table);
  createTable(table, col_names); // add th

  var tr = document.createElement('tr');
  for(let i = 0; i < col_names.length; i++){
    if(col_names[i] !== ""){
      var td = createInputTd(dat_types[i], col_names[i], optionals[i]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  setSortable(id_table);
}

// Helper to get first child from html elements
//    @params elements   html elements by document.getElementsByClassName()
//    @return        An array.
function getFirstChild(elements){
  var res = [];
  for(let i = 0; i < elements.length; i++){ res[i] = elements[i].firstChild; }
  return res
}

// Helper to get values from input objects
//    @params objs   list objects by document.getElementsByClassName()
//    @return        An array.
function getValues(objs){
  var res = [];
  for(let i = 0; i < objs.length; i++){ res[i] = objs[i].value; }
  return res
}

// Helper to get checked (Boolean) from input objects
//    @params objs   list objects by getFirstChild(document.getElementsByClassName())
//    @return        An array.
function getChecked(objs){
  var res = [];
  for(let i = 0; i < objs.length; i++){ res[i] = objs[i].checked; }
  return res
}

// Helper to get selectedIndex from input objects
//    @params objs   list objects by getFirstChild(document.getElementsByClassName())
//    @return        An array.
function getSelectedIndex(objs){
  var res = [];
  for(let i = 0; i < objs.length; i++){ res[i] = objs[i].selectedIndex; }
  return res
}

// Helper to get innerHTML from input objects
//    @params objs   list objects by document.getElementsByClassName()
//    @return        An array.
function getInnerHTML(objs){
  var res = [];
  for(let i = 0; i < objs.length; i++){ res[i] = objs[i].innerHTML; }
  return res
}

// https://phper.pro/352
function download(id){
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);  //set encoding UTF-8 with BOM
  var table = document.getElementById(id);
  var data_tsv = "";                             // data_tsv is data holder

  for(var i = 0;  i < table.rows.length; i++) {
    for(var j = 0; j < table.rows[i].cells.length; j++) {
      data_tsv += table.rows[i].cells[j].innerText;           // save data in cellls
      if(j == table.rows[i].cells.length-1) data_tsv += "\n";  // add line break
      else data_tsv += "\t";                                   // add "\t" as separater
    }
  }

  var blob = new Blob([ bom, data_tsv], { "type" : "text/tsv" });  // download tsv data from data_tsv
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = getNow() + ".tsv";
  a.href = url;
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
  delete data_tsv;
}
