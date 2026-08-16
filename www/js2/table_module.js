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
    // Build the row as an object. Pasting it together as JSON text and
    // parsing it back breaks on any value holding a " or a \.
    const row = {};
    for(const key of keys){ row[key] = values[key][i]; }
    addRowWithValues({ table: table, values: row });
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
  // The two modules live in named holders, so this works the first time,
  // when there is nothing to replace yet, as well as on every switch after.
  showInHolder('setting_plot_holder', new_plot_module);
  showInHolder('setting_occ_holder',  new_occ_module);
  setSortable(setting + '_plot_tb');
  setSortable(setting + '_occ_tb');
}

// Which module a control belongs to, and how to reach the rest of it.
//   tableModule() builds span#<ns> holding span#<ns>_up, table#<ns>_tb and
//   span#<ns>_dn. Walking to a sibling to find one of those breaks the moment
//   an element is added next to it, which is how loading a settings file came
//   to replace the wrong span. Ask by name instead.
//   @param  obj  An element inside a module.
//   @return      The name space, or null when the element is not in one.
function moduleNS(obj){
  const part = obj.closest('[id$="_up"], [id$="_dn"]');
  return (part === null) ? null : part.id.replace(/_(up|dn)$/, '');
}
// The whole module a control belongs to.
function moduleSpan(obj){
  const ns = moduleNS(obj);
  return (ns === null) ? null : document.getElementById(ns);
}
// The table of the module a control belongs to.
function moduleTable(obj){
  const ns = moduleNS(obj);
  return (ns === null) ? null : document.getElementById(ns + '_tb');
}

// Put an element in a holder, replacing whatever was in it.
//   @param id       A string, the id of the holder.
//   @param element  The element to show.
function showInHolder(id, element){
  const holder = document.getElementById(id);
  holder.textContent = '';
  holder.appendChild(element);
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
                                up.appendChild( createInput({ type: "text", id: ns + '_fname',
                                                              placeholder: msg('file_name'), 'data-msg-ph': 'file_name' }) );
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
                                dn.appendChild( createSelectOpt( colByType(table, "number"), 0, ns + '_sum_value') );
                                dn.appendChild( msgSpan('group_label') );
                                dn.appendChild( createSelectOpt( colByType(table, "list"), 0, ns + '_sum_group') );
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
  const table = searchParentTable(obj);
  const tr = obj.parentNode.parentNode;
  const row_no = tr.sectionRowIndex;
  const c_names = getColNames(table);
  // update
  for(const col of AUTO_COLS){
    const col_no = c_names.indexOf(col);
    if(col_no < 0){ continue; }   // a setting need not offer every one of them
    table.rows[row_no].cells[col_no].innerHTML = autoValue(col);
  }
}

// DONE: 

// Sum numeric with groups.
//     In BISS, number input is the subject to sum, 
//     list input is the options to group.
//   @param obj  A input element.
//                 Normally use "this". 
function sumWithGroup(obj){
  const ns = moduleNS(obj);
  const array = document.getElementById(ns + '_sum_value').value;
  const group = document.getElementById(ns + '_sum_group').value;
  const table = document.getElementById(ns + '_tb');
  const array_val = getColData(table, array);
  const group_val = getColData(table, group);
  const grouped_array = splitByGroup(array_val, group_val);
  // set groups order with 'list'
  const c_no = getColNames(table).indexOf(group);
  const opts = firstDataRow(table).cells[c_no].firstChild.options;
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
  moduleSpan(obj).replaceWith(new_module);
}


// Save settings of plot or occurrence data.
//   @param obj  A input element.
//                 Normally use "this". 
function saveSettings(obj){
  const table = moduleTable(obj);
  const table_data = getTableData(table);
  const table_json = JSON.stringify(table_data);
  let f_name = document.getElementById(moduleNS(obj) + '_fname').value;
  if(f_name === ""){ f_name = table.id.replace(/_tb$/, ''); }
  downloadStrings(table_json, f_name + ".json")
}

