// Keep a copy of the survey in the browser, so that closing the tab by
// mistake does not lose it.
//
//   The auto save writes a file every n minutes, which is the copy to keep.
//   It cannot help at the moment the tab is closed, though: a browser does
//   not let a page start a download while it is going away. What a page may
//   still do then is write to its own storage, so that is what this does.
//
//   The copy is written whenever the page goes out of sight (the tab is
//   closed, the browser is left for another app, the phone is locked). On
//   the next start, if a copy is there, the page offers to put it back.
//
//   What is kept is each plot's two tables as they stand, which is what
//   buildPlotTab() needs, and the two settings tables, so that a plot can
//   still be added after a restore. The species lists are already in
//   localStorage of their own.

const BACKUP_KEY = 'biss_backup';
const BACKUP_DELAY = 3000;   // ms of quiet after typing before the copy is written

// Every plot on the page, as the tables it is made of.
//   @return An array of { id, plot, occ }, empty when there is no plot.
function getSurveyBackup(){
  const plots = [];
  for(const table of document.querySelectorAll("table[id^='input_plot_']")){
    const id = table.id.replace(/^input_plot_/, '').replace(/_tb$/, '');
    const occ = document.getElementById('input_occ_' + id + '_tb');
    if(occ === null){ continue; }
    plots.push({ id: id, plot: getTableData(table), occ: getTableData(occ) });
  }
  return plots;
}

// The settings a plot is made from, as they stand.
//   @return { plot, occ }, each { ns, data } or null.
function getSettingsBackup(){
  const settings = {};
  for(const category of ['plot', 'occ']){
    const table = settingTable(category);
    settings[category] = (table === null) ? null
      : { ns: table.id.replace(/_tb$/, ''), data: getTableData(table) };
  }
  return settings;
}

// Write the copy, unless there is nothing to write.
//   A page with no plot leaves the copy alone: opening the app to look at
//   something must not throw away what was left from the day before.
function saveSurveyBackup(){
  const plots = getSurveyBackup();
  if(plots.length === 0){ return void 0; }
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(
      { saved: getNow(), settings: getSettingsBackup(), plots: plots }));
  } catch { }   // full or forbidden storage must not stop the survey
}

// Write the copy once the typing stops.
//   Leaving the page is not the only way to lose it: a browser can be killed
//   where it stands. Writing after every keystroke would build every table
//   again each time, so wait for a moment of quiet first.
let backup_timer;
function scheduleSurveyBackup(){
  clearTimeout(backup_timer);
  backup_timer = setTimeout(saveSurveyBackup, BACKUP_DELAY);
}

// The copy, or null when there is none to read.
function readSurveyBackup(){
  try {
    const text = localStorage.getItem(BACKUP_KEY);
    if(text === null){ return null; }
    const backup = JSON.parse(text);
    return (backup.plots === void 0 || backup.plots.length === 0) ? null : backup;
  } catch {
    return null;
  }
}

// Build the plots of the copy again. A plot that is already on the page is
//   left as it is: what is on screen was typed later than the copy.
function restoreSurvey(){
  const backup = readSurveyBackup();
  if(backup === null){ return void 0; }
  // The settings first: a plot added after the restore is built from them.
  if(backup.settings !== void 0){
    for(const category of ['plot', 'occ']){
      const setting = backup.settings[category];
      if(setting != void 0){ showSettingModule(category, setting.data, setting.ns); }
    }
  }
  for(const plot of backup.plots){
    if(document.getElementById(plot.id) !== null){ continue; }
    buildPlotTab({ id: plot.id, plot_data: plot.plot, occ_data: plot.occ });
  }
  hideRestoreNotice();
}

// Throw the copy away, after asking.
function discardSurveyBackup(){
  if(!confirm( msg('confirm_discard_backup') )){ return void 0; }
  try { localStorage.removeItem(BACKUP_KEY); } catch { }
  hideRestoreNotice();
}

// Offer to restore, when a copy was left behind. Call once, at the start.
function showRestoreNotice(){
  const holder = document.getElementById('restore_holder');
  if(holder === null){ return void 0; }
  const backup = readSurveyBackup();
  if(backup === null){ return void 0; }
  holder.appendChild( msgSpan('restore_note', backup.saved, backup.plots.length) );
  holder.appendChild( createInput({ type: 'button', value: msg('restore'),
                                    'data-msg': 'restore', onclick: 'restoreSurvey()' }) );
  holder.appendChild( createInput({ type: 'button', value: msg('discard'),
                                    'data-msg': 'discard', onclick: 'discardSurveyBackup()' }) );
}

// Take the offer off the page.
function hideRestoreNotice(){
  const holder = document.getElementById('restore_holder');
  if(holder === null){ return void 0; }
  holder.textContent = '';
}

// When to write the copy.
//   'visibilitychange' is the one that can be relied on when the page goes
//   away: a phone may kill a tab it has hidden without ever raising
//   'pagehide' or 'beforeunload'. Typing is watched as well, for the times
//   the browser does not go away but stops.
document.addEventListener('visibilitychange', function(){
  if(document.visibilityState === 'hidden'){ saveSurveyBackup(); }
});
window.addEventListener('pagehide', saveSurveyBackup);
document.addEventListener('input',  scheduleSurveyBackup);
document.addEventListener('change', scheduleSurveyBackup);
