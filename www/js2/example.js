function showExample(obj){
  addInputTab({ obj:document.getElementById('add_tab'), id:'pl_1' });
  addInputTab({ obj:document.getElementById('add_tab'), id:'pl_2' });
  var tb_1 = document.getElementById('input_occ_pl_1_tb');
  var tb_2 = document.getElementById('input_occ_pl_2_tb');
  var ly = ['T1',  'T2',  'H',   'H',   'H'];
  var sp = ['sp1', 'sp2', 'sp3', 'sp4', 'sp5'];
  var cv = [  80,    40,       ,    1.5,   0.5];
  //   for(let i = 0; i < 3; i++){ addRowWithSpecies({ table: tb_1, layer: ly[i], species:sp[i], cover:cv[i] }); }
  //   for(let i = 2; i < 5; i++){ addRowWithSpecies({ table: tb_2, layer: ly[i], species:sp[i], cover:cv[i] }); }
  for(let i = 0; i < 3; i++){ addRowWithValues({ table: tb_1, values:{ Layer: ly[i], Species:sp[i], Cover:cv[i] } }); }
  for(let i = 2; i < 5; i++){ addRowWithValues({ table: tb_2, values:{ Layer: ly[i], Species:sp[i], Cover:cv[i] } }); }
  for(let i = 1; i < 5; i++){ tb_1.rows[2].cells[1].firstChild.click(); }
  for(let i = 1; i < 5; i++){ tb_2.rows[2].cells[1].firstChild.click(); }
  document.getElementById('update_all_inputs_tables_button').click();
  document.getElementById('update_input_species_list').click();
  obj.remove();
}
