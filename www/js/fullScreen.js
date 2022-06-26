// Switch full screen mode
// https://gray-code.com/javascript/display-the-page-in-full-screen/
function switchScreenShow(id){
  if( checkFullScreen() ) {
    document.exitFullscreen(); 
    var button = document.getElementById(id);
    button.setAttribute("value", "TO FULL SCREEN");
  } else {
    document.body.requestFullscreen(); 
    var button = document.getElementById(id);
    button.setAttribute("value", "to normal show");
  }
}
function checkFullScreen(){
  var fullscreen_flag = false;
  if(document.fullscreenElement) { fullscreen_flag = true; }
  return fullscreen_flag;
}
