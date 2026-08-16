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
function getSpeciesInComposition(sp = 'Species'){
  var comp = document.getElementById('comp_table_tb');
  if(comp === null){ return []; } // return, when no inputs
  var species = getColData(comp, sp);
  removeEmptyInArray(species);
  return species;
}
// Add every species of the composition table to the species list of the clicked module.
function addComp(obj, sp = 'Species'){
  // var sp = 'Species';
  var ns = getSlNs(obj.id);
  var id = 'sp_list_sp_list-'+ ns;
  var species = getSpeciesInComposition();
  // console.log(sp_list);
  addSpeciesList(id, species);
}

// Create the button that calls addComp().
function createAddCompButton(id){
  return crEl({ el:'input', ats:{type:'button', id: id, value: msg('add_from_comp'), 'data-msg': 'add_from_comp', onclick: 'addComp(this)'} });
}

// Build a species list module (list select, register, staged species, text box, PLOT and Layer selects, species buttons). Parts not asked for are hidden, not left out.
function createSpecieUlModule({ species, ns,
                                show_select_button     , show_comp_checkbox, show_delete_list, 
                                show_select_ncol       , 
                                show_button_register_sl, 
                                show_text_input        , 
                                show_button_update_pl  , show_select_plot     , show_select_options}){
  // var ns = 'all'; var species = sp_list;
  var base_name = 'sp_list_';
  var main               = createSpanWithId      ( base_name + 'module-'    + ns          );

  var select_button      = createSelectSL        ( base_name + 'select-'    + ns          );
  var select_ncol        = createSelectNumber    ( base_name + 'ncols-'     + ns          );
  var comp_checkbox      = createCompCheckbox    ( base_name + 'checkbox-'  + ns          );

  var button_register_sl = createRegisterSLButton( base_name + 'register-'  + ns          );
  var delete_list        = createDeleteSL        ( base_name + 'delete-'    + ns          );

  var staged             = createSpanWithId      ( base_name + 'staged-'    + ns          );
  var text_input         = createSLInput         ( base_name + 'input-'     + ns          );
  var button_update_pl   = createUpdatePLButton  ( base_name + 'update_pl-' + ns          );
  var button_add         = createSLAdd           ( base_name + 'add-'       + ns          );
  var select_plot        = createSelectPlot      ( base_name + 'plot-'      + ns          );
  var select_options     = createSelectOptions   ( base_name + 'options-'    + ns         );
  // console.log(select_options);
  var sp_list            = createSpecieList    ( base_name + 'sp_list-'   + ns, species );

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
  var span   = crEl({ el:'span' });
  var select = createSL(id);
  span.appendChild( msgSpan('s_list') );
  span.appendChild(select);
  return span;
}
// Create the delete button and the pull down of the list it deletes.
function createDeleteSL(id){
  var delete_name = id.replace('delete', 'delete_name');
  var span   = crEl({ el:'span' });
  var delete_button = crEl({ el:'input', ats:{type: 'button', value: msg('delete_list'), 'data-msg': 'delete_list', onclick: 'deleteSl(this)', id: id} });
  var select = createSL(delete_name, '', '');  // '', '': no value picked, no 'NEW' option
  span.appendChild( delete_button );
  span.appendChild( select );
  return span;
}
// Delete the selected species list after a confirmation, then redraw the pull downs.
function deleteSl(obj){
  var sel_de = obj.id.replace('delete', 'delete_name');
  var select = obj.id.replace('delete', 'select');
  var del_list = document.getElementById(sel_de).value;
  var is_ok = confirm( msgF('confirm_del_sl', del_list) );
  if(is_ok){
    removeSLinLS(del_list);
    updateSelectSLById(select);
    updateSelectSLById(sel_de);
  }
  return void 0;
}


// Redraw a species list pull down, keeping what was selected.
function updateSelectSLById(id){
  var old_select = document.getElementById(id);
  var first_option = (/delete/.test(id)) ? '' : 'NEW'
  var selected_value = old_select.value;
  var new_select = createSL(id, selected_value, first_option);
  old_select.replaceWith(new_select);
}
// Create the pull down of the stored species lists ('NEW' first, unless it is the delete one).
function createSL(id, value = '', first_option = 'NEW'){
  var species_list = replaceArrayAll(getKeysOfSLinLS(), 'biss_sl-', '');
  species_list.sort();
  species_list.unshift(first_option);
  var select = createSelectOpt(species_list, 0, id);
  if(value !== ''){ setSelectOption(select, value); }
  select.setAttribute('onchange', 'changeSL(this)');
  return select
}

// Select the option of that value, or the first one when it is not there.
function setSelectOption(select, value){
  var options = getSelectOptionInCell(select);
  var index = options.indexOf(value);
  var index = Math.max(0, index);
  select.options[index].selected = true;
}


// Create the checkbox that adds the composition species to the list.
function createCompCheckbox(id){
  var span     = crEl({ el:'span', ats:{class: 'margin_right'} });
  var checkbox = crEl({ el:'input', ats:{id: id, type: 'checkbox', onchange: 'changeSL(this)'} });
  span.appendChild( msgSpan('include_comp') );
  span.appendChild(checkbox);
  return span;
}

// Redraw the species buttons for the list just selected.
function changeSL(obj){
  var ns = getSlNs(obj.id);
  var id = 'sp_list_sp_list-' + ns;
  var sl = document.getElementById('sp_list_select-' + ns).value;
  // console.log('id:' + id + ', sl:' + sl);
  var is_checked = document.getElementById('sp_list_checkbox-' + ns).checked;
  replaceSpeciesList(sl, id, is_checked);
}

// Load 
//   @param obj  A input element.
//                 Normally use "this". 
async function registerSL(obj){
  var id = obj.id;
  var name = obj.files[0].name.split("\.")[0];
  var text = await readFile(obj.files[0]);
  var sp_list = text.replaceAll('\r', '').split(/[,\n]/);
  removeEmptyInArray(sp_list);
  addSLinLS(sp_list, name);
  updateSelectSLById(id.replace('register', 'select'));
  updateSelectSLById(id.replace('register', 'delete_name'));
  obj.value = '';  // for select the same file twice or more
  var select = document.getElementById(id.replace('register', 'select'));
  setSelectOption(select, name);
  changeSL(select);
}
// Helper function
function readFile(file){
  // https://www.delftstack.com/ja/howto/javascript/open-local-text-file-using-javascript/
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = x=> resolve(reader.result);
    reader.readAsText(file);
  })
}
// Create the file input that registers a species list from a text file.
function createRegisterSLButton(id){
  var span = crEl({el:'span' });
  var file_input = createFileInput({ id: id, onchange: "registerSL(this)" });
  span.appendChild( msgSpan('register') );
  span.appendChild(file_input);
  return span;
}

// No. of columns
function createSelectNumber(id){
  var span = crEl({el:'span' });
  var select = createSelectOpt([1,2,3,4,5,6,7,8,9], 5, id);
  select.setAttribute('onchange', 'changeUlColumns(this)');
  span.appendChild( msgSpan('n_cols') );
  span.appendChild(select);
  return span;
}
// Set how many columns the species lists are shown in ('--cc' in the CSS).
function changeUlColumns(obj){
  var ncols = obj.value;
  document.documentElement.style.setProperty('--cc', ncols);
}

// Species list
function createSpecieList(id, species){
  var ns = getSlNs(id);
  var ul = crEl({ el:'ul', ats:{id: id} });
  // console.log(species);
  for(let sp of species){
    var li = crEl({ el:'li' })
    var button = createSpeciesButton({ sp: sp, to_stage: true, ns: ns })
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
  var new_sp  = (sl === 'NEW' || sl === '') ? [] : getSLinLS(sl);
  var comp_sp = add_comp ? getSpeciesInComposition() : [];
  var new_sp  = new_sp.concat(comp_sp).sort();
  var new_sp_list = createSpecieList(id, new_sp);
  var old_sp_list = document.getElementById(id);
  old_sp_list.replaceWith(new_sp_list);
}
// Create the button of one species (to_stage: click stages it, otherwise click takes it back).
function createSpeciesButton({ sp, to_stage, ns }){
  if(to_stage){
    var id = ns + '_sp_' + sp
    var onclick = "stageSpecies(this)"
  }else{
    var id = ns +  '_staged_sp_' + sp;
    var onclick = "unStageSpecies(this)"
  }
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
  var span = crEl({ el:'span' });
  span.appendChild( msgSpan('plot_label') );
  var ns = getSlNs(id);
  if(ns === 'all' || ns === 'flora'){
    var tables = document.querySelectorAll("table[id^='input_occ']");
    var pl = 'PLOT';
    var plot_list = uniq(getMultiTableInputs(tables, [pl])[pl]);
  }else{
    var plot_list = [ns];
  }
  var plot_select = createSelectOpt(plot_list.reverse(), 0, id);  // up: new plot, down: old plot
  span.appendChild(plot_select)
  return span;
}
// Create the Layer pull down, from the layers the occurrence tables offer.
function createSelectLayer(id){
  var span = crEl({ el:'span' });
  span.appendChild( msgSpan('layer_label') );
  var tables = document.querySelectorAll("table[id^='input_occ']");
  var ly = 'Layer';
  // console.log(getMultiTableOptions(tables, [ly]));
  var layer_list = uniq(getMultiTableOptions(tables, [ly])[ly]);
  var layer_select = createSelectOpt(layer_list, layer_list.length - 1, id);
  span.appendChild(layer_select)
  return span;
}
// Redraw the PLOT and Layer selects of one module, or of 'all' and 'flora' when none is given.
function updatePlotLayer({ obj }){
  var nss = (obj === void 0) ? ['all', 'flora'] : [getSlNs(obj.id)];
  var base_name = 'sp_list_';
  for(let ns of nss){
    var plot_id  = base_name + 'plot-'    + ns;
    var layer_id = base_name + 'options-' + ns;
    replaceSelectPlot (plot_id );
    replaceSelectLayer(layer_id);
  }
}
// Replace a PLOT select with a freshly built one.
function replaceSelectPlot(id){
  var old_plot = document.getElementById(id).parentNode;
  var new_plot = createSelectPlot(id);
  old_plot.replaceWith(new_plot);
}
// Replace a Layer select with a freshly built one.
function replaceSelectLayer(id){
  // console.log(id);
  var old_layer = document.getElementById(id);
  //   var new_layer = createSelectLayer(id);
  var new_layer = createSelectOptions(id);
  old_layer.replaceWith(new_layer);
}

// Create one pull down per 'list' column of the occurrence tables (Layer and the like).
function createSelectOptions(id){
  var ns = getSlNs(id);
  // console.log(ns);
  var selector =  "table[id^='input_occ_']";
  var tables = document.querySelectorAll(selector);
  var selects = getMultiTableSelects(tables);
  var options = getMultiTableOptions(tables, selects);
  var opt_keys = Object.keys(options);
  var span = crEl({ el: 'span', ats:{id: id} });
  for(let key of opt_keys){
    span.appendChild( crEl({ el: 'span', ih: key}) );
    var select = uniq(options[key]);
    select.unshift('');
    var select = createSelectOpt(uniq(select), 0, 'sp_list_options_' + key + '-' + ns);
    span.appendChild( select );
  }
  return span;
}


// Add species
function createSLAdd(id){
  return crEl({ el:'input', ats:{type: 'button', id: id, value: msg('add_species_to'), 'data-msg': 'add_species_to', onclick: 'addSpecies(this)' } });
}
// Add species to a list, keeping it unique and sorted.
function addSpeciesList(id, add_sp){
  var old_sp_list = document.getElementById(id);
  // console.log(id);
  var old_sp = getGrandChildrenValues( old_sp_list );
  if(old_sp === void 0) var old_sp = [];
  var new_sp = uniq(old_sp.concat(add_sp)).sort();
  //   if(new_sp.indexOf('') >= 0){ new_sp.splice(new_sp.indexOf(''), 1); }  // remove ''
  removeEmptyInArray(new_sp);
  var new_sp_list = createSpecieList(id, new_sp);
  old_sp_list.replaceWith(new_sp_list);
}
// Move a species to the staged row and grey out its button.
function stageSpecies(obj){
  var ns = getSlNs(obj.parentNode.parentNode.id);
  var sp_staged = document.getElementById('sp_list_staged-' + ns);
  var sp = obj.value;
  obj.setAttribute("disabled", true);
  var button = createSpeciesButton({ sp: sp, to_stage: false, ns: ns });
  sp_staged.appendChild( button );
}
// Take a species off the staged row and enable its button again.
function unStageSpecies(obj){
  // console.log(obj)
  var ns = getSlNs(obj.parentNode.parentNode.id);
  var id = ns + '_sp_' + obj.value;
  var sp_button = document.getElementById(id);
  sp_button.removeAttribute("disabled");
  obj.remove();
}

// The values of the pull downs of a module, as a JSON string keyed by column name.
function getSelectOptionsAsJSON(ns){
  // ns = 'all'
  // Quote the value and anchor it on the '-'. Unquoted it breaks on a plot
  // name that is not a plain CSS ident, and unanchored it also matches a
  // name that merely ends the same way ('all' would match 'small').
  var selector =  "select[id^='sp_list_options_'][id$='-" + ns + "']";
  var options  = document.querySelectorAll(selector);
  var prefix = 'sp_list_options_';
  var opt_value = '{"';
  for(let opt of options){
    // The id is 'sp_list_options_<column>-<ns>'. Either part may hold a '-',
    // so cut away the prefix and the name space, both of which are known,
    // instead of splitting on the first '-'.
    var column = opt.id.slice(prefix.length, opt.id.length - ns.length - 1);
    var opt_value =
      opt_value +
      column + '": "' +
      opt.value + '", "';
  }
  var opt_value = opt_value.replace(/, "$/, '') + '}';
  return opt_value;
}

// Add the staged and typed species to the occurrence table of the selected plot, one row each. A name with '_' is read as species_SameAs and counted as unidentified.
function addSpecies(obj){
  // console.log(obj);
  // console.log(obj.id);
  var base_name = 'sp_list_';
  var ns = getSlNs(obj.id);
  var staged  = document.getElementById(base_name + 'staged-' + ns);
  var input   = document.getElementById(base_name + 'input-'  + ns);
  var plot    = document.getElementById(base_name + 'plot-'   + ns).value;
  var options = getSelectOptionsAsJSON(ns);
  var species = getChildrenValues(staged);
  if(input.value !== ''){
    var input_val = input.value.replaceAll('，', ',').replaceAll('、', ',') // FULL size JP -> half size
    var species = species.concat(input_val.split(','));
  }
  // add species
  var table = document.getElementById('input_occ_' + plot + '_tb');
  for(let spec of species){
    var [sp, sa] = spec.split('_');
    if(sa === void 0){
      var sa = ''; 
      var iden = true;
    }else{
      var iden = false;
    }
    var values = options.replace(/\}$/, '') + ', '  +
                 '"Species": "'    + sp   + '", ' +
                 '"SameAs": "'     + sa   + '", ' +
                 '"Identified": ' +  iden + '}' ;
  // console.log(values);
  // console.log(table);
    var values = JSON.parse(values);
    addRowWithValues({ table: table, values: values });
  //     addRowWithValues({ table: table, values: {Layer: layer, Species: sp, SameAs: sa, Identified: iden} });
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
  var values = [];
  for(let child of element.children){
    values.push(child.value);
  }
  return values;
}

// The values of the grandchildren of an element (the buttons in the li of a ul).
function getGrandChildrenValues(element){
  var values = [];
  for(let child of element.children){
    for(let ch of child.children){
      values.push(ch.value);
    }
  }
  return values;
}

