function addRowWithSpecies({ table, layer, species }){
  // var table = document.getElementById('input_occ_a_tb'); var layer = 'H'; var species = 'new_species';
  addRow(table);

  var c_names = getColNames(table);
  if(layer == void 0){ var layer =  '' }; 
  var index_sp = c_names.indexOf('Species');
  var index_ly = c_names.indexOf('Layer');
  var row_no   = table.rows.length - 1;
  var options = getSelectOptionInCell(table.rows[row_no].cells[index_ly].firstChild);
  var index_selected = options.indexOf(layer);

  table.rows[row_no].cells[index_ly].firstChild.selectedIndex = index_selected;
  table.rows[row_no].cells[index_sp].firstChild.value = species;
}

// Helper to call addRow() multiple times
//    @paramas obj  A input element.
//                  Normally use "this". 
//    In BISS, addRows() is generated by createAddRowButton() as below. 
//      createNrowInput() is necessary as well.
//      
//      // Down span
//      var dn = crEl({ el:'span', ats:{id: "dn_" + ns} });
//      dn.appendChild( createNrowInput() );
//      dn.appendChild( createAddRowButton() );
//      // Main
//      var main   = crEl({ el:'span', ats:{id: "main_"   + ns} })
//      main.appendChild(up);
//      main.appendChild(table);
//      main.appendChild(dn);
//      main.appendChild( crEl({ el: 'hr' }) );
function addRows(obj){
  // console.log(obj);
  //   var table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  var n_row = obj.previousElementSibling.value;
  var table = searchParentTable(obj);
  for(let i = 0; i < n_row; i++){ addRow(table); }
}

// Copy buttom row and paste it as new rows
//    Column date  getNow() will be applied.
//    Column fixed and <select> <option> will be used the same selection.
//    Column "checkbox" and "text" will be made as unchecked and blank one.
//    
function addRow(table){
  // console.log(table);
  const col_names = getColNames(table);
  const n_col = col_names.length;
  const n_row = table.rows.length;
  var last_row = table.rows[n_row - 1];  // to get selectedIndex
  var next_row = table.rows[n_row - 1].cloneNode(true);
  for(let Ci = 0; Ci < n_col; Ci++){
    switch(col_names[Ci]){  // // toLowerCase  // // 
      case "DATE":  // update "DATE"
        next_row.children[Ci].innerHTML = getNow();
        break;
      case "LOC_LAT":  // update GPS data
        next_row.children[Ci].innerHTML = getLat();
        break;
      case "LOC_LON":
        next_row.children[Ci].innerHTML = getLon();
        break;
      case "LOC_ACC":
        next_row.children[Ci].innerHTML = getAcc();
        break;
      case "UPDATE_TIME_GPS": // do nothing
      case "DELETE":    // do nothing
        break;
      case "NO":   // no = max(no) + 1
        var nos = getColData(table, col_names[Ci]);
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
