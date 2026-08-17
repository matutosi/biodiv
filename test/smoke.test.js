// Regression smoke test for BISS.
//
//   The point of this file is NOT to cover the app. It is to pin down the few
//   things that must not change while the code is being refactored:
//     - the page builds itself without raising anything
//     - a survey can be entered from end to end
//     - the columns that ecan::read_biss() reads keep their names and order,
//       and the two button columns stay out of the saved data
//     - switching the language changes labels only, never data

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBiss, colNames, colData, addPlot, plain } = require('./biss.js');

// The columns of the "_5_layers" base setting, as ecan::read_biss() sees them.
const PLOT_COLS = [
  'PLOT', 'NO', 'DATE', 'Investigator', 'Location',
  'LOC_LAT', 'LOC_LON', 'LOC_ACC',
  'Altitude', 'Aspect', 'Inclination',
  'T1_height', 'T2_height', 'S1_height', 'S2_height', 'H_height',
  'T1_cover', 'T2_cover', 'S1_cover', 'S2_cover', 'H_cover',
  'Photo', 'Memo',
];
const OCC_COLS = [
  'PLOT', 'Layer', 'Species', 'Cover', 'Abundance', 'Rank',
  'Sampled', 'Identified', 'Photo', 'Memo', 'SameAs',
];

// Enter one plot with two species, the way a user would.
async function surveyOnePlot(){
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  addPlot(w, 'test01');
  w.document.getElementById('sp_list_input-test01').value = 'Fagus crenata,Quercus serrata';
  w.document.getElementById('sp_list_add-test01').click();
  w.updateInputsPlotLayerSpecies();
  return biss;
}

test('the page builds itself without raising anything', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  assert.deepEqual(biss.errors, []);
  assert.equal(typeof w.addInputTab, 'function');
  assert.deepEqual(
    [...w.document.querySelectorAll('#tabcontrol a')].map(a => a.textContent.trim()),
    ['Tools', 'Settings', 'All plots'],
  );
  biss.close();
});

test('a base setting builds its plot and occurrence setting tables', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  assert.deepEqual(
    [...w.document.querySelectorAll('#tab_settings table')].map(t => t.id),
    ['_5_layers_plot_tb', '_5_layers_occ_tb'],
  );
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a survey runs from adding a plot to the all plots tables', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;
  assert.deepEqual(biss.errors, []);

  // The tab and its two input tables are there.
  assert.ok(w.document.getElementById('test01'), 'the plot tab exists');
  assert.ok(w.document.getElementById('input_plot_test01_tb'), 'the plot table exists');
  assert.ok(w.document.getElementById('input_occ_test01_tb'), 'the occurrence table exists');

  // The species reached the occurrence table.
  const species = colData(w, 'input_occ_test01_tb', 'Species');
  assert.ok(species.includes('Fagus crenata'), 'Fagus crenata was added');
  assert.ok(species.includes('Quercus serrata'), 'Quercus serrata was added');

  biss.close();
});

test('the saved columns keep their names and order', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;

  // This is the contract with ecan::read_biss(). Changing it breaks the
  // analysis side, so a refactoring must never move these.
  assert.deepEqual(colNames(w, 'plot_all_tb'), PLOT_COLS);
  assert.deepEqual(colNames(w, 'occ_all_tb'),  OCC_COLS);

  biss.close();
});

test('the button columns stay out of the saved data', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;

  // The input tables DO have the buttons: DELETE on the occurrence side,
  // UPDATE_TIME_GPS on the plot side (that is where the setting puts them).
  assert.ok(colNames(w, 'input_occ_test01_tb').includes('DELETE'),
            'the occurrence input table has DELETE');
  assert.ok(colNames(w, 'input_plot_test01_tb').includes('UPDATE_TIME_GPS'),
            'the plot input table has UPDATE_TIME_GPS');

  // ... and the tables that get saved do NOT.
  for(const id of ['plot_all_tb', 'occ_all_tb']){
    for(const button of ['DELETE', 'UPDATE_TIME_GPS']){
      assert.ok(!colNames(w, id).includes(button), `${id} has no ${button}`);
    }
  }

  // The same holds for the rows that saveAllTableDataAsCSV() writes.
  const rows = plain(w.getTableDataAsArray('occ_all_tb'));
  assert.deepEqual(rows[0], OCC_COLS, 'the TSV header is the column names');
  assert.ok(rows.length > 1, 'the TSV has data rows');

  biss.close();
});

test('the composition table pivots species by plot', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;
  addPlot(w, 'test02');
  w.updateInputsPlotLayerSpecies();

  const cols = colNames(w, 'comp_table_tb');
  assert.equal(cols[0], 'Species');
  assert.ok(cols.includes('test01'), 'test01 is a column');
  assert.ok(cols.includes('test02'), 'test02 is a column');
  assert.deepEqual(biss.errors, []);

  biss.close();
});

test('switching the language changes labels but not data', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;

  const before = colData(w, 'input_occ_test01_tb', 'Species');
  w.changeLanguage({ value: 'ja' });
  const after = colData(w, 'input_occ_test01_tb', 'Species');

  assert.deepEqual(after, before, 'the input data survives the switch');
  assert.deepEqual(colNames(w, 'occ_all_tb'), OCC_COLS, 'the column names stay English');

  // A label did change.
  const add_tab = w.document.getElementById('add_tab');
  assert.notEqual(add_tab.value, '+ PLOT', 'the button is labelled in Japanese');
  assert.deepEqual(biss.errors, []);

  biss.close();
});

test('sorting a column reorders the rows and raises nothing', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;
  const table = w.document.getElementById('occ_all_tb');
  const th = table.rows[0].cells[colNames(w, 'occ_all_tb').indexOf('Species')];

  th.onclick();                       // ascending
  const asc = colData(w, 'occ_all_tb', 'Species');
  th.onclick();                       // descending
  const desc = colData(w, 'occ_all_tb', 'Species');

  // "" always sorts last, in both directions (see rank() in sortable.js),
  // so only the filled cells turn around.
  const filled = a => a.filter(s => s !== '');
  assert.ok(filled(asc).length > 1, 'there is something to sort');
  assert.deepEqual(filled(desc), filled(asc).reverse(), 'the second click reverses the order');
  assert.deepEqual(biss.errors, []);

  biss.close();
});

test('the DELETE button removes its own row', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;
  const table = w.document.getElementById('input_occ_test01_tb');
  const col = colNames(w, 'input_occ_test01_tb').indexOf('DELETE');

  const before = table.rows.length;
  table.rows[2].cells[col].firstChild.click();
  assert.equal(table.rows.length, before - 1, 'one row is gone');

  // The last two rows are kept: delRow() refuses below three (th + hide + one).
  while(table.rows.length > 3){ table.rows[2].cells[col].firstChild.click(); }
  table.rows[2].cells[col].firstChild.click();
  assert.equal(table.rows.length, 3, 'the last data row is not deleted');

  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the UPDATE_TIME_GPS button writes the time into its row', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;
  const cols = colNames(w, 'input_plot_test01_tb');
  const table = w.document.getElementById('input_plot_test01_tb');
  const row = table.rows[2];

  row.cells[cols.indexOf('DATE')].innerHTML = '';
  row.cells[cols.indexOf('UPDATE_TIME_GPS')].firstChild.click();

  assert.match(row.cells[cols.indexOf('DATE')].innerHTML, /^\d{4}(_\d{2}){5}$/,
               'DATE holds yyyy_mm_dd_hh_mm_ss');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the buttons in a row already on screen follow the language switch', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;
  const table = w.document.getElementById('input_occ_test01_tb');
  const del = table.rows[2].cells[colNames(w, 'input_occ_test01_tb').indexOf('DELETE')].firstChild;

  assert.equal(del.value, 'DELETE', 'English to start with');
  w.changeLanguage({ value: 'ja' });
  assert.equal(del.value, '削除', 'the existing row is relabelled');
  w.changeLanguage({ value: 'en' });
  assert.equal(del.value, 'DELETE', 'and back again');

  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a plot tab made after the switch is labelled in the new language', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  w.changeLanguage({ value: 'ja' });
  addPlot(w, 'testja');

  const table = w.document.getElementById('input_occ_testja_tb');
  const del = table.rows[2].cells[colNames(w, 'input_occ_testja_tb').indexOf('DELETE')].firstChild;
  assert.equal(del.value, '削除', 'a row built while Japanese is Japanese');

  const hide = table.rows[1].cells[0].firstChild;
  assert.equal(hide.value, '非表示', 'the hide button too');

  assert.deepEqual(colNames(w, 'input_occ_testja_tb').slice(0, 3), ['PLOT', 'DELETE', 'Layer'],
                   'the column names stay English');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the species list picked in Tools survives a move to another tab', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');

  // Register a list and pick it, the way the Tools tab does.
  w.addSLinLS(['Fagus crenata', 'Quercus serrata'], 'testlist');
  w.updateSelectSLById('sp_list_select-all');
  const select = () => w.document.getElementById('sp_list_select-all');
  w.setSelectOption(select(), 'testlist');
  w.changeSL(select());

  const shown = () => w.document.getElementById('sp_list_sp_list-all').children.length;
  assert.equal(shown(), 2, 'the two species are listed');

  // Leaving the tab and coming back runs this. The list has to stay.
  w.updateInputsPlotLayerSpecies();

  assert.equal(select().value, 'testlist', 'the pull down still shows the list');
  assert.equal(shown(), 2, 'and the species are still listed');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('deleting one species list leaves the one on screen alone', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  w.addSLinLS(['Fagus crenata', 'Quercus serrata'], 'keepme');
  w.addSLinLS(['Zelkova serrata'], 'dropme');
  w.updateSpeciesList();

  const select = () => w.document.getElementById('sp_list_select-all');
  const del_name = () => w.document.getElementById('sp_list_delete_name-all');
  w.setSelectOption(select(), 'keepme');
  w.changeSL(select());
  w.setSelectOption(del_name(), 'dropme');

  w.deleteSl(w.document.getElementById('sp_list_delete-all'));

  const options = s => [...s.options].map(o => o.value);
  assert.ok(!options(select()).includes('dropme'), 'the deleted list is gone from the pull down');
  assert.ok(options(select()).includes('keepme'), 'the other list is still offered');
  assert.equal(select().value, 'keepme', 'and is still the one picked');
  assert.equal(w.document.getElementById('sp_list_sp_list-all').children.length, 2,
               'its species are still on screen');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

// addInputTab() refuses '_' and tells the user to write '-' instead, so a
//   plot name that holds a '-' is not an edge case: it is what the message
//   asks for. The species list module used to take the name apart with
//   id.split('-')[1] and read 'sito-A' as 'sito'.
test('a plot name may hold a hyphen, as the app tells the user', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  addPlot(w, 'sito-A');

  assert.ok(w.document.getElementById('input_occ_sito-A_tb'), 'the occurrence table exists');
  assert.ok(w.document.getElementById('sp_list_module-sito-A'), 'its species list module exists');

  // Adding species has to reach the right plot, not one named 'sito'.
  w.document.getElementById('sp_list_input-sito-A').value = 'Fagus crenata,Quercus serrata';
  w.document.getElementById('sp_list_add-sito-A').click();
  w.updateInputsPlotLayerSpecies();

  const species = colData(w, 'input_occ_sito-A_tb', 'Species');
  assert.ok(species.includes('Fagus crenata'), 'the species landed in the right table');
  const plots = colData(w, 'occ_all_tb', 'PLOT').filter(p => p !== '');
  assert.ok(plots.length > 0, 'the all plots table has rows');
  assert.ok(plots.every(p => p === 'sito-A'),
            `the whole plot name is carried over, got ${[...new Set(plots)]}`);
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a hyphenated plot name keeps its layer pull down', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  addPlot(w, 'sito-A');

  // getSelectOptionsValues() matches the pull downs of one module by id.
  const options = w.getSelectOptionsValues('sito-A');
  assert.ok('Layer' in options, `Layer is offered, got ${Object.keys(options)}`);
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a species name may hold a quote', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  addPlot(w, 'quoted');

  // The names are typed by hand, so anything can arrive. A name that used to
  // be pasted into a JSON string took the whole batch down with it.
  w.document.getElementById('sp_list_input-quoted').value =
    'Quercus "serrata",Fagus crenata,back\\slash';
  w.document.getElementById('sp_list_add-quoted').click();

  const species = colData(w, 'input_occ_quoted_tb', 'Species').filter(s => s !== '');
  assert.ok(species.includes('Quercus "serrata"'), `the quoted name, got ${species}`);
  assert.ok(species.includes('Fagus crenata'), 'and the ones next to it are not lost');
  assert.ok(species.includes('back\\slash'), 'a backslash too');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a species name may hold an ampersand or a tag', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  addPlot(w, 'amp');

  // The All plots table used to be built with innerHTML, so "A & B" came out
  // of it as "A &amp; B" and a <i> in a memo was read as markup. What a cell
  // holds is text, and it has to reach the saved TSV as it was typed.
  w.document.getElementById('sp_list_input-amp').value = 'Rosa A & B,Carex <i>x</i>';
  w.document.getElementById('sp_list_add-amp').click();
  w.updateInputsPlotLayerSpecies();

  const typed = ['Rosa A & B', 'Carex <i>x</i>'];
  const input = colData(w, 'input_occ_amp_tb', 'Species');
  const all   = colData(w, 'occ_all_tb', 'Species');
  for(const name of typed){
    assert.ok(input.includes(name), `${name} is in the input table`);
    assert.ok(all.includes(name), `${name} reaches the All plots table unchanged`);
  }

  // And the TSV that gets saved holds the same.
  const rows = plain(w.getTableDataAsArray('occ_all_tb'));
  const col = rows[0].indexOf('Species');
  const saved = rows.slice(1).map(r => r[col]);
  for(const name of typed){
    assert.ok(saved.includes(name), `${name} is written to the TSV as typed`);
  }
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a settings table round trips through its saved JSON', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  const table = w.document.getElementById('_5_layers_occ_tb');

  // What saveSettings() writes.
  const json = w.JSON.stringify(w.getTableData(table));
  const saved = JSON.parse(json);

  assert.deepEqual(plain(saved.biss_c_names), ['item', 'type', 'value', 'DELETE', 'memo'],
                   'the settings columns');
  assert.ok(Array.isArray(saved.biss_inputs.item), 'biss_inputs survives JSON.stringify');
  assert.ok(saved.biss_inputs.item.includes('Species'), 'and holds the items');
  // A column that is not a list has null, the form data.js and the saved
  // files use. An array here would be written as [] and lose the data.
  const types = plain(saved.biss_d_types);
  saved.biss_selects.forEach((s, i) => {
    if(types[i] === 'list'){ assert.ok(Array.isArray(s), `${i} is a list`); }
    else                   { assert.equal(s, null, `${i} is not a list`); }
  });

  // And it builds back into the same table.
  const rebuilt = w.makeTableJO(saved, 'round_trip_tb');
  assert.deepEqual(plain(w.getColNames(rebuilt)), plain(w.getColNames(table)));
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the auto saved JSON holds the plot and occurrence data', async () => {
  const biss = await surveyOnePlot();
  const w = biss.window;

  const data = JSON.parse(w.getAllPlotOccDataAsJSON());

  assert.deepEqual(Object.keys(data), ['plot', 'occ']);
  assert.deepEqual(Object.keys(data.occ), OCC_COLS, 'keyed by the column names');
  assert.ok(data.occ.Species.includes('Fagus crenata'), 'and holds the species');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the built in example runs end to end', async () => {
  const biss = await loadBiss();
  const w = biss.window;

  w.showExample(w.document.querySelector('input[data-msg="show_example"]'));

  assert.deepEqual(biss.errors, []);
  assert.ok(w.document.getElementById('input_occ_biss01_tb'), 'plot biss01 exists');
  assert.ok(w.document.getElementById('input_occ_biss02_tb'), 'plot biss02 exists');
  assert.ok(colData(w, 'occ_all_tb', 'Species').length > 0,
            'the all plots table has species');

  // The example drops the two columns it does not use. It used to do that by
  // row number, which deletes something else as soon as data.js changes.
  const cols = colNames(w, 'occ_all_tb');
  assert.ok(!cols.includes('Abundance'), `Abundance was dropped, got ${cols}`);
  assert.ok(!cols.includes('Rank'), `Rank was dropped, got ${cols}`);
  assert.ok(cols.includes('Cover'), 'and Cover, its neighbour, was not');

  biss.close();
});
