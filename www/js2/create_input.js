// Helper to create input tag with attributes such as class, id, type, value, and placeholder.
//    @param ...args Some arguments.
//    @return  An input element.
//    @examples
//    createInput({ type: "text", value: "Val"});
//    createInput({ type: "button", value: "Push here"});
function createInput( ...args ){
  var input = document.createElement('input');
  var keys  = Object.keys(args[0]);
  for(let key of keys){
    input.setAttribute(key, args[0][key]);
  }
  return input;
}

// NOT translated: the buttons below live in a data table and getCellData()
//   exports their value as the cell data. See js2/lang.js.
function createDelButton(){
  return createInput({ type: "button", value: "DELETE", onclick: "delRow(this)" });
}
function createUpdateButton(){
  return createInput({ type: "button", value: "UPDATE_TIME_GPS", onclick: "updateTimeGPS(this)" });
}

function createFitTable(id){
  return createInput({ type:"button", value: msg('fit_width'), 'data-msg': 'fit_width', onclick: "shortTable(this)", id: id});
}
function createWideTable(){
  return createInput({ type:"button", value: msg('extend_width'), 'data-msg': 'extend_width', onclick: "wideTable(this)" });
}
function createFileButton(){
  return createInput({ type: "file", accept: ".json", onchange: "replaceTable(this)" });
}
function createSaveButton(){
  return createInput({ type: "button", value: msg('save'), 'data-msg': 'save', onclick: "saveSettings(this)" });
}
// NOT translated: c_name is a column name, that is data.
function createShowColButton(c_name){
  return createInput({ type: "Button", value: c_name, onclick: "showCol(this)" });
}
function createSumButton(){
  return createInput({ type: "Button", value: msg('calculate'), 'data-msg': 'calculate', onclick: "sumWithGroup(this)" });
}
function createSearchInput(){
  return createInput({ type:"text", onkeyup: "searchTableText(this)", placeholder: msg('search_text'), 'data-msg-ph': 'search_text' });
}
function createSearchShowInput(id=''){
  return crEl({ el:'input', ats:{type:'text', id: id, placeholder: msg('input_text'), 'data-msg-ph': 'input_text'} });
}
function createNrowInput(id){
  return createInput({ type: "number", value: "1", step: "1", min: "1", max:"20", id: id });
}
function createAddRowButton(id){
  return createInput({ type: "button", value: msg('add_rows'), 'data-msg': 'add_rows', onclick: "addRows(this)", id: id });
}
function createHideButton(){
  return createInput({ type: "button", value: msg('hide_table'), 'data-msg': 'hide_table', onclick: "hideShowNext(this)" });
}
function createNewOccButton(){
  return createInput({ type: "button", value: msg('new_occ_table'), 'data-msg': 'new_occ_table', onclick: "makeNewOccTableModule(this)" });
}
