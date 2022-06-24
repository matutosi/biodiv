// Extract all data from JSON data
//    Can extract data from simple JSON ()
//    @params json A JSON data.
//    @examples
//    extractJson(data.stand_json);
function extractJson(json){
  const keys = jsonKeys(json);
  var arr = [];
  for(k of keys){ arr[k] = []; }
  for(k of keys){
    for(j of json){ 
      if(j[k] === void 0) arr[k].push("")
      else                arr[k].push(j[k]);
    }
  }
  return arr;
}

// Extract JSON data with key
//    @params json A JSON data.
//    @params key  A key string.
//    @examples
//    json2Array(data.stand_json, "item");
//    json2Array(data.test, "item");
function json2Array(json, key){
  var arr = [];
  for(j of json){ 
    if(j[key] === void 0) arr.push("")
    else                  arr.push(j[key]);
  }
  return arr;
}

// Extract keys from JSON data
//    @params json A JSON data.
//    @examples
//    jsonKeys(data.stand_json)
//  
function jsonKeys(json){
  var arr = [];
  for(j of json){ arr = arr.concat(Object.keys(j));; }
  return uniq(arr);
}
