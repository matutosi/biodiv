// ESLint settings for BISS
//
//   Target: the current version only (www/js2/, www/biodiv2.html).
//   The old version (www/js/, www/css/) is frozen and NOT checked.
//   The distributed files (www/biss.html, www/biss2.html) are built by
//   inliner and are NOT checked either.
//
//   BISS has no module system on purpose: the event handlers are written as
//   strings ("delRow(this)") and are evaluated in the global scope, so every
//   function in js2/ has to be a global. collectAppGlobals() reads the source
//   and registers those names, so that no-undef still catches a typo or an
//   undeclared variable without a hand kept list of 189 names.

const fs = require('node:fs');
const path = require('node:path');
const globals = require('globals');

const JS2_DIR   = path.join(__dirname, 'www', 'js2');
const MAIN_HTML = path.join(__dirname, 'www', 'biodiv2.html');

// Top level declarations of a js2 file: "function f(", "var x", "let x", "const x".
//   No leading space is allowed on purpose. Everything inside a function is
//   indented in js2/, so this keeps local variables out of the global list.
const DECLARATION = /^(?:async +)?function +([A-Za-z_$][\w$]*)|^(?:var|let|const) +([A-Za-z_$][\w$]*)/gm;

// The same, for the inline <script> blocks of biodiv2.html, which are indented.
const DECLARATION_HTML = /^ *(?:async +)?function +([A-Za-z_$][\w$]*)|^ *(?:var|let|const) +([A-Za-z_$][\w$]*)/gm;

// Every name that js2/ and biodiv2.html put into the global scope.
//   @return  An object for languageOptions.globals.
function collectAppGlobals(){
  // js2/wamei.js is 650 kB of plant names; skip reading it and name its two
  // globals here. flora is writable: replaceFlora() assigns to it.
  const app = { wamei: 'writable', flora: 'writable' };

  const sources = fs.readdirSync(JS2_DIR)
    .filter(f => f.endsWith('.js') && !f.startsWith('wamei'))
    .map(f => path.join(JS2_DIR, f));

  for(const file of sources){
    const src = fs.readFileSync(file, 'utf8');
    for(const found of src.matchAll(DECLARATION)){
      app[found[1] || found[2]] = 'writable';
    }
  }
  // The inline <script> blocks of biodiv2.html declare tabs, pages, column_no, ...
  const html = fs.readFileSync(MAIN_HTML, 'utf8');
  for(const found of html.matchAll(DECLARATION_HTML)){
    app[found[1] || found[2]] = 'writable';
  }
  return app;
}

module.exports = [
  {
    ignores: [
      'www/js/**',        // frozen old version
      'www/css/**',       // frozen old version
      'www/js2/wamei.js', // data, not code
      'www/js2/wamei_data.js',
      'www/biss.html',    // built by inliner
      'www/biss2.html',
      'node_modules/**',
      '.venv/**',         // the Python side of the browser tests
    ],
  },
  {
    files: ['www/js2/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',   // no modules: loaded with plain <script> tags
      globals: { ...globals.browser, ...collectAppGlobals() },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // Errors: these are the ones that bite. An undeclared variable becomes a
      // global that leaks between calls, and a redeclaration hides a mistake.
      //   builtinGlobals: false, because every function of js2/ is registered
      //   as a global above; defining it is not a redeclaration.
      'no-undef'       : 'error',
      'no-redeclare'   : ['error', { builtinGlobals: false }],
      'no-delete-var'  : 'error',
      'no-global-assign': 'error',
      'no-implicit-globals': 'off',   // every function here IS a global, by design

      // Warnings: the cleanup targets.
      //   vars: 'local', because a global function is the API to the other
      //   files; only a variable unused inside its own function is a finding.
      'no-var'         : 'warn',
      'prefer-const'   : 'warn',
      'no-unused-vars' : ['warn', { vars: 'local', args: 'none' }],
    },
  },
  {
    // The tooling itself runs on Node.
    files: ['eslint.config.js', 'test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
];
