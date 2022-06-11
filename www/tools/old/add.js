  // https://qiita.com/crawd4274/items/b6391bbaf0148a6a6301
function get_data_from_table() {
    let data = []
    Array.prototype.forEach.call(document.querySelectorAll("table#target>tbody>tr"), (e) => {
        if (e.classList.contains("hide"))
            return;
        if (e.classList.contains("add_row"))
            return;

        let row = []
        Array.prototype.forEach.call(e.querySelectorAll("td > input"), (txt) => {
            row.push(txt.value);
        })
        data.push(row);
    })
    return data
}
