// Change table view wide <--> short. 
//   Short table hide th and show label in td.
//   
//    In BISS, input button is generated by following functions.
//        createShortTable()
//        createWideTable
//    @param obj   A input element.
//                   Normally use "this". 
//    @param table A table element.
function shortTable(obj){
  var table = obj.parentNode.nextElementSibling;
  var rows = table.rows;
  rows[0].style.display = 'none';          //  0: colnames
  rows[1].style.display = 'none';          //  1: hide buttons
  for(let Ri = 2; Ri < rows.length; Ri++){ //  2: data
    var tr = rows[Ri];
    tr.style.display = "flex";
    tr.style["flex-wrap"] = "wrap";
  }
  addThLabel(table);
  obj.replaceWith( createWideTable() );
}
function wideTable(obj){
  var table = obj.parentNode.nextElementSibling;
  var rows = table.rows;
  for(let Ri = 0; Ri < rows.length; Ri++){
    var tr = rows[Ri];
    tr.style.display = "";
    tr.style["flex-wrap"] = "";
  }
  removeThLabel(table);
  obj.replaceWith( createShortTable() );
}
function addThLabel(table){
  var c_names = getColNames(table);
  var rows = table.rows;
  for(let Ri = 1; Ri < rows.length; Ri++){
    var row = rows[Ri];
    for(let Cj = 0; Cj < row.cells.length; Cj++){
      var td = row.cells[Cj];
      td.setAttribute("th-lab", c_names[Cj] + ": ")
    }
  }
}
function removeThLabel(table){
  var rows = table.rows;
  for(let Ri = 1; Ri < rows.length; Ri++){
    var row = rows[Ri];
    for(let Cj = 0; Cj < row.cells.length; Cj++){
      var td = row.cells[Cj];
      td.removeAttribute("th-lab");
    }
  }
}
