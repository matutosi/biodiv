// 
// 
// 
// 
function addSettingPart(category, obj){
  //   console.log(category);   //  "plot" or "occ"
  //   console.log(obj.value);  //  items to add
  //   var obj = temp1; obj  var obj = temp1; obj.parentNode.nextSibling.nextSibling.nextSibling;
  const table_category = "_" + category + "_tb";
  const table = document.getElementById('tab_settings').querySelector("table[id$='" + table_category + "']");
  const values = data_settings_part[category][obj.value];

  const keys = Object.keys(values);
  const n = values[keys[0]].length;

  for(let i = 0; i < n; i++){
    let json = '{';
    for(const key of keys){
      json = json + '"' + key + '":"' + values[key][i] + '",';
    }
    json = json.slice(0, -1) + '}';
  // console.log( table );
  // console.log( JSON.parse(json) );
    addRowWithValues({ table: table, values: JSON.parse(json) });
  }
}

// Create one button per setting part (date_GPS etc.) of a category, plot or occ.
function addSettingPartButton(category){
  const keys = Object.keys(data_settings_part[category]);
  const main = crEl({ el:'span'});
  main.appendChild( msgSpan('add_to', category) );
  for(const key of keys){
    // NOT translated: key is a name of a setting part, that is data.
    const input = crEl({ el:'input', ats:{ type:'button', value: key, onclick: 'addSettingPart("' + category + '", this)'} });
    main.appendChild(input);
  }
  main.appendChild( crEl({ 'el': 'br' }) );
  return main;
}

// Create the pull down that picks the auto save interval in minutes.
function createAutoSaveIntervalSelect(){
  const main = crEl({ el:'span' });
  main.appendChild( msgSpan('interval') );
  // NOT translated: 'no save' is compared in changeAutoSaveSttting().
  const settings = ['no save', '1', '3', '5', '10', '15', '30', '60'];
  const selects = createSelectOpt(settings, 0, 'select_auto_save_interval');
  selects.setAttribute('onChange', 'changeAutoSaveSttting(this)');
  main.appendChild(selects);
  return main;
}


// Create the pull down that picks the base setting (full, _5_layers, ...).
function createSettingSelect(){
  const main = crEl({ el:'span' });
  main.appendChild( msgSpan('base_setting') );
  // NOT translated: the keys are names of settings, that are data.
  const settings = Object.keys(data_settings);
  const selects = createSelectOpt(settings, 0, 'select_settings');
  selects.setAttribute('onChange', 'changeSettings(this)');
  main.appendChild(selects);
  main.appendChild( crEl({ 'el': 'br' }) );
  return main;
}

// Switch to the base setting of that name, as if it were picked in the pull down.
function changeSettingsByName(ns){
  const select = document.getElementById('select_settings');
  select.selectedIndex = getSelectOptionInCell(select).indexOf(ns)
  changeSettings(select);
}
// Rebuild the plot and occ setting tables from the base setting just picked.
function changeSettings(obj){
  const setting = obj.value;
  const new_plot_module = tableModule({ table_data: data_settings[setting].plot, ns: setting + '_plot',
                                      id_text: true, load_button: true, save_button: true, hide_button: true, 
                                      add_button: true });
  const new_occ_module = tableModule({ table_data: data_settings[setting].occ, ns: setting + '_occ',
                                      id_text: true, load_button: true, save_button: true, hide_button: true, 
                                      add_button: true });
  const old_plot_module = obj.parentNode.nextSibling.nextSibling.nextSibling.nextSibling;
  old_plot_module.replaceWith(new_plot_module);
  const old_occ_module = new_plot_module.nextSibling;
  old_occ_module.replaceWith(new_occ_module);
  setSortable(setting + '_plot_tb');
  setSortable(setting + '_occ_tb');
}

// Create table module
//   In a module has a table and other input elements, 
//   which operate the table.
// @param table_data    
// @param ns            A string to specify input table module.
// @retrun    A span including a table and other elements.
function tableModule({ table_data, ns, 
                       id_text, search_input, 
                       load_button, save_button, 
                       hide_button, fit_button, 
                       add_button, calc_button }){
  const main  = crEl({ el:'span', ats:{id: ns} });
  // Up span
  const up = crEl({ el:'span', ats:{id: ns + "_up"} });
  if(id_text      != void 0){   up.appendChild( crEl({ el: 'B', tc: ns}) ); 
                                up.appendChild( crEl({ el: 'br' }) );
  }
  if(load_button  != void 0){   up.appendChild( msgSpan('load') );
                                up.appendChild( createFileButton() );
  }
                              //     up.appendChild( crEl({ el: 'br' }) );
  if(save_button  != void 0){   up.appendChild( createSaveButton() );
                                up.appendChild( createInput({ type: "text", placeholder: msg('file_name'), 'data-msg-ph': 'file_name' }) );
                                up.appendChild( crEl({ el: 'br' }) );
  }
  if(search_input != void 0)    up.appendChild( createSearchInput() );
  if(hide_button  != void 0)    up.appendChild( createHideButton() );
  if(fit_button   != void 0)    up.appendChild( createFitTable( ns + '_fit' ) ); 

  up.appendChild( crEl({ el: 'br'  }) );
  up.appendChild( crEl({ el: 'span'}) ); // for show button

  // Table
  const table = makeTableJO(table_data, ns + "_tb");

  // Down span
  const dn = crEl({ el:'span', ats:{id: ns + "_dn"} });
  if(add_button  != void 0){    dn.appendChild( createNrowInput( ns + '_nrow') );
                                dn.appendChild( createAddRowButton( ns + '_add_rows') );
  }
  if(calc_button != void 0){    dn.appendChild( crEl({ el: 'hr' }) );
                                dn.appendChild( msgSpan('value_label') );
                                dn.appendChild( createSelectOpt( colByType(table, "number") ) );
                                dn.appendChild( msgSpan('group_label') );
                                dn.appendChild( createSelectOpt( colByType(table, "list") ) );
                                dn.appendChild( createSumButton() );
  }

  main.appendChild(up);
  main.appendChild(table);
  main.appendChild(dn);
  main.appendChild( crEl({ el: 'hr' }) );

  return main;
}


// DONE: update date GPS
// 
// Update "DATE", "LOC_LAT", "LOC_LON", "LOC_ACC"
//    When "Update" bottun clicked, update informations in the row.
//    @param obj Clicked row.
//    @return null.
function updateTimeGPS(obj){
  // settings
  // var obj = temp1;
  const cols = ["DATE", "LOC_LAT", "LOC_LON", "LOC_ACC"];
  const funs = [getNow, getLat, getLon, getAcc]
  const table = searchParentTable(obj);
  const tr = obj.parentNode.parentNode;
  const row_no = tr.sectionRowIndex;
  // update
  for(let i = 0; i < cols.length; i++){
    const col_no = getColNames(table).indexOf(cols[i]);
    const cell = table.rows[row_no].cells[col_no];
    cell.innerHTML = funs[i]();
  }
}

// DONE: 

// Sum numeric with groups.
//     In BISS, number input is the subject to sum, 
//     list input is the options to group.
//   @param obj  A input element.
//                 Normally use "this". 
function sumWithGroup(obj){
  const array = obj.previousElementSibling.previousElementSibling.previousElementSibling.value;
  const group = obj.previousElementSibling.value;
  const table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  const array_val = getColData(table, array);
  const group_val = getColData(table, group);
  const grouped_array = splitByGroup(array_val, group_val);
  // set groups order with 'list'
  const c_no = getColNames(table).indexOf(group);
  const opts = table.rows[2].cells[c_no].firstChild.options;
  const groups = [];
  for(const o of opts){ groups.push(o.value); }
  const sum_array = {};   // keyed by group name
  for(let i = 0; i < groups.length; i++){ sum_array[groups[i]] = 0; }
  for(let i = 0; i < groups.length; i++){
    if(grouped_array[groups[i]] !== void 0){
      const gr_ar = grouped_array[groups[i]];
      for(let j = 0; j < gr_ar.length; j++){
        sum_array[groups[i]] += Number(gr_ar[j]);
      }
    }
  }
  for(let i = 0; i < groups.length; i++){
    sum_array[groups[i]] = Math.round(sum_array[groups[i]] * 10000) / 10000;  // avoid dicimal error
    if(sum_array[groups[i]] === 0){ delete sum_array[groups[i]]; }
  }
  const sum = hash2table(sum_array);
  // add th
  const tr = document.createElement('tr');
  tr.appendChild( crEl({ el: 'th', tc: group }) );
  tr.appendChild( crEl({ el: 'th', tc: array }) );
  sum.insertBefore(tr, sum.firstChild);
  // Show sum
  if(obj.parentNode.lastElementChild === obj){
    obj.parentNode.appendChild(sum);
  } else {
    obj.parentNode.replaceChild(sum, obj.parentNode.lastElementChild);
  }
}



// DONE: utils ???
//    @param table  A table element.
//    @param type   A string to specify a data type, 
//                    which can be retrive by getDataTypes() as shown below.
//                    "fixed", "text", "button", "checkbox", 'list','number'. 
//    @return  A string array.
//    @examples
function colByType(table, type){
  const types = getDataTypes(table);
  const c_names = getColNames(table);
  const cols = [];
  for(let i = 0; i < types.length; i++){
    if(types[i] === type){ cols.push(c_names[i]); }
  }
  return cols;
}

// Create td with a child element. 
//    @param child A child element.
//    @return  A td element with a child element
function createTdWithChild(child){
  const td = document.createElement('td');
  td.appendChild(child);
  return td;
}


// DONE: Save and load Settings 

// Load settings and replace setting table for plot or occurrence.
//   @param obj  A input element.
//                 Normally use "this". 
async function replaceTable(obj){
  const json = await readFile(obj.files[0]);
  const table_data = JSON.parse(json);
  const ns = obj.value.split("\\").slice(-1)[0].replace("\.json", "")
  const new_module = tableModule({ table_data: table_data, ns: ns,
                                      id_text: true, load_button: true, save_button: true, hide_button: true, 
                                      add_button: true });
  const old_ns = obj.parentNode.parentNode.id;
  const old_module = document.getElementById(old_ns);
  old_module.replaceWith(new_module);
}


// Save settings of plot or occurrence data.
//   @param obj  A input element.
//                 Normally use "this". 
function saveSettings(obj){
  const table = obj.parentNode.parentNode.querySelectorAll("table")[0];
  const table_data = getTableData(table);
  const table_json = JSON.stringify(table_data);
  let f_name = obj.nextElementSibling.value;
  if(f_name === ""){ f_name = table.id.replace(/_tb$/, ''); }
  downloadStrings(table_json, f_name + ".json")
}

