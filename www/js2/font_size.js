// Change font size
//   '--font-size' should be defined in a CSS.
//   For Biodiversity Investigation System (BISS), 
//   in table.css as shown below.
//       :root {
//         --font-size: 16px;
//       }
//       input,select,chkbox,b{
//         font-size   : var(--font-size);
//       }
//   In html the button is created as shown below.
//       <input type="button" value="smaller" onclick="smaller()" />
//       <input type="button" value="LARGER" onclick="larger()"  />
function larger(){
  if(document.documentElement.style.getPropertyValue('--font-size') === ''){
    document.documentElement.style.setProperty('--font-size', '16px');
  }
  var f_size = document.documentElement.style.getPropertyValue('--font-size');
  var size = Number(f_size.replace('px', '')) * 1.2;
  document.documentElement.style.setProperty('--font-size', size + 'px');
}
// Shrink the whole screen by 1/1.2, from the same '--font-size'.
function smaller(){
  if(document.documentElement.style.getPropertyValue('--font-size') === ''){
    document.documentElement.style.setProperty('--font-size', '16px');
  }
  var f_size = document.documentElement.style.getPropertyValue('--font-size');
  var size = Number(f_size.replace('px', '')) / 1.2;
  document.documentElement.style.setProperty('--font-size', size + 'px');
}
