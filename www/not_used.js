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

