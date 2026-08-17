// The features that no test watched: the sum, the GPS, the mailer, the auto
// save timer, the font size and the flora.
//
//   smoke.test.js follows the survey itself. This file takes the buttons
//   around it, one by one. They were all checked by hand once and then left
//   without a net, which is how a refactoring breaks one without a word.
//
//   What needs a real browser (full screen, the file dialog, what the screen
//   actually shows) is in e2e/test_biss.py instead.

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBiss, addPlot, plain } = require('./biss.js');

// One plot, two species, with a Layer and a Cover on each row.
async function surveyWithCover(){
  const biss = await loadBiss();
  const w = biss.window;
  w.changeSettingsByName('_5_layers');
  addPlot(w, 'p1');
  w.document.getElementById('sp_list_input-p1').value = 'Fagus crenata,Quercus serrata';
  w.document.getElementById('sp_list_add-p1').click();
  w.updateInputsPlotLayerSpecies();

  // Fill in Layer and Cover on the rows that hold a species.
  const table = w.document.getElementById('input_occ_p1_tb');
  const names = plain(w.getColNames(table));
  const covers = { 'Fagus crenata': ['T1', '30'], 'Quercus serrata': ['T1', '20'] };
  for(let Ri = 2; Ri < table.rows.length; Ri++){
    const cells = table.rows[Ri].cells;
    const species = cells[names.indexOf('Species')].firstChild.value;
    if(covers[species] === undefined){ continue; }
    cells[names.indexOf('Layer')].firstChild.value = covers[species][0];
    cells[names.indexOf('Cover')].firstChild.value = covers[species][1];
  }
  return biss;
}

test('the sum adds up a number column by a list column', async () => {
  const biss = await surveyWithCover();
  const w = biss.window;

  w.document.getElementById('input_occ_p1_sum_value').value = 'Cover';
  w.document.getElementById('input_occ_p1_sum_group').value = 'Layer';
  const button = w.document.querySelector('#input_occ_p1_dn input[onclick="sumWithGroup(this)"]');
  assert.ok(button, 'the plot has a calculate button');
  button.click();

  // The sum is shown as a table: the group, then the total.
  const sum = button.parentNode.lastElementChild;
  const rows = [...sum.rows].map(r => [...r.cells].map(c => c.textContent));
  assert.deepEqual(rows[0], ['Layer', 'Cover'], 'the sum names the two columns');
  assert.deepEqual(rows.slice(1), [['T1', '50']], 'T1 is 30 + 20, and an empty group is left out');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the sum is redrawn, not stacked, when it is asked for twice', async () => {
  const biss = await surveyWithCover();
  const w = biss.window;
  w.document.getElementById('input_occ_p1_sum_value').value = 'Cover';
  w.document.getElementById('input_occ_p1_sum_group').value = 'Layer';
  const button = w.document.querySelector('#input_occ_p1_dn input[onclick="sumWithGroup(this)"]');
  button.click();
  const after_one = w.document.querySelectorAll('#input_occ_p1_dn table').length;
  button.click();
  assert.equal(w.document.querySelectorAll('#input_occ_p1_dn table').length, after_one,
               'the second sum replaces the first');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the GPS keeps the last position it was told about', async () => {
  const biss = await loadBiss();
  const w = biss.window;

  // A GPS that reports two positions, then can be stopped.
  let stopped = false;
  const positions = [
    { coords: { latitude: 35.0, longitude: 135.0, accuracy: 12 } },
    { coords: { latitude: 36.5, longitude: 136.5, accuracy: 5 } },
  ];
  Object.defineProperty(w.navigator, 'geolocation', {
    configurable: true,
    value: {
      watchPosition: (ok) => { positions.forEach(ok); return 7; },
      clearWatch: (id) => { stopped = (id === 7); },
    },
  });

  const start = w.createStartGPSButton();
  w.document.body.appendChild(start);
  start.click();
  assert.equal(w.getLat(), '36.5', 'the latest latitude');
  assert.equal(w.getLon(), '136.5', 'the latest longitude');
  assert.equal(w.getAcc(), '5', 'the latest accuracy');

  // The button becomes the stop button, and the stop reaches the GPS.
  const stop = w.document.querySelector('input[onclick="stopGPS(this)"]');
  assert.ok(stop, 'the start button was replaced by the stop button');
  stop.click();
  assert.ok(stopped, 'clearWatch was called with the id watchPosition gave');
  assert.ok(w.document.querySelector('input[onclick="startGPS(this)"]'),
            'and the stop button becomes the start button again');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a GPS that fails does not stop the survey', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  Object.defineProperty(w.navigator, 'geolocation', {
    configurable: true,
    value: {
      watchPosition: (ok, ng) => { ng({ code: 1, message: 'denied' }); return 1; },
      clearWatch: () => {},
    },
  });
  const start = w.createStartGPSButton();
  w.document.body.appendChild(start);
  start.click();   // errorCallback() used to write into an element that is not there
  assert.ok(biss.errors.some(e => /GPS: 1, denied/.test(e)), 'the error is reported');
  assert.ok(w.document.querySelector('input[onclick="stopGPS(this)"]'), 'the watch is still on');
  biss.close();
});

test('the update button fills in the date and the position of its row', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  Object.defineProperty(w.navigator, 'geolocation', {
    configurable: true,
    value: {
      watchPosition: (ok) => { ok({ coords: { latitude: 35.5, longitude: 135.5, accuracy: 9 } }); return 1; },
      clearWatch: () => {},
    },
  });
  const start = w.createStartGPSButton();
  w.document.body.appendChild(start);
  start.click();

  w.changeSettingsByName('_5_layers');
  addPlot(w, 'gps');
  const table = w.document.getElementById('input_plot_gps_tb');
  const names = plain(w.getColNames(table));
  const button = table.rows[2].cells[names.indexOf('UPDATE_TIME_GPS')].firstChild;
  button.click();

  const cells = table.rows[2].cells;
  assert.equal(cells[names.indexOf('LOC_LAT')].textContent, '35.5');
  assert.equal(cells[names.indexOf('LOC_LON')].textContent, '135.5');
  assert.equal(cells[names.indexOf('LOC_ACC')].textContent, '9');
  assert.match(cells[names.indexOf('DATE')].textContent, /^\d{4}_\d{2}_\d{2}_/, 'the date is filled in');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the auto save timer follows the interval that is picked', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  const select = w.document.getElementById('select_auto_save_interval');
  assert.ok(select, 'the interval pull down is on the page');

  // Watch the timer instead of waiting minutes for it.
  const set = [], cleared = [];
  const real_set = w.setInterval, real_clear = w.clearInterval;
  let next_id = 100;
  w.setInterval = (fn, ms) => { set.push(ms); return next_id++; };
  w.clearInterval = (id) => { cleared.push(id); };

  select.value = '5';
  w.changeAutoSaveSttting(select);
  assert.deepEqual(set, [5 * 60 * 1000], 'five minutes');

  select.value = '1';
  w.changeAutoSaveSttting(select);
  assert.equal(cleared.length, 1, 'the old timer is stopped first');
  assert.deepEqual(set, [5 * 60 * 1000, 60 * 1000], 'one minute');

  // 'no save' stops it and starts nothing, whether or not a timer is running.
  select.value = 'no save';
  w.changeAutoSaveSttting(select);
  assert.equal(set.length, 2, 'no save schedules nothing');

  w.clearInterval = real_clear;
  w.setInterval = real_set;
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('no save schedules nothing even before any timer has run', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  const set = [];
  const real_set = w.setInterval;
  w.setInterval = (fn, ms) => { set.push(ms); return 1; };

  // setInterval(fn, Number('no save')) is setInterval(fn, NaN), which is
  // setInterval(fn, 0): a download every tick, for ever.
  w.changeAutoSaveSttting({ value: 'no save' });
  assert.deepEqual(set, [], 'nothing is scheduled');

  w.setInterval = real_set;
  biss.close();
});

test('the font size buttons step up and down again', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  const root = w.document.documentElement;
  const size = () => root.style.getPropertyValue('--font-size');

  assert.equal(size(), '', 'nothing is set until a button is pressed');
  w.larger();
  assert.equal(size(), '19.2px', '16px x 1.2');
  w.smaller();
  assert.equal(Math.round(Number(size().replace('px', '')) * 100) / 100, 16, 'and back to 16px');
  w.smaller();
  assert.ok(Number(size().replace('px', '')) < 16, 'below the start as well');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('the mailer refuses an address that is not one', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  let alerted = '';
  w.alert = (text) => { alerted = text; };

  w.document.getElementById('email_adress').value = 'not-an-address';
  w.launchMailer();
  assert.ok(alerted !== '', 'it says so instead of opening the mailer');

  // The body it would send is the same JSON the auto save writes.
  w.changeSettingsByName('_5_layers');
  addPlot(w, 'mail');
  const json = JSON.parse(w.getAllPlotOccDataAsJSON());
  assert.ok('plot' in json && 'occ' in json, 'the mail body holds both tables');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('closing the page keeps a copy of the survey', async () => {
  const biss = await surveyWithCover();
  const w = biss.window;

  // The browser is left for another app: that is when the copy is written.
  w.document.dispatchEvent(new w.Event('visibilitychange'));   // still visible
  assert.equal(w.localStorage.getItem('biss_backup'), null, 'nothing is written while it is on screen');

  Object.defineProperty(w.document, 'visibilityState', { configurable: true, value: 'hidden' });
  w.document.dispatchEvent(new w.Event('visibilitychange'));

  const backup = JSON.parse(w.localStorage.getItem('biss_backup'));
  assert.equal(backup.plots.length, 1, 'the one plot is in the copy');
  assert.equal(backup.plots[0].id, 'p1');
  assert.ok(backup.plots[0].occ.biss_inputs.Species.includes('Fagus crenata'),
            'with the species that were entered');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a copy that was left behind can be restored', async () => {
  // What the last visit wrote. A new page has a storage of its own, so the
  // copy is put there by hand, exactly as the browser would have kept it.
  const first = await surveyWithCover();
  Object.defineProperty(first.window.document, 'visibilityState',
                        { configurable: true, value: 'hidden' });
  first.window.document.dispatchEvent(new first.window.Event('visibilitychange'));
  const kept = first.window.localStorage.getItem('biss_backup');
  const before = plain(first.window.getColData(
    first.window.document.getElementById('input_occ_p1_tb'), 'Species'));
  first.close();

  const biss = await loadBiss();
  const w = biss.window;
  w.localStorage.setItem('biss_backup', kept);
  w.showRestoreNotice();

  const holder = w.document.getElementById('restore_holder');
  assert.ok(holder.textContent.includes('p1') === false, 'the offer names the time, not the plot');
  assert.ok(holder.querySelector('input[onclick="restoreSurvey()"]'), 'there is a Restore button');

  holder.querySelector('input[onclick="restoreSurvey()"]').click();

  assert.ok(w.document.getElementById('input_occ_p1_tb'), 'the plot is back');
  assert.deepEqual(plain(w.getColData(w.document.getElementById('input_occ_p1_tb'), 'Species')),
                   before, 'with the same species, in the same rows');
  assert.deepEqual(plain(w.getColData(w.document.getElementById('input_occ_p1_tb'), 'Cover')),
                   ['', '', '', '', '30', '20'], 'and the cover that was typed');
  assert.equal(holder.textContent, '', 'the offer is taken off the page');

  // The settings come back too, so that the next plot is not an empty table.
  assert.deepEqual(
    [...w.document.querySelectorAll('#tab_settings table')].map(t => t.id),
    ['_5_layers_plot_tb', '_5_layers_occ_tb'], 'the settings that were in use');
  addPlot(w, 'p2');
  assert.ok(plain(w.getColNames(w.document.getElementById('input_occ_p2_tb'))).includes('Species'),
            'a plot added after the restore is built from them');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('typing writes the copy without leaving the page', async () => {
  const biss = await surveyWithCover();
  const w = biss.window;
  assert.equal(w.localStorage.getItem('biss_backup'), null, 'nothing yet');

  // The wait for a moment of quiet, without the wait.
  const real_timeout = w.setTimeout;
  w.setTimeout = (fn) => { fn(); return 1; };
  w.document.getElementById('input_occ_p1_tb').querySelector('input')
   .dispatchEvent(new w.Event('input', { bubbles: true }));
  w.setTimeout = real_timeout;

  const backup = JSON.parse(w.localStorage.getItem('biss_backup'));
  assert.equal(backup.plots.length, 1, 'the copy is there before the tab is closed');
  assert.deepEqual(biss.errors, []);
  biss.close();
});

test('a page with no plot leaves the copy alone', async () => {
  const biss = await loadBiss();
  const w = biss.window;
  w.localStorage.setItem('biss_backup', '{"saved":"yesterday","plots":[{"id":"kept"}]}');

  Object.defineProperty(w.document, 'visibilityState', { configurable: true, value: 'hidden' });
  w.document.dispatchEvent(new w.Event('visibilitychange'));

  // Opening the app to look something up must not throw yesterday's work away.
  assert.ok(w.localStorage.getItem('biss_backup').includes('kept'));

  // Throwing it away is a decision, and it is asked about.
  w.confirm = () => false;
  w.discardSurveyBackup();
  assert.notEqual(w.localStorage.getItem('biss_backup'), null, 'a no keeps it');
  w.confirm = () => true;
  w.discardSurveyBackup();
  assert.equal(w.localStorage.getItem('biss_backup'), null, 'a yes throws it away');
  biss.close();
});

test('the flora can be replaced by a file of names', async () => {
  const biss = await loadBiss();
  const w = biss.window;

  // Written on Windows, so the lines end with \r\n: a name that keeps the \r
  // is never found by the search.
  const file = new w.File(['ススキ\r\nチガヤ\r\nチガヤ\r\n\r\nヨシ\r\n'], 'my_flora.txt',
                          { type: 'text/plain' });
  await w.replaceFlora({ files: [file] });

  // The names are taken as they are, once each, without the empty lines.
  assert.deepEqual(plain(w.eval('flora')), ['ススキ', 'チガヤ', 'ヨシ']);

  // The button now says which flora it searches, and the note about the
  // bundled one is gone.
  assert.match(w.document.getElementById('search_flora_button').value, /my_flora/);
  assert.equal(w.document.getElementById('note_wamei').style.display, 'none');

  // And a search finds a name of the new flora, not of the old one.
  w.document.getElementById('flora_input').value = 'チガヤ';
  w.searchFlora();
  const hits = [...w.document.querySelectorAll('#sp_list_module-flora input[type=button]')]
    .map(b => b.value);
  assert.ok(hits.includes('チガヤ'), `the new flora is searched, got ${hits}`);
  assert.deepEqual(biss.errors, []);
  biss.close();
});
