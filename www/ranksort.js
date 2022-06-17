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

// Rank of each element in an array
//    Rank starts with 0, because rank will be used to sort arrays.
//    In case of tie, return former element with a smaller index.
//      rank([5, 3, 2, 4, 1, 3])
//      >>   [5, 2, 1, 4, 0, 3]
function rank(array, dir="asc"){
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
