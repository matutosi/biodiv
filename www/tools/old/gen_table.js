  // https://cpoint-lab.co.jp/article/202002/13871/

window.addEventListener('load', () => {
  const refresh_button = document.getElementById('refresh');
  refresh_button.addEventListener('click', refresh_button_clicked);
});

function refresh_button_clicked(evt) {
  const table_in = document.getElementById('table_a');
  const n_row = table_in.rows.length;
  const n_col = table_in.rows[0].cells.length;

  var table_out = document.getElementById('table_out');
  //   var table_out =  document.createElement('table');
  //   table_out.appendChild(document.createElement('thead'));
  for(var Ri = 0; Ri < n_row; Ri++){
      var tr = document.createElement('tr');
      var row_i = table_in.rows[Ri];
      for(var Cj = 0; Cj < n_col; Cj++){
          var td = document.createElement('td');
          td.innerHTML = row_i.cells[Cj].innerText+'aaa';
          tr.appendChild(td);
      }
      table_out.appendChild(tr);
  }
}




function get_table(table){
  const table_in = document.getElementById(table);
  const n_row = table_in.rows.length;
  const n_col = table_in.rows[0].cells.length;


  var table_out = document.getElementById('table_out');
  //   var table_out =  document.createElement('table');
  //   table_out.appendChild(document.createElement('thead'));
  for(var Ri = 0; Ri < n_row; Ri++){
      var tr = document.createElement('tr');
      var row_i = table_in.rows[Ri];
      for(var Cj = 0; Cj < n_col; Cj++){
          var td = document.createElement('td');
          td.innerHTML = row_i.cells[Cj].innerText+'aaa';
          tr.appendChild(td);
      }
      table_out.appendChild(tr);
  }
}




function gen_table(){
  var tableEle = document.getElementById('data-table');
  for (var i = 0; i < 5; i++) {  // テーブルの行を 5行追加する
      var tr = document.createElement('tr');
      for (var j = 0; j < 3; j++) {
          var td = document.createElement('td');          // テーブルの列を 3行追加する
          td.innerHTML = 'データ'+(i+1)+"-"+(j+1);
          tr.appendChild(td);
      }
      tableEle.appendChild(tr);
  }
}


  // 基本的な説明
  // https://shanabrian.com/web/javascript/table-createthead.php


  // 表の計算
  // https://nonbiri3.com/?p=4248
