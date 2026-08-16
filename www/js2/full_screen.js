// Switch full screen mode
// https://gray-code.com/javascript/display-the-page-in-full-screen/
function switchScreenShow(id){
  if( checkFullScreen() ) {
    document.exitFullscreen(); 
  //     button.setAttribute("value", "FULL-SCRN");
  } else {
    document.body.requestFullscreen(); 
  //     button.setAttribute("value", "normal show");
  }
}
// true while the page is in full screen.
function checkFullScreen(){
  let fullscreen_flag = false;
  if(document.fullscreenElement) { fullscreen_flag = true; }
  return fullscreen_flag;
}
