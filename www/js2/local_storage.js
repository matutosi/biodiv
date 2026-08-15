// 
// 
//    @param sp_list An array.
//    @examples
//    console.log(removeSLinLS());
//    console.log(getLSKeys());
//    console.log(getSLinLS());
//    console.log(addSLinLS([1,2,3]));
//    console.log(getSLinLS());
//    console.log(addSLinLS([1,2,5,6,7]));
//    console.log(uniq(getSLinLS()));
function addSLinLS(sp_list, ns='base'){
  if(getSLinLS(ns) === ''){
    var new_list = sp_list;
  }else{
    var old_list = getSLinLS(ns);
    var new_list = old_list.concat(sp_list);
  }
  var new_list = uniq(new_list.sort());
  localStorage.setItem('biss_sl-' + ns, new_list);
}
// The species list stored for a name space, or '' when there is none.
function getSLinLS(ns='base'){
  if(localStorage['biss_sl-' + ns] === void 0){
    return '';
  }else{
    return localStorage['biss_sl-' + ns].split(',');
  }
}
// Remove every stored species list.
function removeSLinLSAll(){ removeSLinLS('all_remove'); }
// Remove the species list of a name space ('all_remove' for all of them).
function removeSLinLS(ns='base'){
  if(ns === 'all_remove'){
    var keys = getKeysOfSLinLS();
    for(let key of keys){ localStorage.removeItem(key); }
  }else{
    localStorage.removeItem('biss_sl-' + ns);
  }
}
// Every key in localStorage.
function getLSKeys(){
  return Object.keys(localStorage);
}
// The localStorage keys that hold a species list.
function getKeysOfSLinLS(){
  var keys = getLSKeys();
  // var keys = ['biss_sl-2', 'biss_sl-1', 'bis_sl-1', 'abiss_sl-1'];
  return grepArray(keys, /^biss_sl-/);
}
// The elements of an array that match a regular expression.
function grepArray(array, regex){
  var matched = [];
  for(let a of array){
    if(regex.test(a)){
      matched.push(a);
    }
  }
  return matched;
}
// Replace a string in every element of an array.
function replaceArrayAll(array, search, replace){
  var replaced = [];
  for(let a of array){
    replaced.push(a.replaceAll(search, replace));
  }
  return replaced;
}
