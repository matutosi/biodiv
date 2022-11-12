function inputSpecies(){
  
}

function generateSpeciesTable(species){
  var main = crEl({ el: 'span', ats: {id: 'species'} });
  var sp_list = crEl({ el: 'span', ats: {id: 'sp_list'} });
  for(let sp of species){
    sp_list.appendChild( createSpeciesButton({ sp: sp, to_stage: true }) );
  }
  main.appendChild( sp_list );
  main.appendChild( crEl({ el: 'hr' }) );
  main.appendChild( crEl({ el: 'span', ats: {id: 'sp_staged'} }) );
  main.appendChild( crEl({ el: 'hr' }) );
  return main;
}

function createSpeciesButton({ sp, to_stage} ){
  if(to_stage){
    var id = 'sp_' + sp
    var onclick = "stageSpecies(this)"
  }else{
    var id = 'staged_sp_' + sp;
    var onclick = "unStageSpecies(this)"
  }
  return crEl({ el:'input', ats:{type: "button", value: sp, onclick: onclick, id: id } });
}

function stageSpecies(obj){
  var sp_staged = document.getElementById('sp_staged');
  var sp = obj.value;
  obj.setAttribute("disabled", true);
  sp_staged.appendChild( createSpeciesButton({ sp, to_stage: false }) );
}
function unStageSpecies(obj){
  var sp_list = document.getElementById('sp_list');
  var id = 'sp_' + obj.value;
  var sp_button = document.getElementById(id);
  sp_button.removeAttribute("disabled");
  obj.remove();
}


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
  up.appendChild( crEl({ el: 'B', tc: ns}) );
  up.appendChild( createSearchShowInput() );
  up.appendChild( createSearchShowButton() );
  // Table
  var table = generateTable(wamei);
  // Main
  var main   = crEl({ el:'span', ats:{id: "main_"   + ns} });
  main.appendChild(up);
  main.appendChild(table);
  return main;
}
