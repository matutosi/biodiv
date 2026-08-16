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
  let new_list;   // declared here: the two branches and the line below share it
  if(getSLinLS(ns) === ''){
    new_list = sp_list;
  }else{
    const old_list = getSLinLS(ns);
    new_list = old_list.concat(sp_list);
  }
  new_list = uniq(new_list.sort());
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
// Remove the species list of a name space ('all_remove' for all of them).
function removeSLinLS(ns='base'){
  if(ns === 'all_remove'){
    const keys = getKeysOfSLinLS();
    for(const key of keys){ localStorage.removeItem(key); }
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
  const keys = getLSKeys();
  // var keys = ['biss_sl-2', 'biss_sl-1', 'bis_sl-1', 'abiss_sl-1'];
  return grepArray(keys, /^biss_sl-/);
}
// The elements of an array that match a regular expression.
function grepArray(array, regex){
  const matched = [];
  for(const a of array){
    if(regex.test(a)){
      matched.push(a);
    }
  }
  return matched;
}
// Replace a string in every element of an array.
function replaceArrayAll(array, search, replace){
  const replaced = [];
  for(const a of array){
    replaced.push(a.replaceAll(search, replace));
  }
  return replaced;
}
