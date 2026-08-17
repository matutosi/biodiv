// Show the page of the clicked tab and hide the others (used as the onclick of a tab).
function changeTab(){
  const ref = decodeURI(this.href);  // For multibyte character
  const targetid = ref.substring(ref.indexOf('#')+1, ref.length);
  // console.log([ref,targetid]);
  // show selected tab
  for(let i = 0; i < pages.length; i++) {
    if( pages[i].id != targetid ) {
      pages[i].style.display = "none";
    }
    else {
      pages[i].style.display = "block";
    }
  }
  // show front
  for(let i = 0; i < tabs.length; i++) {
    tabs[i].style.zIndex = "0";
  }
  this.style.zIndex = "10";
  // Updates
  updateInputsPlotLayerSpecies();

  // needs not to move tab
  return false;
}


// Give every tab, new ones included, changeTab() as its onclick.
function updateTab(){
  // get elements
  const tabs = document.getElementById('tabcontrol').getElementsByTagName('a');
  // when clicked, enable to run changeTab() in all tab
  for(let i = 0; i < tabs.length; i++) {
    tabs[i].onclick = changeTab;
  }
}

// Redraw everything that follows the input: the all plots tables, the PLOT and Layer selects, and the species lists.
function updateInputsPlotLayerSpecies(){
  updateAllInputsTables();  // All plots
  updatePlotLayer({});      // PLOT and Layer select in Tools
  updateSpeciesList();      // species list
}

// Redraw every species list from the list selected in it.
//   A module can hold two pull downs of species lists: the one that says
//   which list is shown, and the one that says which list to delete. Both
//   need their options refreshed, because a list may have been registered
//   or deleted since they were built. Only the first one decides what is
//   shown: rebuilding from the delete pull down as well would take its own
//   empty value and wipe the species the first one just put there.
const SL_SELECT_SELECTOR = "select[id^='sp_list_select-']:not([id$='-flora'])";
const SL_DELETE_SELECTOR = "select[id^='sp_list_delete_name-']";

function updateSpeciesList(){
  for(const select of document.querySelectorAll(SL_SELECT_SELECTOR + ',' + SL_DELETE_SELECTOR)){
    updateSelectSLById(select.id);
  }
  // Query again: updateSelectSLById() puts a new element in place of each one.
  for(const select of document.querySelectorAll(SL_SELECT_SELECTOR)){
    const ns = getSlNs(select.id);
    const id = 'sp_list_sp_list-' + ns;
    const is_checked = document.getElementById('sp_list_checkbox-' + ns).checked;
    replaceSpeciesList(select.value, id, is_checked);
  }
}

// Add the PLOT column, holding the plot name, in front of a table definition.
function addPlotId(plot_data, id){
  // var plot_data = temp1;
  plot_data['biss_c_names'].unshift(COL.PLOT);
  plot_data['biss_d_types'].unshift('fixed');
  plot_data['biss_selects'].unshift('');
  plot_data['biss_inputs'][COL.PLOT] = [id];
  return plot_data;
}

// Add the NO column, holding the plot number, in front of a table definition.
function addPlotNo(plot_data, no){
  // var plot_data = temp1;
  plot_data['biss_c_names'].unshift(COL.NO);
  plot_data['biss_d_types'].unshift('fixed');
  plot_data['biss_selects'].unshift('');
  plot_data['biss_inputs'][COL.NO] = [no];
  return plot_data;
}

// The largest plot number in use, or 0 when there is no plot yet.
function getPlotMaxNo(){
  const tables = document.querySelectorAll("table[id^='input_plot']");
  const max_no = [0];
  for(const tb of tables){
    max_no.push(getColData(tb, COL.NO)[0]);
  }
  return Math.max.apply(Math, string2Numeric(max_no));
}

// Add a tab
//   in progress
function addInputTab({ obj, id }){
  // input PLOT name
  if(id == void 0){
    id = prompt(msg('prompt_plot'), "");
  }
  if(null === id){
    return void 0;
  }
  if(/_/.test(id)){
    alert( msg('alert_plot_ub') );
    return void 0;
  }
  if('' === id){
    alert( msg('alert_plot_empty') );
    return void 0;
  }
  if(null !== document.getElementById(id)){
    alert( msgF('alert_plot_dup', id) );
    return void 0; 
  }
  // create tabcontrol
  const a = crEl({ el: 'a', ats: {href: "#" + id}, ih: id });
  document.getElementById('tabcontrol').insertBefore(a, obj);

  // create tabbody
  const tabbody = document.getElementById('tabbody');
  const div = crEl({ el: 'div', ats: {id: id} });
  tabbody.appendChild(div);

  // create input tables
      // PLOT
  let plot_setting = convertTableData( getTableData( document.getElementById('tab_settings').getElementsByTagName('table')[0] ) );
  plot_setting = addPlotNo(plot_setting, getPlotMaxNo() + 1);
  plot_setting = addPlotId(plot_setting, id);
  const pl_table = tableModule({table_data: plot_setting, ns: 'input_plot_' + id, 
                              id_text: true, 
                              hide_button: true, fit_button: true })
  div.appendChild( pl_table );
  document.getElementById('input_plot_' + id + '_fit').onclick();

      // OCC
  let occ_setting = convertTableData( getTableData( document.getElementById('tab_settings').getElementsByTagName('table')[1] ) );
  occ_setting = addPlotId(occ_setting, id);
  const oc_table = tableModule({table_data: occ_setting, ns: 'input_occ_' + id, 
                              id_text: true, search_input: true,
                              hide_button: true, fit_button: true, 
                              add_button: true, calc_button: true})
  div.appendChild( oc_table );
  document.getElementById('input_occ_' + id + '_nrow').value = 3;
  document.getElementById('input_occ_' + id + '_add_rows').onclick();
  updateTab();
  tabs[tabs.length - 1].onclick();  // move tab
  const table = searchParentTable(oc_table);
  setSortable(table.id);  // Should setSortable() after appendChild()

  // void 0 hides the pull downs: createSpecieUlModule() reads it as "do not show"
  const show_select_options = (occ_setting.biss_c_names.indexOf(COL.LAYER) < 0) ? void 0 : true;
  const ul_module = createSpecieUlModule({ species: '', ns: id,
                  show_select_button   : true, 
                  show_comp_checkbox   : true, 
                  show_text_input      : true, 
                  show_select_options  : show_select_options   });
  div.appendChild( ul_module );
  // all update
  updateInputsPlotLayerSpecies()
}

// Rebuild the plot, occurrence and composition tables of the All plots tab.
function updateAllInputsTables(){
  const pl_table = createAllInputsTable('input_plot')
  const oc_table = createAllInputsTable('input_occ' )
  if(pl_table === void 0){ return void 0; }
  document.getElementById('plot_all').replaceWith(pl_table);
  document.getElementById('occ_all' ).replaceWith(oc_table);
  setSortable( searchParentTable(pl_table).id );
  setSortable( searchParentTable(oc_table).id );

  const tables = document.querySelectorAll("table[id^='input_occ']");
  const comp_table = createCompTable(tables);
  document.getElementById('comp_table').replaceWith(comp_table);
  setSortable( searchParentTable(comp_table).id );
}

// Stack every input table of one kind into one table, without the button columns (DELETE, UPDATE_TIME_GPS).
function createAllInputsTable(table_name){
  // var table_name = "input_occ"; var table_name = "input_plot";
  const tables = document.querySelectorAll("table[id^='" + table_name + "']");
  if(0 === tables.length){ return void 0; }  // return void 0, when no input tables
  let c_names = getUniqeColNames(tables);
  c_names = c_names.filter(item => ! BUTTON_COLS.includes(item));

  const inputs = getMultiTableInputs(tables, c_names);
  const d_types = Array(c_names.length).fill('fixed');
  const selects = Array(c_names.length).fill('');

  const all_data = {
    biss_c_names: c_names,
    biss_d_types: d_types,
    biss_selects: selects,
    biss_inputs : inputs
  }

  const all_table_name = table_name.split("_")[1] + '_all';
  //   var all_table = makeTableJO(all_data, all_table_name);
  const all_table = tableModule({table_data: all_data, ns: all_table_name,
                              search_input: true,
                              fit_button: true, hide_button: true});
  return all_table;
}
// The column names of several tables, each of them once.
function getUniqeColNames(tables){
  let c_names = [];
  for(let i = 0; i < tables.length; i++) {
    c_names = c_names.concat(getColNames(tables[i]));
  }
  return uniq(c_names);
}
// The data of the given columns, read from several tables and joined per column.
function getMultiTableInputs(tables, c_names){
  const inputs = {};   // keyed by column name
  for(const c_name of c_names){ inputs[c_name] = []; }
  for(const tb of tables){
    const cols = getColsData(tb, c_names);   // one walk per table, not per column
    for(const c_name of c_names){
      for(const value of cols[c_name]){ inputs[c_name].push(value); }
    }
  }
  return inputs;
}

// The names of the columns that hold a pull down in any of the tables.
function getMultiTableSelects(tables){
  const selects = [];
  for(const table of tables){
    const d_types = getDataTypes(table);
    const c_names = getColNames(table);
    const indices = multiIndexOf(d_types, 'list');
    for(const i of indices){
      selects.push(c_names[i]);
    }
  }
  return uniq(selects);
}

// The options of the given columns, collected over several tables.
function getMultiTableOptions(tables, c_names){
  const options = {};   // keyed by column name
  for(const c_name of c_names){
    options[c_name] = [];
    for(const tb of tables){
      options[c_name] = options[c_name].concat(getSelectOne(tb, c_name));
    }
  }
  return options;
}

// Make an unidentified species name unique per plot (or per the plot named in SameAs), so that two of them are not counted as one.
function checkSameAs(inputs, pl, sp, id, sa){
  // var inputs = temp1; var pl = 'PLOT'; var sp = 'Species'; var id = 'Identified'; var sa = 'SameAs';
  for(let i=0; i < inputs[pl].length; i++){
    if(inputs[id][i] === false)
      if(inputs[sa][i] === ''){
         inputs[sp][i] = inputs[sp][i] + '_' + inputs[pl][i];
       }else{
         inputs[sp][i] = inputs[sp][i] + '_' + inputs[sa][i];
      }
  }
  return inputs;
}
// Build the composition table: species by plot, holding the cover ('--' when present without a cover).
function createCompTable(tables, pl = COL.PLOT, sp = COL.SPECIES, ab = COL.COVER, id = COL.IDENTIFIED, sa = COL.SAME_AS){
  // var pl = "PLOT"; var sp = "Species"; var ab = "Cover"; id = "Identified"; sa = "SameAs"; var tables = document.querySelectorAll("table[id^='input_occ']");
  let inputs = getMultiTableInputs(tables, [pl, sp, ab, id, sa]);
  // console.log(inputs);
  inputs = checkSameAs(inputs, pl, sp, id, sa)
  const uniq_pl = uniq(inputs[pl]);
  const uniq_sp = uniq(inputs[sp]);
  const c_names = [sp].concat(uniq_pl);
  const data_table = {};   // keyed by column name: the species, then one per plot
  data_table[sp] = uniq_sp;
  for(const p of uniq_pl){
    const data_col = [];
    for(const s of uniq_sp){
      let value = 0;
      let is_present = 0;
      for(let i=0; i < inputs[ab].length; i++){
        if(inputs[pl][i] === p && inputs[sp][i] === s ){
          value = value + Number(inputs[ab][i]);
          is_present++;
        }
      }
      if(is_present === 0){  // absent
        value = '';
      }else{                 // present
        if(value === 0){
          value = '--';    // present, but no cover was given
        }
      }
      data_col.push(value);
    }
    data_table[p] = data_col;
  }
  data_table;

  const d_types = Array(c_names.length).fill('fixed');
  const selects = Array(c_names.length).fill('');
  const comp_data = {
    biss_c_names: c_names,
    biss_d_types: d_types,
    biss_selects: selects,
    biss_inputs : data_table
  }
  const comp_table = tableModule({table_data: comp_data, ns: 'comp_table',
                              id_text: true, search_input: true,
                              hide_button: true})
  return comp_table;
}
