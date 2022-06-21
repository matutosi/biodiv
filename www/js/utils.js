


  // getSelectOption()
  // splitByGroup()


// Sum by group
function sumByGroup(grouped_array){
  
}

// Split array by group
//    @params array An array.
//    @params group An array.
//    @return Grouped array. 
//    @examples
//    var array = [ 1,   2,   3,   4];
//    var group = ["a", "b", "a", "b"];
//    splitByGroup(array, group);
//    // [a: [1,3], b: [2,4]]
function splitByGroup(array, group){
  if(array.length !== group.length){ return array; }
  var grouped = [];
  for(let i=0; i < array.length; i++){ grouped[group[i]] = []; }
  for(let i=0; i < array.length; i++){
    grouped[group[i]].push(array[i]);
  }
  return grouped;
}

// Get data from occurrence table.
//    returns [array], [array], [array], 
//    Each array means a row in the table. 
//    
function getTableData(id_table){
  const table = document.getElementById(id_table);
  const col_names = getColNames(table);
  const n_col = col_names.length;
  const n_row = table.rows.length;
  const data_types = getDataType(table);
  var table_data = [];
  for(let Rj=0; Rj<n_row; Rj++){
    var row_rj = table.rows[Rj].cells;
    var row_data = [];
    for(let Ci=0; Ci<n_col; Ci++){
      switch(data_types[Ci]){
        case "delButton":  //  skip
          break;
        case "date":
        case "no":
        case "fixed":
          row_data[Ci] = row_rj[Ci].innerHTML;
          break;
        case "text":
        case "number":
          row_data[Ci] = row_rj[Ci].firstChild.value;
          break;
        case "checkbox": 
          row_data[Ci] = row_rj[Ci].firstChild.checked;
          break;
        case "select_option":
          row_data[Ci] = row_rj[Ci].firstChild.selectedIndex;
          break;
      }
    }
    table_data[Rj] = row_data;
  }
  return table_data;
}

function getCellData(cell_data, data_type){
  switch(cell_data, data_type){
    case "delButton":  //  skip
      return null;
      break;
    case "date":
    case "no":
    case "fixed":
      return cell_data.innerHTML;
      break;
    case "text":
    case "number":
      return cell_data.firstChild.value;
      break;
    case "checkbox": 
      return cell_data.firstChild.checked;
      break;
    case "select_option":
      return cell_data.firstChild.selectedIndex;
      break;
  }
}

// Get options in select tag
//    Retrun string like "B1,B2,..." for select tag,
//    "" (vacant string) for pother input tag
//    
function getSelectOption(table){
  const data_types = getDataType(table);
  const row_1 = table.rows[1].cells;  // table row except th (rows[0])
  var select_opt = [];
  for(let Ci = 0; Ci < data_types.length; Ci++){ select_opt[Ci] = ""; }
  for(let Ci = 0; Ci < data_types.length; Ci++){
    if(data_types[Ci] === "select_option"){
      opts = row_1[Ci].firstChild.children;
      for(opt of opts){ select_opt[Ci] = select_opt[Ci] + "," + opt.value; }
    }
  }
  return select_opt;
}

// Get data types from occurrence table.
//    Columns shown below are special, 
//        "date", "delButton", "no", "locLat", "locLon", "locAcc"
//        These columns can not be set by users. 
//    Other columns can be devided into 5 data types: 
//        "fixed", "checkbox", "text", "number", "select_option".
//    
function getDataType(table){
//   const table = document.getElementById(id_table);
  const col_names = getColNames(table);
  const n_col = col_names.length;
  const first_data_row = table.rows[1].cells;
  var data_type = [];
  for(let Ci = 0; Ci < n_col; Ci++){
    switch(col_names[Ci]){
      case "date":
      case "delButton":
      case "no":
        data_type[Ci] = col_names[Ci];
        break;
      default:
        var f_child = first_data_row[Ci].firstChild;
        if(f_child.value === void 0){
          data_type[Ci] = "fixed";
        } else {
          if(f_child.getAttribute("type") === null){
            data_type[Ci] = "select_option";
          } else {
            data_type[Ci] = f_child.getAttribute("type");
          }
        }
      break;
    }
  }
  return data_type;
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

function getColNames(table){
  const row_0 = table.rows[0];
  const col_names = [];
  for(let Ri=0; Ri<row_0.cells.length; Ri++){
    col_names[Ri] = row_0.cells[Ri].innerHTML;
  }
  return col_names
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

// Get time like 2022_05_18_15_51_28: yyyy-mm-dd-hh-mm-ss
function getNow(){
   var now = new Date();
   const yr  = now.getFullYear();
   const mo  = String(now.getMonth()).padStart(2, `0`);
   const dd  = String(now.getDate()).padStart(2, `0`);
   const hh  = String(now.getHours()).padStart(2, `0`);
   const mi  = String(now.getMinutes()).padStart(2, `0`);
   const ss  = String(now.getSeconds()).padStart(2, `0`);
  //    const ms  = String(now.getMilliseconds()).padStart(3, `0`);
  //    return(`${yr}_${mo}_${dd}_${hh}_${mi}_${ss}_${ms}`)
   return(`${yr}_${mo}_${dd}_${hh}_${mi}_${ss}`)
}

// delete a row
function deleteRow(obj){
    var tr = obj.parentNode.parentNode;          // clicked row
    tr.parentNode.deleteRow(tr.sectionRowIndex); // delete clicked row
}
