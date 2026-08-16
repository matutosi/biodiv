// The columns BISS treats specially.
//
//   These names are DATA, not labels. They are what ecan::read_biss() reads,
//   what a saved settings file holds and what a survey TSV is keyed by, so
//   they are never translated and never renamed. Collected here so that the
//   code can say which column it means instead of repeating the string, and
//   so that the list of columns the app knows about is in one place.
//
//   data.js spells the same names out again on purpose: that file is the data
//   a survey starts from, not code.

const COL = {
  PLOT      : 'PLOT',        // which plot a row belongs to
  NO        : 'NO',          // the number of the plot
  DATE      : 'DATE',        // filled in when the row is made
  LOC_LAT   : 'LOC_LAT',     // where the GPS said the row was made
  LOC_LON   : 'LOC_LON',
  LOC_ACC   : 'LOC_ACC',     // how sure the GPS was, in metres
  SPECIES   : 'Species',
  COVER     : 'Cover',
  LAYER     : 'Layer',
  IDENTIFIED: 'Identified',  // unchecked: the name is provisional
  SAME_AS   : 'SameAs',      // the plot whose provisional name this one shares

  // These two hold a button, not data. createAllInputsTable() drops them
  // before the survey data is written, so they never reach a saved file.
  DELETE         : 'DELETE',
  UPDATE_TIME_GPS: 'UPDATE_TIME_GPS',
};

// The columns that hold a button instead of data.
const BUTTON_COLS = [COL.DELETE, COL.UPDATE_TIME_GPS];

// The columns the app fills in by itself, in the order they are updated.
const AUTO_COLS = [COL.DATE, COL.LOC_LAT, COL.LOC_LON, COL.LOC_ACC];

// What the app fills a self-filling column with, right now.
//    Written as a function rather than a table of functions, so that it does
//    not matter whether gps.js and utils.js have been loaded yet.
//    @param  col_name  A string, a column name.
//    @return           A string, or undefined when the column is not one of these.
function autoValue(col_name){
  switch(col_name){
    case COL.DATE   : return getNow();
    case COL.LOC_LAT: return getLat();
    case COL.LOC_LON: return getLon();
    case COL.LOC_ACC: return getAcc();
    default         : return void 0;
  }
}
