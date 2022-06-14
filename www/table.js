// Create (new) table
//   Create (new) table, but exactly not new. 
//   When id of exsiting table with no data and col item are given, 
//   createTable() add header to the table.
//   When table with header are given, return nothing and alert.
//   
function createTable(table, col_names){
  const n_row = table.rows.length;
  if(n_row != 0){
    alert("Can not create table, \n table already exists")
    return;
  }
  const n_col = col_names.length;
  var tr = document.createElement('tr');
  for(let Ni = 0; Ni < n_col; Ni++){
    addTh(tr, col_names[Ni])
  }
  table.appendChild(tr)
}

// Helper function for createTable
//   add "th" to "tr"
function addTh(tr, col_name){
    var th = document.createElement('th');
    th.innerHTML = col_name;
    tr.appendChild(th);  // return by side effect
}

// Add a column to a table with value
//   addColVal() is a generic function.
//   Use specific functions for different purpose.
//      contenteditable : addColEditable().
//      text input      : addColInputText()
//      checkbox input  : addColInputCheckbox()
//      deleteButton    : addColDeleteButton()
//      date            : addColDate()
// 
function addColVal(id_table, id_col_name, value){
    var table = document.getElementById(id_table);  // get table
    const col_name = document.getElementById(id_col_name);
    // th
    var tr = table.rows[0]
    addTh(tr, col_name.value)
    // td
    fillCol(table, value)
}

// Helper function for addCol
//   Fill all "td" except "th" in a table with value
function fillCol(table, value){
    const n_row = table.rows.length;   // number of rows
    for(let Ri = 1; Ri < n_row; Ri++){ // except th (Ri = 0)
        var tr = table.rows[Ri]
        var td = document.createElement('td');
        td.innerHTML = value;
        tr.appendChild(td);
    }
}

// Wrapper to add col: InputText
function addColInputText(id_table, id_col_name, size="10"){
  const value = '<input type="text" size=' + '"size"' + ' />';
  addColVal(id_table, id_col_name, value);
}

// Wrapper to add col: Checkbox
function addColInputCheckbox(id_table, id_col_name){
  const value = '<input type="checkbox">';
  addColVal(id_table, id_col_name, value);
}

// Wrapper to add col: InputText
function addColInputText(id_table, id_col_name, size="10"){
  const value = '<input type="text" size=' + '"size"' + ' />';
  addColVal(id_table, id_col_name, value);
}

// Wrapper to add col: contenteditable
function addColEditable(id_table, id_col_name){
  const value = '<span contenteditable="true"><pre> </pre></span>';  // enable to input easily
  addColVal(id_table, id_col_name, value);
}

// Wrapper to add col: delete_button
function addColDelete(id_table, id_col_name){
  const value = '<input type="button" value="DELETE" onclick="deleteRow(this)">';
  addColVal(id_table, id_col_name, value);
}

// Wrapper to add col: date + i (serial number)
function addColDate(id_table, id_col_name, i = 0){
  const value = getNow() + i;
  addColVal(id_table, id_col_name, value);
}


  // 
function addDate(tr, n=1){
  var td = document.createElement('td');
  td.innerHTML = getNow() + '_' + String(n).padStart(2, `0`);
  tr.appendChild(td);
}

  // 
function addDelButton(tr){
  var td = document.createElement('td');
  td.innerHTML =  '<input type="button" value="DELETE" onclick="deleteRow(this)">';
  tr.appendChild(td);
}

  // 
function addCheckbox(tr, row = 1, col = 1){
  var td = document.createElement('td');
  td.innerHTML =  '<input type="checkbox" class="data" id=' + row + '_' + col + '>';
  tr.appendChild(td);
}

  // Add input tag with 'class="data"' and 'id="1_1"'
function addInputDataId(tr, row = 1, col = 1){
  var td = document.createElement('td');
  td.innerHTML = '<input type="text" class="data" id=' + row + '_' + col + '>';
  tr.appendChild(td);
}

  // editing now
function addFirstRow(id_table){
  var table = document.getElementById(id_table);
  const n_col = table.rows[0].cells.length;
  var tr = document.createElement('tr');
  addDate(tr);
  addDelButton(tr);
  addCheckbox(tr, 1, 1)
  addCheckbox(tr, 1, 2)
  for(let Ni = 4; Ni < n_col; Ni++){
    addInputDataId(tr, 1, Ni)
  }
  table.appendChild(tr)
}

















// http://scrap.php.xdomain.jp/javascript_table_control/
// add row
function addRow(id, n = 5){
    var table = document.getElementById(id);    // get table
    const n_col = table.rows[0].cells.length;   // number of cols
    // html for cells
    var ckeckbox_cell = '<span contenteditable="true"><input type="checkbox"></span>';
    var editable_cell = '<span contenteditable="true"><pre> </pre></span>';  // enable to input easily
  //     var editable_cell = '<span contenteditable="true"><pre> </pre></span>';  // enable to input easily
    var delete_button = '<input type="button" value="DELETE" onclick="deleteRow(this)">';
    for(let Nj = 0; Nj < n; Nj++){
        var tr = document.createElement('tr');
        // date
        var td = document.createElement('td');
        td.innerHTML = getNow()+'_'+Nj;
        tr.appendChild(td);
        // delete_button
        var td = document.createElement('td');
        td.innerHTML = delete_button;
        tr.appendChild(td);
        // identified
        var td = document.createElement('td');
        td.innerHTML = ckeckbox_cell;
        tr.appendChild(td);
        // sampled
        var td = document.createElement('td');
        td.innerHTML = ckeckbox_cell;
        tr.appendChild(td);
        // 4: delete_button, date, identified, and sampled, 
        for(let Cj = 4; Cj < n_col; Cj++){
            var td = document.createElement('td');
            td.innerHTML = editable_cell;
            tr.appendChild(td);
        }
        // add a row to table
        table.appendChild(tr);
    }
}

// delete a row
function deleteRow(obj){
    tr = obj.parentNode.parentNode;              // clicked row
    tr.parentNode.deleteRow(tr.sectionRowIndex); // delete clicked row
}


// // // // // // // // // // // // // // // // // // // // // // // // // // //
// 
// No need (do not use)
// 
// // // // // // // // // // // // // // // // // // // // // // // // // // //

// delete a column
function deleteColumn(id){
    // get table
    var table = document.getElementById(id);
    // number of rows
    var rows = table.rows.length;
    // delete last cell in each row
    for ( var i = 0; i < rows; i++){
        var cols = table.rows[i].cells.length;
        if (cols < 2){
            continue;
        }
        table.rows[i].deleteCell(-1);
    }
}

// add column
function insertColumn(id){
    // get table
    var table = document.getElementById(id);
    // number of rows
    var rows = table.rows.length;
    // add cell
    for ( var i = 0; i < rows; i++){
        var cell = table.rows[i].insertCell(-1);
        var cols = table.rows[i].cells.length;
        if (cols > 10){
            continue;
        }
        cell.innerHTML = (i + 1) + '-' + (cols - 1);
    }
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
