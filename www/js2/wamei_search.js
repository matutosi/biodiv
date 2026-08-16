// 
function createSearchFloraSpan(name = 'wamei'){
  const span_wamei = msgSpan('note_wamei');
  span_wamei.setAttribute('id', 'note_wamei');
  const main = crEl({ el:'span', ats:{id: 'flora'} });
  main.appendChild( createReplaceFloraButton()                                    );
  main.appendChild( crEl({ el:'br'                                             }) );
  main.appendChild( createSearchShowInput('flora_input')                          );
  main.appendChild( createSearchFloraButton(name)                                 );
  main.appendChild( msgSpan('note_search')                                        );
  main.appendChild( createSpecieUlModule({ species: '', ns: 'flora',
                                           show_select_plot: true,
                                           show_select_options: true           }) );
  main.appendChild( span_wamei                                                    );
  return main;
}

// @param name  A name of the flora, that is data and NOT translated.
function createSearchFloraButton(name){
  const id    = "search_flora_button";
  return crEl({ el:'input', ats:{ type: "button", id: id, value: msgF('search_name', name),
                                  'data-msg': 'search_name', 'data-msg-args': JSON.stringify([name]),
                                  onclick: "searchFlora(this)" } });
}

// Search the flora for the input text and show the hits as species buttons.
function searchFlora(obj){
  const parent    = obj.parentNode;
  const input     = document.getElementById('flora_input').value;
  let species;    // declared here: both branches and the code below share it
  if(input === ''){
    species = '';
  }else{
    const reg_exp = makeLookAheadReg(input);
    species = grepArray(flora, reg_exp);
  }
  const limits = 200;
  if(species.length > limits){
    alert( msgF('alert_over_hits', limits, limits) );
    species.splice(limits);
  }
  const new_flora  = createSpecieUlModule({ species             : species,
                                          ns                  : 'flora',
                                          show_select_plot    : true   ,
                                          show_select_options : true    });
  const old_flora = document.getElementById('sp_list_module-flora');
  old_flora.replaceWith(new_flora);
}
// Create the file input that replaces the flora with a text file.
function createReplaceFloraButton(){
  const id = '';
  const span = crEl({el:'span' });
  const file_input = createFileInput({ id: id, onchange: "replaceFlora(this)" });
  span.appendChild( msgSpan('replace_flora') );
  span.appendChild(file_input);
  return span;
}
// Replace the flora with the species read from the chosen file.
async function replaceFlora(obj){
  const name = obj.files[0].name.split("\.")[0];
  const text = await readFile(obj.files[0]);
  flora = uniq(text.split('\n'));
  removeEmptyInArray(flora);
  flora.sort();

  const old_button = document.getElementById('search_flora_button');
  const new_button = createSearchFloraButton(name);
  old_button.replaceWith(new_button);
  
  const note_wamei = document.getElementById('note_wamei');
  note_wamei.style.display = "none";
}
