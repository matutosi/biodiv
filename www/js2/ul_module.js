// The name space of a species list element, taken from its id.
//    Every element of a module is named 'sp_list_<part>-<ns>', where <part>
//    is fixed and holds no '-' (select, checkbox, staged, delete_name, ...)
//    and <ns> is a plot name, 'all' or 'flora'.
//    A plot name MAY hold a '-': addInputTab() refuses '_' and tells the user
//    to write '-' instead. So the name space is everything after the FIRST
//    '-', not the second field of a split: 'sp_list_select-sito-A' is the
//    module of plot 'sito-A', not of a plot called 'sito'.
//    @param  id  A string, the id of an element of a species list module.
//    @return     A string.
function getSlNs(id){
  return id.slice(id.indexOf('-') + 1);
}

// Get species list in compotition table
//    @param  sp  A string to specify a species column.
//                Usually and in default, use 'Species'.
//    @return     An array of species in composition table.
function getSpeciesInComposition(sp = COL.SPECIES){
  const comp = document.getElementById('comp_table_tb');
  if(comp === null){ return []; } // return, when no inputs
  const species = getColData(comp, sp);
  removeEmptyInArray(species);
  return species;
}
// Build a species list module (list select, register, staged species, text box, PLOT and Layer selects, species buttons). Parts not asked for are hidden, not left out.
function createSpecieUlModule({ species, ns,
                                show_select_button     , show_comp_checkbox, show_delete_list, 
                                show_select_ncol       , 
                                show_button_register_sl, 
                                show_text_input        , 
                                show_button_update_pl  , show_select_plot     , show_select_options}){
  // var ns = 'all'; var species = sp_list;
  const base_name = 'sp_list_';
  const main               = createSpanWithId      ( base_name + 'module-'    + ns          );

  const select_button      = createSelectSL        ( base_name + 'select-'    + ns          );
  const select_ncol        = createSelectNumber    ( base_name + 'ncols-'     + ns          );
  const comp_checkbox      = createCompCheckbox    ( base_name + 'checkbox-'  + ns          );

  const button_register_sl = createRegisterSLButton( base_name + 'register-'  + ns          );
  const delete_list        = createDeleteSL        ( base_name + 'delete-'    + ns          );

  const staged             = createSpanWithId      ( base_name + 'staged-'    + ns          );
  const text_input         = createSLInput         ( base_name + 'input-'     + ns          );
  const button_update_pl   = createUpdatePLButton  ( base_name + 'update_pl-' + ns          );
  const button_add         = createSLAdd           ( base_name + 'add-'       + ns          );
  const select_plot        = createSelectPlot      ( base_name + 'plot-'      + ns          );
  const select_options     = createSelectOptions   ( base_name + 'options-'    + ns         );
  // console.log(select_options);
  const sp_list            = createSpecieList    ( base_name + 'sp_list-'   + ns, species );

  main.appendChild( select_ncol         );
  main.appendChild( select_button       );
  main.appendChild( comp_checkbox       );
  main.appendChild( crEl({ el: 'br' })  );
  main.appendChild( button_register_sl  );
  main.appendChild( delete_list         );
  main.appendChild( crEl({ el: 'br' })  );
  main.appendChild( staged              );
  main.appendChild( crEl({ el: 'br' })  );
  main.appendChild( text_input          );
  main.appendChild( crEl({ el: 'br' })  );
  main.appendChild( button_update_pl    );
  main.appendChild( button_add          );
  main.appendChild( select_plot         );
  main.appendChild( select_options      );
  main.appendChild( sp_list             );
  main.appendChild( crEl({el:'hr'})     );

  if( show_select_ncol          === void 0){ select_ncol        .style.display = "none"; }
  if( show_select_button        === void 0){ select_button      .style.display = "none"; }
  if( show_comp_checkbox        === void 0){ comp_checkbox      .style.display = "none"; }
  if( show_delete_list          === void 0){ delete_list        .style.display = "none"; }
  if( show_button_register_sl   === void 0){ button_register_sl .style.display = "none"; }
  if( show_text_input           === void 0){ text_input         .style.display = "none"; }
  if( show_button_update_pl     === void 0){ button_update_pl   .style.display = "none"; }
  if( show_select_plot          === void 0){ select_plot        .style.display = "none"; }
  if( show_select_options       === void 0){ select_options     .style.display = "none"; }

  return main;
}

// span
function createSpanWithId(id){
  return crEl({ el: 'span', ats:{ id: id} });
}

// Select species list
function createSelectSL(id){
  const span   = crEl({ el:'span' });
  const select = createSL(id);
  span.appendChild( msgSpan('s_list') );
  span.appendChild(select);
  return span;
}
// Create the delete button and the pull down of the list it deletes.
function createDeleteSL(id){
  const delete_name = id.replace('delete', 'delete_name');
  const span   = crEl({ el:'span' });
  const delete_button = crEl({ el:'input', ats:{type: 'button', value: msg('delete_list'), 'data-msg': 'delete_list', onclick: 'deleteSl(this)', id: id} });
  const select = createSL(delete_name, '', '');  // '', '': no value picked, no 'NEW' option
  span.appendChild( delete_button );
  span.appendChild( select );
  return span;
}
// Delete the selected species list after a confirmation, then redraw the pull downs.
function deleteSl(obj){
  const sel_de = obj.id.replace('delete', 'delete_name');
  const select = obj.id.replace('delete', 'select');
  const del_list = document.getElementById(sel_de).value;
  const is_ok = confirm( msgF('confirm_del_sl', del_list) );
  if(is_ok){
    removeSLinLS(del_list);
    updateSelectSLById(select);
    updateSelectSLById(sel_de);
  }
  return void 0;
}


// Redraw a species list pull down, keeping what was selected.
function updateSelectSLById(id){
  const old_select = document.getElementById(id);
  const first_option = (/delete/.test(id)) ? '' : 'NEW'
  const selected_value = old_select.value;
  const new_select = createSL(id, selected_value, first_option);
  old_select.replaceWith(new_select);
}
// Create the pull down of the stored species lists ('NEW' first, unless it is the delete one).
function createSL(id, value = '', first_option = 'NEW'){
  const species_list = replaceArrayAll(getKeysOfSLinLS(), 'biss_sl-', '');
  species_list.sort();
  species_list.unshift(first_option);
  const select = createSelectOpt(species_list, 0, id);
  if(value !== ''){ setSelectOption(select, value); }
  select.setAttribute('onchange', 'changeSL(this)');
  return select
}

// Select the option of that value, or the first one when it is not there.
function setSelectOption(select, value){
  const options = getSelectOptionInCell(select);
  const index = Math.max(0, options.indexOf(value));  // -1 (not there) picks the first
  select.options[index].selected = true;
}


// Create the checkbox that adds the composition species to the list.
function createCompCheckbox(id){
  const span     = crEl({ el:'span', ats:{class: 'margin_right'} });
  const checkbox = crEl({ el:'input', ats:{id: id, type: 'checkbox', onchange: 'changeSL(this)'} });
  span.appendChild( msgSpan('include_comp') );
  span.appendChild(checkbox);
  return span;
}

// Redraw the species buttons for the list just selected.
function changeSL(obj){
  const ns = getSlNs(obj.id);
  const id = 'sp_list_sp_list-' + ns;
  const sl = document.getElementById('sp_list_select-' + ns).value;
  // console.log('id:' + id + ', sl:' + sl);
  const is_checked = document.getElementById('sp_list_checkbox-' + ns).checked;
  replaceSpeciesList(sl, id, is_checked);
}

// Load 
//   @param obj  A input element.
//                 Normally use "this". 
async function registerSL(obj){
  const id = obj.id;
  const name = obj.files[0].name.split("\.")[0];
  const text = await readFile(obj.files[0]);
  const sp_list = text.replaceAll('\r', '').split(/[,\n]/);
  removeEmptyInArray(sp_list);
  addSLinLS(sp_list, name);
  updateSelectSLById(id.replace('register', 'select'));
  updateSelectSLById(id.replace('register', 'delete_name'));
  obj.value = '';  // for select the same file twice or more
  const select = document.getElementById(id.replace('register', 'select'));
  setSelectOption(select, name);
  changeSL(select);
}
// Create the file input that registers a species list from a text file.
function createRegisterSLButton(id){
  const span = crEl({el:'span' });
  const file_input = createFileInput({ id: id, onchange: "registerSL(this)" });
  span.appendChild( msgSpan('register') );
  span.appendChild(file_input);
  return span;
}

// No. of columns
function createSelectNumber(id){
  const span = crEl({el:'span' });
  const select = createSelectOpt([1,2,3,4,5,6,7,8,9], 5, id);
  select.setAttribute('onchange', 'changeUlColumns(this)');
  span.appendChild( msgSpan('n_cols') );
  span.appendChild(select);
  return span;
}
// Set how many columns the species lists are shown in ('--cc' in the CSS).
function changeUlColumns(obj){
  const ncols = obj.value;
  document.documentElement.style.setProperty('--cc', ncols);
}

// Species list
function createSpecieList(id, species){
  const ns = getSlNs(id);
  const ul = crEl({ el:'ul', ats:{id: id} });
  // console.log(species);
  for(const sp of species){
    const li = crEl({ el:'li' })
    const button = createSpeciesButton({ sp: sp, to_stage: true, ns: ns })
    li.appendChild(button);
    ul.appendChild(li);
  }
  return ul;
}
// 
//    @param  sl   A string of a species list.
//    @param  id   A string of a namespace: plot name, 'all', or 'flora'.
// 
function replaceSpeciesList(sl, id, add_comp = true){
  // var sl = 'tabu';
  let new_sp  = (sl === 'NEW' || sl === '') ? [] : getSLinLS(sl);
  const comp_sp = add_comp ? getSpeciesInComposition() : [];
  new_sp = new_sp.concat(comp_sp).sort();
  const new_sp_list = createSpecieList(id, new_sp);
  const old_sp_list = document.getElementById(id);
  old_sp_list.replaceWith(new_sp_list);
}
// Create the button of one species (to_stage: click stages it, otherwise click takes it back).
function createSpeciesButton({ sp, to_stage, ns }){
  const id      = to_stage ? ns + '_sp_' + sp      : ns + '_staged_sp_' + sp;
  const onclick = to_stage ? "stageSpecies(this)" : "unStageSpecies(this)";
  return crEl({ el:'input', ats:{type: "button", value: sp, onclick: onclick, id: id } });
}
// Create the box for typing species names that have no button.
function createSLInput(id){
  return crEl({ el:'input', ats:{type: 'text', id: id, placeholder: msg('input_species'), 'data-msg-ph': 'input_species', size:'100'} });
}

// Plot and Layer
function createUpdatePLButton(id){
  return crEl({ el:'input', ats:{type:'button', id: id, value: msg('update_pl'), 'data-msg': 'update_pl', onclick: 'updatePlotLayer({ obj:this })'} });
}
// Create the PLOT pull down: every plot for 'all' and 'flora', the own plot otherwise.
function createSelectPlot(id){
  const span = crEl({ el:'span' });
  span.appendChild( msgSpan('plot_label') );
  const ns = getSlNs(id);
  let plot_list;   // declared here: both branches and the line below share it
  if(ns === 'all' || ns === 'flora'){
    const tables = document.querySelectorAll("table[id^='input_occ']");
    const pl = COL.PLOT;
    plot_list = uniq(getMultiTableInputs(tables, [pl])[pl]);
  }else{
    plot_list = [ns];
  }
  const plot_select = createSelectOpt(plot_list.reverse(), 0, id);  // up: new plot, down: old plot
  span.appendChild(plot_select)
  return span;
}
// Redraw the PLOT and Layer selects of one module, or of 'all' and 'flora' when none is given.
function updatePlotLayer({ obj }){
  const nss = (obj === void 0) ? ['all', 'flora'] : [getSlNs(obj.id)];
  const base_name = 'sp_list_';
  for(const ns of nss){
    const plot_id  = base_name + 'plot-'    + ns;
    const layer_id = base_name + 'options-' + ns;
    replaceSelectPlot (plot_id );
    replaceSelectLayer(layer_id);
  }
}
// Replace a PLOT select with a freshly built one.
function replaceSelectPlot(id){
  const old_plot = document.getElementById(id).parentNode;
  const new_plot = createSelectPlot(id);
  old_plot.replaceWith(new_plot);
}
// Replace a Layer select with a freshly built one.
function replaceSelectLayer(id){
  // console.log(id);
  const old_layer = document.getElementById(id);
  const new_layer = createSelectOptions(id);
  old_layer.replaceWith(new_layer);
}

// Create one pull down per 'list' column of the occurrence tables (Layer and the like).
function createSelectOptions(id){
  const ns = getSlNs(id);
  // console.log(ns);
  const selector =  "table[id^='input_occ_']";
  const tables = document.querySelectorAll(selector);
  const selects = getMultiTableSelects(tables);
  const options = getMultiTableOptions(tables, selects);
  const opt_keys = Object.keys(options);
  const span = crEl({ el: 'span', ats:{id: id} });
  for(const key of opt_keys){
    span.appendChild( crEl({ el: 'span', tc: key}) );
    const opts = uniq(options[key]);
    opts.unshift('');
    const select = createSelectOpt(uniq(opts), 0, 'sp_list_options_' + key + '-' + ns);
    span.appendChild( select );
  }
  return span;
}


// Add species
function createSLAdd(id){
  return crEl({ el:'input', ats:{type: 'button', id: id, value: msg('add_species_to'), 'data-msg': 'add_species_to', onclick: 'addSpecies(this)' } });
}
// Move a species to the staged row and grey out its button.
function stageSpecies(obj){
  const ns = getSlNs(obj.parentNode.parentNode.id);
  const sp_staged = document.getElementById('sp_list_staged-' + ns);
  const sp = obj.value;
  obj.setAttribute("disabled", true);
  const button = createSpeciesButton({ sp: sp, to_stage: false, ns: ns });
  sp_staged.appendChild( button );
}
// Take a species off the staged row and enable its button again.
function unStageSpecies(obj){
  // console.log(obj)
  const ns = getSlNs(obj.parentNode.parentNode.id);
  const id = ns + '_sp_' + obj.value;
  const sp_button = document.getElementById(id);
  sp_button.removeAttribute("disabled");
  obj.remove();
}

// What the pull downs of a module are set to, keyed by column name.
//    @param  ns  A string, the name space of the module.
//    @return     An object, e.g. { Layer: 'H' }.
function getSelectOptionsValues(ns){
  const prefix = 'sp_list_options_';
  // Quote the value and anchor it on the '-'. Unquoted it breaks on a plot
  // name that is not a plain CSS ident, and unanchored it also matches a
  // name that merely ends the same way ('all' would match 'small').
  const selector = "select[id^='" + prefix + "'][id$='-" + ns + "']";
  const values = {};
  for(const opt of document.querySelectorAll(selector)){
    // The id is 'sp_list_options_<column>-<ns>'. Either part may hold a '-',
    // so cut away the prefix and the name space, both of which are known,
    // instead of splitting on the first '-'.
    const column = opt.id.slice(prefix.length, opt.id.length - ns.length - 1);
    values[column] = opt.value;
  }
  return values;
}

// Add the staged and typed species to the occurrence table of the selected plot, one row each. A name with '_' is read as species_SameAs and counted as unidentified.
function addSpecies(obj){
  // console.log(obj);
  // console.log(obj.id);
  const base_name = 'sp_list_';
  const ns = getSlNs(obj.id);
  const staged  = document.getElementById(base_name + 'staged-' + ns);
  const input   = document.getElementById(base_name + 'input-'  + ns);
  const plot    = document.getElementById(base_name + 'plot-'   + ns).value;
  const options = getSelectOptionsValues(ns);
  let species = getChildrenValues(staged);
  if(input.value !== ''){
    const input_val = input.value.replaceAll('，', ',').replaceAll('、', ',') // FULL size JP -> half size
    species = species.concat(input_val.split(','));
  }
  // add species
  const table = document.getElementById('input_occ_' + plot + '_tb');
  for(const spec of species){
    const [sp, same_as] = spec.split('_');
    const iden = (same_as === void 0);  // no '_' in the name: an identified species
    const sa   = iden ? '' : same_as;
    // Build the row as an object. It used to be pasted together as JSON text
    // and parsed back, so a name holding a " or a \ threw and took the whole
    // batch with it.
    const values = Object.assign({}, options,
                                 { [COL.SPECIES]: sp, [COL.SAME_AS]: sa, [COL.IDENTIFIED]: iden });
    addRowWithValues({ table: table, values: values });
  }
  // clear inputs
  input.value = '';
    // Delete from the front, elements will be shifted and don't work well
  for(let i = staged.children.length; 0 < i; i--){ // loop backwards
    staged.children[i-1].click();
  }
}
// The values of the children of an element.
function getChildrenValues(element){
  const values = [];
  for(const child of element.children){
    values.push(child.value);
  }
  return values;
}

