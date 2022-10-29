function changeTab(){
  var targetid = this.href.substring(this.href.indexOf('#')+1,this.href.length);
  // show delected tab
  for(var i = 0; i < pages.length; i++) {
    if( pages[i].id != targetid ) {
      pages[i].style.display = "none";
    }
    else {
      pages[i].style.display = "block";
    }
  }
  // show front
  for(var i = 0; i < tabs.length; i++) {
    tabs[i].style.zIndex = "0";
  }
  this.style.zIndex = "10";

  // needs not to move tab
  return false;
}

function updateTab(){
  // get elements
  var tabs = document.getElementById('tabcontrol').getElementsByTagName('a');
  var pages = document.getElementById('tabbody').getElementsByTagName('div');
  // when clicked, enable to run changeTab() in all tab
  for(var i = 0; i < tabs.length; i++) {
    tabs[i].onclick = changeTab;
  }
}

// add a tab
function addTab(obj){

  id = prompt("表示させたい値", "初期値");
  confirm();
  var a = crEl({ el: 'a', ats: {href: "#" + id}, ih: id });
  var div = crEl({ el: 'div', ats: {id: id} });
  //   var a = crEl({ el: 'a' });
  //   var div = crEl({ el: 'div' });
  document.getElementById('tabcontrol').insertBefore(a, obj);
  document.getElementById('tabbody').appendChild(div);

  updateTab()
  tabs[tabs.length - 1].onclick();  // move tab
}
