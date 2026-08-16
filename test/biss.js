// Load www/biodiv2.html in jsdom and give the page back, ready to drive.
//
//   The app has no module system, so there is nothing to require(): the only
//   way to test it is to build the page the way a browser does and then call
//   the global functions. loadBiss() does that and collects every error the
//   page raises, so that a test can assert that a flow ran cleanly.
//
//   Three things jsdom does not give us on its own:
//     - localStorage needs a real origin, so the page is served from
//       http://biss.test/ and LocalFiles() reads js2/ and css2/ from disk.
//     - HTMLCollection is iterable in every browser but not in jsdom, and
//       getSelectOne() walks select.options with for...of.
//     - createObjectURL, geolocation and the dialogs are not implemented.

const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom');

const WWW  = path.join(__dirname, '..', 'www');
const HTML = path.join(WWW, 'biodiv2.html');
const ORIGIN = 'http://biss.test/';

// Messages jsdom prints for the browser features it does not implement.
//   They are not findings: the app only reaches them when a file is actually
//   downloaded or the screen is actually switched.
const NOT_IMPLEMENTED = /Not implemented/;

// Serve www/ over the pretend origin, so that the page keeps a real origin
//   (localStorage) while its <script src="js2/..."> still comes from disk.
class LocalFiles extends ResourceLoader {
  fetch(url){
    const rel = url.slice(ORIGIN.length).split(/[?#]/)[0];
    return Promise.resolve(fs.readFileSync(path.join(WWW, decodeURIComponent(rel))));
  }
}

// Build the page and return a handle to it.
//   @return  { window, errors, close() }
//              window: the page, with every function of js2/ on it.
//              errors: the errors the page raised, as strings.
async function loadBiss(){
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => {
    if(!NOT_IMPLEMENTED.test(e.message)){ errors.push(String(e.stack || e.message)); }
  });
  virtualConsole.on('error', (...args) => errors.push(args.join(' ')));

  const dom = new JSDOM(fs.readFileSync(HTML, 'utf8'), {
    url: ORIGIN + 'biodiv2.html',
    runScripts: 'dangerously',
    resources: new LocalFiles(),
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse: stub,     // the page's own <script> blocks run during parsing
  });

  await new Promise(resolve => {
    if(dom.window.document.readyState === 'complete'){ resolve(); }
    else { dom.window.addEventListener('load', resolve); }
  });

  return {
    window: dom.window,
    errors,
    close: () => dom.window.close(),
  };
}

// Fill in what jsdom does not have, before any script of the page runs.
function stub(window){
  // for...of over select.options and the like. Browsers have this.
  for(const name of ['HTMLCollection', 'HTMLOptionsCollection']){
    const proto = window[name] && window[name].prototype;
    if(proto && !proto[Symbol.iterator]){
      proto[Symbol.iterator] = Array.prototype[Symbol.iterator];
    }
  }

  // innerText. jsdom has no layout, so it does not implement it, and
  // getColNames() reads the column names with it. textContent is close
  // enough here: the th of a BISS table holds a plain name and nothing else.
  if(!('innerText' in window.HTMLElement.prototype)){
    Object.defineProperty(window.HTMLElement.prototype, 'innerText', {
      configurable: true,
      get(){ return this.textContent; },
      set(text){ this.textContent = text; },
    });
  }

  // Saving a file. The tests read the data through getTableDataAsArray()
  // instead, so these only have to exist.
  window.URL.createObjectURL = () => 'blob:biss-test';
  window.URL.revokeObjectURL = () => {};

  // GPS. Nothing calls it unless the GPS button is pressed, but getLat() and
  // friends read the empty arrays and return "undefined" either way.
  Object.defineProperty(window.navigator, 'geolocation', {
    configurable: true,
    value: { watchPosition: () => 1, clearWatch: () => {} },
  });

  // Dialogs. addInputTab() asks for a plot name when it is not given one.
  window.alert   = () => {};
  window.confirm = () => true;
  window.prompt  = () => 'prompted-plot';
}

// Copy a value out of the page into this realm.
//   An array built inside jsdom is a window.Array, so assert.deepEqual()
//   refuses to match it against a plain array here. Rebuild it.
function plain(value){
  return Array.isArray(value) || (value && typeof value.length === 'number' && typeof value !== 'string')
    ? Array.from(value, plain)
    : value;
}

// Column names of a table, in order. null when the table is not there.
function colNames(window, id){
  const table = window.document.getElementById(id);
  return (table === null) ? null : plain(window.getColNames(table));
}

// The data of one column of a table, as a plain array.
function colData(window, id, name){
  return plain(window.getColData(window.document.getElementById(id), name));
}

// Add a plot tab with a fixed name, without the prompt.
function addPlot(window, name){
  window.addInputTab({ obj: window.document.getElementById('add_tab'), id: name });
}

module.exports = { loadBiss, colNames, colData, addPlot, plain, ORIGIN };
