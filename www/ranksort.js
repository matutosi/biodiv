// Convert string array to numeric array
//    Available when all element of array can be convert to numeric by Number().
//    Some element can NOT be converted, return input array.
//    "" will be converted to null.
function string2Numeric(array){
  array = blank2Null(array);
  var res_array = [];
  for(let i=0; i<array.length; i++){
    if(isNaN(Number(array[i]))){ return array; }
    if(array[i] === null){ res_array[i] = null;             }
    else                 { res_array[i] = Number(array[i]); }
  }
  return res_array;
}

// Convert blank ("") string in array to null.
function blank2Null(array){
  var res_array = [];
  for(let i=0; i<array.length; i++){
    if(array[i] === ""){ res_array[i] = null;     }
    else               { res_array[i] = array[i]; }
  }
  return res_array;
}

// Rank of each element in an array (1st version)
//    
//    Rank starts with 0, because rank will be used to sort arrays.
//    In case of tie, return former element with a smaller index.
//    null return as the last element. 
//    "" will be converted into null, and return as the last element. 
//      rank([5, 3, 2, 4, null, 1, 3])
//      >>   [5, 2, 1, 4, 6,    0, 3]
function rank(array, dir = "asc"){
// var array = ["3","1","","", "2"];
// var array = [3,2,"","", 2];
    array = string2Numeric(array);
    var rank = [];
    var n_array = array.length;
    for (let i=0; i<n_array; i++) { rank[i] = 0; }
    if(dir === "desc"){
      for (let i=1; i<n_array; i++) {
          for (let j=0; j<i; j++) {
              if( array[j]  <  array[i]) { rank[j]++; }
              if( array[j]  >  array[i]) { rank[i]++; }
              if( array[j] === array[i]) { rank[j]++; }
          }
      }
    } else {
      for (let i=1; i<n_array; i++) {
          for (let j=0; j<i; j++) {
              if( array[j] > array[i]){
                  if( array[i] === null ){ rank[i]++; }
                  else                   { rank[j]++; }
              }
              if( array[j] < array[i]){
                  if(array[j] === null) { rank[j]++; }
                  else                  { rank[i]++; }
              }
              if( array[j] === array[i]){ rank[i]++; }
          }
      }
    }
    return rank;
}


// Sort array with rank_array
//    dir="desc" reverse rank
function sortByOrder(array, rank_array, dir="asc"){
  const n = array.length;
  if(n !== rank_array.length){
    alert("Length of array and rank_array must be same!");
    return array;
  }
  var sorted_array = [];
  if(dir === "desc") rank_array = reverseRank(rank_array);
  for(let Ni=0; Ni<n; Ni++){
    sorted_array[rank_array[Ni]] = array[Ni];
  }
  return sorted_array;
}








// Rank of each element in an array (1st version)
//    
//    CAUTION: null or "" will be return as first index
//        if null or "" should return the last use latest version (rank())
//    
//    Rank starts with 0, because rank will be used to sort arrays.
//    In case of tie, return former element with a smaller index.
//      rank([5, 3, 2, 4, 1, 3])
//      >>   [5, 2, 1, 4, 0, 3]
function rank_1(array, dir="asc"){
    array = string2Numeric(array);
    var rank = [];
    var n_array = array.length;
    for (let i=0; i<n_array; i++) { rank[i] = 0; }
    for (let i=1; i<n_array; i++) {
        for (let j=0; j<i; j++) {
            if( array[j] <= array[i] ){ rank[i]++; } // <= : for tie rank
            if( array[j] >  array[i] ){ rank[j]++; }
        }
    }
    if(dir === "desc") return reverseRank(rank);
    return rank;
}

// Helper to reverse rank. 
//    reverseRank([4, 1, 2, 0, 3])
//    >>          [0, 3, 2, 4, 1]
function reverseRank(array){
  n = array.length;
  res_array = [];
  for(let i=0; i<n; i++){
    res_array[i] = (n - 1) - array[i];
  }
  return res_array;
}

// Sort function to test functions: sortByOrder() and rank()
//    // test
//    const a = ["c", "a", "c", "v", "e", "d"];
//    const b = [ 30, 30,  20,  50,  10, 40 ];
//    sortByOrder(a, rank(b))
function sort2(array){
  return sortByOrder(array, rank(array));
}
