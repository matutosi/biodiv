// old codes
function generateTable(data){
  var table = crEl({ el: 'table' });
  table.appendChild( crEl({ el: 'th', tc: "wamei" }) );
  for(let i = 0; i < data.length; i++){
    var tr = crEl({ el: 'tr' });
    var td = crEl({ el: 'td', tc: data[i] });
    tr.appendChild( td );
    tr.style.display = 'none';
    table.appendChild(tr);
  }
  return table
}

// wamei
function generateSearchTable(ns, table){
  // Up span
  var up = crEl({ el:'span', ats:{id: "up_" + ns} });
  up.appendChild( crEl({ el: 'B', tc: ns})  );
  up.appendChild( createSearchShowInput()   );
  up.appendChild( createSearchShowButton()  );
  up.appendChild( createSearchWameiButton() );
  // Table
  var table = generateTable(wamei);
  // Main
  var main   = crEl({ el:'span', ats:{id: "main_"   + ns} });
  main.appendChild(up);
  main.appendChild(table);
  return main;
}

// Fetch keys that begin with "bis_" from localStorage.
//    @return    A string array of localStorage keys.
function fetchLSKeys(){
  var keys = [];
  Object.keys(localStorage).forEach( function(key) {
      if( RegExp("bis_").test(key) ){ keys.push(key.replace("bis_", "")) ;}
  });
  return keys
}

// Get data and optional information from a table.
//    @param id_table      A string to specify table id.
//    @return               Nothing.
function saveTable(id_table){
  // var id_table = "occ_setting_table";
  var table_data = getTableDataPlus(id_table);
  localStorage.setItem("bis_" + id_table, table_data);
}

// get latest GPS location
//   Use with tags below in html
//   <div id="getloc" ></div>
//   <input type="button" value="get" onclick="getPosition()" />
function getPosition() {
  document.getElementById('getloc').innerHTML +=
    locations.lat[locations.lat.length - 1]   + ', ' + 
    locations.lon[locations.lon.length - 1]   + ', ' + 
    locations.acc[locations.acc.length - 1]   + ', ' + 
     '<br>';
}

function restoreInputPart(ns, id_table=""){
  var main = crEl({ el:'span' });
  var table_name = ns + "_input_table_" + id_table;
  // search
  var id = ns + "search_text";
  // console.log(ns);

  //   var onkeyup = "searchTable('" + table_name + "', this)";
  var onkeyup = "searchTableText(this)"; // for test

  main.appendChild( createInput({ type:"text", id: id, onkeyup: onkeyup, placeholder: "Search text input" }) );
  main.appendChild( createInput({ type:"button", value:"ShowCols", onclick:"showInputCols(this)"}) );

  //   table
  // console.log(table_name);
  var table = restoreTable(table_name, "");
  main.appendChild(table);
  setSortable(table_name);

  // add rows
  main.appendChild(createInputNrow(    table_name + "_n_row" ));
  main.appendChild(createButtonAddRow( table_name            ));  // input: table name to add rows

  // calc sum
  var onclick = "showSumByGroup('" + table_name + "', 'Cover', 'Layer', '" + table_name + "_calc_result')"; 
  main.appendChild( createInput({ type: "Button", value: "Calculate", onclick: onclick }) );
  var span = document.createElement('span');
  span.appendChild( crEl({ el: 'table', ats: {id: table_name + "_calc_result"} })); // table with no data
  main.appendChild(span);

  // hr
  main.appendChild( document.createElement('hr') );

  return main;
}


function createSettingSpan(ns){
  // var ns = "occ_setting";
  // main-subtitle
  //   var main = document.getElementById('setting');
  var main = crEl({ el: 'span', ats:{id: ns} });
  main.appendChild( crEl({ el: 'strong',ih: ns }) );
  main.appendChild( createButtonHideShow(ns + "_contents" ) );
  // main-span
  var span = crEl({ el: 'span', ats: {id: ns } });
  main.appendChild(span);
  // span-contents
  var contents = crEl({ el: 'span', ats: {id: ns + "_contents" } });
  contents.style.display  = "block"; // default: show contents
  // contents
  contents.appendChild( createSetting(       ns + "_table", "data." + ns + "_json"));
  contents.appendChild( createInputNrow(     ns + "_table_n_row"     ));
  contents.appendChild( createButtonAddRow(  ns + "_table"           ));  // input: table name to add rows
  contents.appendChild( createButtonNewTable(ns + "_new_table"       ));
  span.appendChild(contents);
  // hr for division
  span.appendChild( document.createElement('hr') );
  return main;
}

function createButtonNewTable(id_table){
  var name = id_table.split('_')[0]; // meta, plot, occ
  var value = "Create new " + name + " table";
  var onclick = "createInputPart('" + name + "')";
  // console.log(onclick);
  return createInput({ type: "button", value: value, onclick: onclick });
}


function createInputPart(ns){
  var main = document.getElementById('tab_inputs');
  var table_name = ns + "_input_table";
  // search
  var id = ns + "search_text";
  // console.log(ns);
  var onkeyup = "searchTable('" + table_name + "', this)";
  main.appendChild( createInput({ type:"text", id: id, onkeyup: onkeyup,  placeholder: "Search text input" }) );

  //   table
  var table = createInputTable(ns);
  main.appendChild(table);
  setSortable(table_name);

  // add rows
  main.appendChild(createInputNrow(    table_name + "_n_row" ));
  main.appendChild(createButtonAddRow( table_name            ));  // input: table name to add rows

  // calc sum
  var onclick = "showSumByGroup('" + table_name + "', 'Cover', 'Layer', '" + table_name + "_calc_result')"; 
  main.appendChild( createInput({ type: "Button", value: "Calculate", onclick: onclick }) );
  var span = document.createElement('span');
  span.appendChild( crEl({ el: 'table', ats: {id: table_name + "_calc_result"} })); // table with no data
  main.appendChild(span);

  // hr
  main.appendChild( document.createElement('hr') );
}

function createInputTable(ns){
  // console.log(id_span);
  // var id_span    = "input";
  // var id_setting = "meta_setting_table" ;
  // var id_table   = "meta_input_table";
  var setting_table = document.getElementById(ns + "_setting_table");
  var st_cnames = getColNames(setting_table);
  const col_names = getColData(setting_table, st_cnames[0]);
  const dat_types = getColData(setting_table, st_cnames[1]);
  const optionals = getColData(setting_table, st_cnames[2]);
  //   const optionals = getColData(table, col_names[3]);
  var id_table = ns + "_input_table";
  var table = crEl({ el: 'table',  ats: {id: id_table} })
  createTable(table, col_names); // add th

  var tr = document.createElement('tr');
  for(let i = 0; i < col_names.length; i++){
    if(col_names[i] !== ""){
      var td = createInputTd(dat_types[i], col_names[i], optionals[i]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
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
  //     if(col_names[Ni] !== "") tr.appendChild( crEl({ el: 'th', ih: col_names[Ni] }) );
    if(col_names[Ni] !== ""){
      var th = crEl({ el: 'th', ih: col_names[Ni] });
      th.appendChild( crEl({ el: 'input', ats:{type: "checkbox"} }) );
      tr.appendChild(th);
    }
  }
  table.appendChild(tr)  // return by side effiect
}

// Helper to call cloneRow() multiple times
function cloneRows(id_table){
  const n_row = document.getElementById(id_table + "_n_row").value;
  // console.log(n_row);
  for(let i=0; i<n_row; i++) cloneRow(id_table)
}

// Copy buttom row and paste it as new rows
//    id of each cell will be updated: "occ_date_001" -> "occ_date_002"
//    Column date  getNow() will be applied.
//    Column fixed and <select> <option> will be used the same selection.
//    Column "checkbox" and "text" will be made in unchecked and blank.
//    
function cloneRow(id_table){
// var id_table = "meta_input_table"
  var table = document.getElementById(id_table);
  const col_names = getColNames(table);
  const n_col = col_names.length;
  const n_row = table.rows.length;
  var last_row = table.rows[n_row - 1];  // to get selectedIndex
  var next_row = table.rows[n_row - 1].cloneNode(true);
  for(let Ci = 0; Ci < n_col; Ci++){
  // console.log(col_names[Ci].toLowerCase());
    switch(col_names[Ci].toLowerCase()){
      case "date":  // update "date"
        next_row.children[Ci].innerHTML = getNow();
        break;
      case "loclat":  // update GPS data
        next_row.children[Ci].innerHTML = getLat();
        break;
      case "loclon":
        next_row.children[Ci].innerHTML = getLon();
        break;
      case "locacc":
        next_row.children[Ci].innerHTML = getAcc();
        break;
      case "updatebutton": // do nothing
      case "delbutton":    // do nothing
        break;
      case "no":   // no = max(no) + 1
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

// Get Hidden column names in a table.
//   Not used yet in code for showing column. 
//     Should be worked with showInputCols() and hideInputCol(). 
//     Have no idea to code this.s
function hiddenInputCols(table){
  // var table = document.getElementById("occ_input_table_example_01");
  var row_0 = table.rows[0];
  var hidden_cols = [];
  for(let Ci = 0; Ci < row_0.cells.length; Ci++){
    if(row_0.cells[Ci].style.display === 'none'){ hided_cols.push(row_0.cells[Ci].innerText) ;}
  }
  return hidden_cols;
}

// Show columns in a table.
//    Should be set button as shon below, 
//      <input type="button" value="ShowCols" onclick="showInputCols(this)">
//    Can be generated by folowing code.
//      createInput({ type:"button", value:"ShowCols", onclick:"showInputCols(this)"})
//    The button should be put JUST BEFORE the table.
//    @param obj input button.
//      which can be specified by obj.nextElementSibling.
function showInputCols(obj){
  var table = obj.nextElementSibling;
  for(let Ci = 0; Ci < table.rows[0].cells.length; Ci++){
    for(let Rj = 0; Rj < table.rows.length; Rj++){
      table.rows[Rj].cells[Ci].style.display = '';
    }
  }
}

// Hide a column in a table.
//    hideInputCol() can only hide a column, use showInputCols() to show hidden columns again.
//    Should be set button in each th as shon below, 
//      <input type="button" value="Hide col" onclick="hideInputCol(this)">
//    Can be generated by folowing code.
//      crEl({ el: 'input', ats:{type: "button", value: "Hide col", onclick: "hideInputCol(this)"} })
//    The button should be put in th (table header).
//    @param obj input button.
function hideInputCol(obj){
  var table = obj.parentNode.parentNode.parentNode;
  var c_name = obj.parentNode.innerText;
  var c_no = getColNames(table).indexOf(c_name);
  for(let Rj = 0; Rj < table.rows.length; Rj++){
    table.rows[Rj].cells[c_no].style.display = 'none';
  }
}

function createInputNrow(id_input){
  return createInput({ id: id_input, type: "number", value: "3", step: "1", min: "1", max:"20" });
}

function createButtonAddRow(table){
  return createInput({ type: "button", value: "Add row(s)", onclick: "cloneRows('" + table + "')" });
}


// Create captions for settings
function createButtonHideShow(id_span){
  var id      = id_span + "_hide_show";
  var onclick = "switchHideShowSpan('" + id_span + "', this)";
  return createInput({id: id, type: "button", value: "Hide table", onclick: onclick })
}
function switchHideShowSpan(id_span, button){
  var contents = document.getElementById(id_span);
  if(contents.style.display === "block"){ // show -> hide
    contents.style.display = "none";
    button.setAttribute("value", "Show table");
  }else{                                  // hide -> show
    contents.style.display = "block";
    button.setAttribute("value", "Hide table");
  }
}

// Create setting table
//    TODO: Write documents !!!!!!!!!!!!
//    
//    
function createSetting(id_table, json){
// var json = data.stand_json;
// var id_table = "setting_stand";
  var json = eval(json);  // convert String to JSON object
  // // // settings // // // 
  // data.stand_json: item, type, value, option, hide
  for(key of jsonKeys(json)){
    eval("var " + key + " = extractJson(json)['" + key + "'];");
  }
  var heads = jsonKeys(json);
  const data_types = data.data_types;

  // table
  var table = crEl({ el: 'table', ats: {id: id_table} });

  // head
  var tr = document.createElement('tr');
  for(head of heads){ tr.appendChild(crEl({ el: 'th', ih: head })); }
  table.appendChild(tr);

  // body
  for(let i = 0; i < json.length; i++){
    var tr = document.createElement('tr');
    // item
    tr.appendChild( createTd( createInput({ type: "text", value: item[i] }) ) );
    // type
    tr.appendChild( createTd( createSelectOpt( Array(type[i]).concat(data_types) ) ) );
    // value
    tr.appendChild( createTd( createInput({ type: "text", value: value[i], placeholder: option[i] }) ) );
    // option
    tr.appendChild( createTd( createInput({ type: "text"}) ) );
    // show/hide checkbox
    var input_table = id_table.split("_")[0] + "_input_table";    // id_table: setting_table
    tr.appendChild( createTd( createInput({ type: "checkbox", onclick: "hideCol('" + id_table + "', '" + input_table + "')" }) ) );
    // delButton
    tr.appendChild( createTd( createDelButton() ) );
    // append
    table.appendChild(tr);
  }
  return table;
}
// Hide columns checked in table setting
function hideCol(setting_table, input_table){
  var hide = getColData(document.getElementById(setting_table), "hide");
  var table = document.getElementById(input_table);
  for(let Ci = 0; Ci < table.rows[0].cells.length; Ci++){
    for(let Rj = 0; Rj < table.rows.length; Rj++){
      table.rows[Rj].cells[Ci].style.display = (hide[Ci]) ? 'none' : '';
    }
  }
}


function getNs(button_id){
  return button_id.split("-")[0];
}

function setNs(ns){
  return function(id_name){
    return ns + "-" + id_name;
  };
}
  // var tf = setNs("test")

function showSumByGroup(id_input_table, array, group, id_result){
  // console.log(id_table + ", " + array + ", " + group + ", " + id_show);
  var table = document.getElementById(id_result);
  table.replaceWith( sumByGroup(id_input_table, array, group, id_result) );
}

// Sum by group
//     sumByGroup("occurrence", "Cover", "Layer")
//     
function sumByGroup(id_input_table, array, group, id_result){
  // var id_table = "occ_input_table";
  // var array = "Cover";
  // var group = "Layer";
  var table = document.getElementById(id_input_table);
  var array_val = getColData(table, array);
  var group_val = getColData(table, group);
  var grouped_array = splitByGroup(array_val, group_val);
  var groups = Object.keys(grouped_array).sort();
  var sum_array = [];
  for(let i = 0; i < groups.length; i++){ sum_array[groups[i]] = 0; }
  for(let i = 0; i < groups.length; i++){
    var gr_ar = grouped_array[groups[i]];
    for(let j = 0; j < gr_ar.length; j++){
      sum_array[groups[i]] += Number(gr_ar[j]);
    }
  }
  // if use all select options
  var col_no = getColNames(table).indexOf(group);
  if(getDataType(table)[col_no] === "select-one"){
    var all_groups = getSelectOptionInCell(table.rows[1].cells[col_no].firstChild); 
    var ordered_sum_array = [];
    for(let i=0; i < all_groups.length; i++){
      if(sum_array[all_groups[i]] !== void 0){
        ordered_sum_array[[all_groups[i]]] = sum_array[all_groups[i]];
      }
    }
    var sum = ordered_sum_array;
  } else {
    var sum = sum_array;
  }
  sum = hash2table(sum);
  sum.setAttribute("id", id_result);
  // add th
  var tr = document.createElement('tr');
  tr.appendChild( crEl({ el: 'th', tc: group }) );
  tr.appendChild( crEl({ el: 'th', tc: array }) );
  // add as header
  sum.insertBefore(tr, sum.firstChild);
  return sum;
}

// Made as altenertive function for updateTimeGPS()
//   to avoid the wrong pisition in view (data are correct)
//   however updateTimeGPS_2() result in the same as updateTimeGPS()
function updateTimeGPS_2(obj){
  var table = obj.parentNode.parentNode.parentNode;
  var tr = obj.parentNode.parentNode;
  var c_names = getColNames(table);
  var tds = tr.cells;
  // update
  for(let i = 0; i < tds.length; i++){
    switch(c_names[i]){
      case "Date":
        tds[i].replaceWith( crEl({ el:'td', ih: getNow() }) );
        break;
      case "locLat":
        tds[i].replaceWith( crEl({ el:'td', ih: getLat() }) );
        break;
      case "locLon":
        tds[i].replaceWith( crEl({ el:'td', ih: getLon() }) );
        break;
      case "locAcc":
        tds[i].replaceWith( crEl({ el:'td', ih: getAcc() }) );
        break;
    }
  }
}

// Get options in select tag
//    Return string like "B1,B2,..." for select tag,
//    "" (vacant string) for pother input tag
function getSelectOption(table){
  const data_types = getDataType(table);
  const row_1 = table.rows[1].cells;  // table row except th (rows[0])
  var select_opt = [];
  for(let Ci = 0; Ci < data_types.length; Ci++){ select_opt[Ci] = ""; }
  for(let Ci = 0; Ci < data_types.length; Ci++){
    if(data_types[Ci] === "select-one"){
      opts = row_1[Ci].firstChild.children;
      for(opt of opts){ select_opt[Ci] = select_opt[Ci] + "," + opt.value; }
    }
  }
  return select_opt;
}

// Get data from occurrence table.
//    returns [array], [array], [array], 
//    Each array means a row in the table. 
//    
function getTableData(id_table){
// var id_table = "occurrence";
  const table = document.getElementById(id_table);
  const col_names = getColNames(table);
  const n_col = col_names.length;
  const n_row = table.rows.length;
  const data_types = getDataType(table);
  var table_data = [];
  // th
  var Rj = 0;
  var row_rj = table.rows[Rj].cells;
  var row_data = [];
  for(let Ci = 0; Ci < n_col; Ci++){
    row_data[Ci] = row_rj[Ci].innerHTML;
  }
  table_data[Rj] = row_data;
  // td
  for(let Rj=1; Rj<n_row; Rj++){
    var row_rj = table.rows[Rj].cells;
    var row_data = [];
    for(let Ci = 0; Ci < n_col; Ci++){
      row_data[Ci] = getCellData(row_rj[Ci], data_types[Ci]);
    }
    table_data[Rj] = row_data;
  }
  return table_data;
}

//    @param id_table  A string to specify a table.
//    @param type      A string to specify a data type, 
//                       which can be retrive by get_data_types() as shown below.
//                       "fixed", "text", "button", "checkbox", 'select-one','number'. 
//    @return  A string array.
//    @examples
//    var id_table = "occ_input_example_01";
//    var type = "number";
//    selectColByType(id_table, type);
//    var type = "select-one";
//    selectColByType(id_table, type);
function selectColByType(id_table, type){
  var table = document.getElementById(id_table);
  var types = get_data_types(table);
  var c_names = getColNames(table);
  var cols = [];
  for(let i = 0; i < types.length; i++){
    if(types[i] === type){ cols.push(c_names[i]); }
  }
  return cols;
}

// Search text input tags in a table and show only matching rows
//    Clear input text, all rows will be shown.
//    Regular expression can be used.
//    
function searchTable(id_table, text){
  var input = text.value;
  var reg_ex = new RegExp(input, 'i');  // i: case-insensitive
  var table  = document.getElementById(id_table);
  var trs    = table.rows;
  var data_types = getDataType(table);
  var display_flag = [1];                // 1: show first row (th)
  for(let Rj = 1; Rj < trs.length; Rj++){ display_flag[Rj] = 0; }
  for(let Ci = 0; Ci < data_types.length; Ci++){
    if(data_types[Ci] === "text"){
      for(let Rj = 1; Rj < trs.length; Rj++){
        var text = trs[Rj].cells[Ci].firstChild.value;
        if(reg_ex.test(text)){ display_flag[Rj]++; }
      }
    }
  }
  for(let k = 1; k < display_flag.length; k++){
    if(display_flag[k] > 0) { trs[k].style.display = "";     }
    else                    { trs[k].style.display = "none"; }
    if(input === "")        { trs[k].style.display = "";     } // no input, show all
  }
}
