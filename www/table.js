// http://scrap.php.xdomain.jp/javascript_table_control/

// add row
function addRow(id, n = 5) {
    var table = document.getElementById(id);    // get table
    const n_col = table.rows[0].cells.length;   // number of cols
    // html for cells
    var editable_cell = '<span contenteditable="true"></span>';
    var delete_button = '<input type="button" value="DELETE" onclick="deleteRow(this)">';
    for(var Nj = 0; Nj < n; Nj++){
        var tr = document.createElement('tr');
        for(var Cj = 0; Cj < n_col - 2; Cj++){  // 2: delete_button and date
            var td = document.createElement('td');
            td.innerHTML = editable_cell;
            tr.appendChild(td);
        }
        // delete_button
        var td = document.createElement('td');
        td.innerHTML = delete_button;
        tr.appendChild(td);
        // date
        var td = document.createElement('td');
        td.innerHTML = getNow()+'_'+Nj;
        tr.appendChild(td);
        // add a row to table
        table.appendChild(tr);
    }
}


//  行追加 
function insertRow(id) {
    var table = document.getElementById(id);    // get table
    // add row
    var row = table.insertRow(-1); // insertRow() is another function, not self call
    // add cell
    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);
    var cell3 = row.insertCell(-1);
    // button HTML
    var button = '<input type="button" value="行削除" onclick="deleteRow(this)" />';
    // number of rows
    var row_len = table.rows.length;
    // add data into cell
    cell1.innerHTML = button;
    cell2.innerHTML = row_len + "-" + 1;
    cell3.innerHTML = row_len + "-" + 2;
}
 
// delete a row
function deleteRow(obj) {
    // clicked row
    tr = obj.parentNode.parentNode;
    // delete clicked row
    tr.parentNode.deleteRow(tr.sectionRowIndex);
}


// // // // // // // // // // // // // // // // // // // // // // // // // // //
// 
// No need (do not use)
// 
// // // // // // // // // // // // // // // // // // // // // // // // // // //
// add column
function insertColumn(id) {
    // get table
    var table = document.getElementById(id);
    // number of rows
    var rows = table.rows.length;
    // add cell
    for ( var i = 0; i < rows; i++) {
        var cell = table.rows[i].insertCell(-1);
        var cols = table.rows[i].cells.length;
        if (cols > 10) {
            continue;
        }
        cell.innerHTML = (i + 1) + '-' + (cols - 1);
    }
}

// delete a row
function deleteColumn(id) {
    // get table
    var table = document.getElementById(id);
    // number of rows
    var rows = table.rows.length;
    // delete last cell in each row
    for ( var i = 0; i < rows; i++) {
        var cols = table.rows[i].cells.length;
        if (cols < 2) {
            continue;
        }
        table.rows[i].deleteCell(-1);
    }
}
