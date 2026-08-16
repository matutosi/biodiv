// Search text input tags in a table and show only matching rows
//    Results are shown immediately.
//    Using in Input Table.
//    Clear input text, ALL rows will be shown.
//    Regular expression can be used.
//    @param obj  A input element.
//                  Normally use "this". 
function searchTableText(obj){
  // console.log(obj);
  // console.log(obj.value);
  // console.log(obj.parentNode.nextElementSibling);
  const input = obj.value;
  const reg_ex = new RegExp(input, 'i');  // i: case-insensitive
  const table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  // var table = document.getElementById('occ_all_tb');
  const trs   = table.rows;
  const data_types   = getDataTypes(table);
  const is_shown_col = isShownCol(table);
  // The header and the hide row always stay: give them a count above zero.
  const display_flag = [1, 2];
  for(let Rj = ROW_FIRST_DATA; Rj < trs.length; Rj++){ display_flag[Rj] = 0; }
  for(let Ci = 0; Ci < data_types.length; Ci++){
    if((data_types[Ci] === "text" || data_types[Ci] === "fixed") && is_shown_col[Ci]){
      for(let Rj = 1; Rj < trs.length; Rj++){
        const text = getCellData(trs[Rj].cells[Ci]);
        if(reg_ex.test(text)){ display_flag[Rj]++; }
      }
    }
  }
  for(let k = 1; k < display_flag.length; k++){
    if(display_flag[k] > 0) { trs[k].style.display = "";     }
    else                    { trs[k].style.display = "none"; }
    if(input === "")        { trs[k].style.display = ""; }
  }
}

// Helper for searchTableText().
//    @param table  A table element.
//    @return       An array of logical, which has length of columns.
function isShownCol(table){
  const display_style_none = [];
  const ths = headerRow(table).cells;
  for(let i=0; i<ths.length; i++){
    display_style_none.push(!!!ths[i].getAttribute('style'));
  }
  return display_style_none;
}
