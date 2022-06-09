$(function (){
  editable_table.Initalize();
});

var editable_table_val = {};
var editable_table = {
  Initalize: function () {
    $('.editable-table').find('td').each(function(){
      var $td = $(this);
      var tr = $(this).parent();
      var row = $('.editable-table').find('tr').index(tr);
      var col = $(tr).find('td').index(this);
      var idx = "$"+col+"_"+row;
      $(this).attr("data-address", idx);
      editable_table_val[idx] = $td.html();

      $td.click(function () {
        editable_table.ClearSelectionCells();
        $(this).toggleClass("selected", true);
      });
      $td.dblclick(function () {
        var $this = $(this);
        if ($this.hasClass("editing")) { return }
        if ($this.attr("lock") != undefined) { editable_table.CellLock(this); return }
        var adrs = $this.attr("data-address");
        var cell_val = editable_table_val[adrs];
        editable_table.ClearSelectionCells();
        var input = $("<textarea />").attr("id", "edit_target").attr("data-address", adrs).addClass("cell-edit").text(cell_val);
        $this.toggleClass("selected",true).html("").append(input);
        $this.addClass("editing");
        $("#edit_target").focus().blur(function (){
           var adrs = $(this).attr("data-address");
           var edit_val = $(this).text().toString();
           var rollback = editable_table_val[adrs];
           editable_table_val[adrs] = edit_val;

           $(this).remove();
           $("td[data-address='" + adrs + "']").toggleClass("editing", false);
           editable_table.Recalculation();
         });
      });
      $(document).keydown(function(e){
        // Esc キー
        if (e.keyCode == 27) {
          var adrs = $("#edit_target").attr("data-address");
          if (adrs == undefined) { return }
          $("#edit_target").remove();
          $("td[data-address='" + adrs + "']").toggleClass("editing", false);
          editable_table.Recalculation();
        }
      });
    });
  },
  ClearSelectionCells: function () {
    $('.editable-table').find('td').each(function(){
      $(this).toggleClass("selected", false);
    });
  },
  Recalculation: function() {
    for (idx in editable_table_val) {
      $("td[data-address='" + idx + "']").html(editable_table_val[idx]);
    }
  },
  CellLock: function(cell) {
    var msg = "このセルは変更できません。";
    var $tooltip = $("<span />").addClass("tooltip").append($("<span />").addClass("tooltip__body").text(msg));
    $('body').append($tooltip);
    var $cell = $(cell);
    var cell_offset = $cell.offset();
    var cell_size = { width: $cell.outerWidth(), height: $cell.outerHeight() };
    var tip_size = { width: $tooltip.outerWidth(), height: $tooltip.outerHeight() };
    $tooltip.css({ top: cell_offset.top - tip_size.height,
                  left: cell_offset.left + cell_size.width / 2 - tip_size.width / 2});
    $cell.mouseout(function (){ $('.tooltip').fadeOut("slow", function() {$(this).remove(); })});
  }
}
