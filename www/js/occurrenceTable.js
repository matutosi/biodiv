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
function createOccurrenceTable(id_table){
// const id_table = "occurrence"
  var table = document.getElementById(id_table);
  const col_names = getFirstChild(document.getElementsByClassName("table_setting_1"));
  const dat_types = getFirstChild(document.getElementsByClassName("table_setting_2"));
  const optionals = getFirstChild(document.getElementsByClassName("table_setting_3"));
  const n_col = col_names.length;
  const n_row = table.rows.length;  // n_row means next column number because starting with 0
  if(n_row != 0){
    alert("Can not create table, \n table already exists")
    return;
  }
  createTable(table, getValues(col_names));
  var tr = document.createElement('tr');
  for(let i=0; i<n_col; i++){
    if(col_names[i].value !== ""){
      var td = document.createElement('td');
      switch(dat_types[i].value){
          case "auto": // date or no
            if(col_names[i].value === "date") td.innerHTML = getNow();
            if(col_names[i].value === "no")   td.innerHTML = 1;
            break;
          case "button": // delButton
    //      createInput(ty, va, pl, on, im);
            td.appendChild(createInput("button", "DELETE", "", "deleteRow(this)", ""));
            break;
          case "checkbox":
            td.appendChild(createInput("checkbox", "1", "", "", ""));
            break;
          case "fixed":
            td.innerHTML = optionals[i].value;
            break;
          case "list":
            arry_list = optionals[i].value.split(',').concat(Array(""));
            td.appendChild(createSelectOpt(arry_list, arry_list.length - 1));
            break;
          case "text":
            td.appendChild(createInput("text", "", "", "", ""));
            break;
          case "number":
            input = createInput("number", "", "", "", "numeric");
            input.setAttribute("min", "0");
            td.appendChild(input);
            break;
        }
        var cl = "occ_" + col_names[i].value;
        var id = "occ_" + col_names[i].value + "_" + "1".padStart(3, `0`);
        td.setAttribute("class", cl);
        td.setAttribute("id"   , id);
        tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  setSortable(id_table);
}

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
    if(col_names[Ni] !== "") addTh(tr, col_names[Ni]);
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

// Helper to call cloneRow() multiple times
function cloneRows(id_table){
  const n_row = document.getElementById("clone_n_row").value;
  for(let i=0; i<n_row; i++) cloneRow(id_table)
}

// Copy bottom row and paste it as new rows
//    id of each cell will be updated: "occ_date_001" -> "occ_date_002"
//    Column date  getNow() will be applied.
//    Column fixed and <select> <option> will be used the same selection.
//    Column "checkbox" and "text" will be made in unchecked and blank.
//    
function cloneRow(id_table){
// var id_table = "occurrence"
  var table = document.getElementById(id_table);
  const col_names = getColNames(table);
  const n_col = col_names.length;
  const n_row = table.rows.length;
  var last_row = table.rows[n_row - 1];  // to get selectedIndex
  var next_row = table.rows[n_row - 1].cloneNode(true);
  for(let Ci = 0; Ci < n_col; Ci++){
    var next_id = updateId(next_row.children[Ci].getAttribute("id"));
    next_row.children[Ci].setAttribute("id", next_id);
    switch(col_names[Ci]){
      case "date":  // update "date"
        next_row.children[Ci].innerHTML = getNow();
        break;
      case "delButton": // do nothing
        break;
      case "no":   // no = max(no) + 1
        var nos = getInnerHTML(document.getElementsByClassName("occ_no"));
        next_row.children[Ci].innerHTML = Math.max.apply(Math, string2Numeric(nos)) + 1;
        break;
      default:
        if(next_row.children[Ci].firstChild.value === void 0){  
          // void 0 means undifined -> fixed text: do nothing
          break;
        } else {
          switch(next_row.children[Ci].firstChild.getAttribute("type")){
            case "checkbox": // clear checkbox
              next_row.children[Ci].firstChild.checked = false;
              break;
            case "text":    // clear input text
            case "number":  // clear input text
              next_row.children[Ci].firstChild.value = "";
              break;
            case null: // select from list
              selected_opt = last_row.children[Ci].firstChild.selectedIndex;
              next_row.children[Ci].firstChild.selectedIndex = selected_opt;
              break;
          }
        }
        break;
    }
  }
  table.appendChild(next_row);
}