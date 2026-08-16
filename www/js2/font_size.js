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
const FONT_SIZE_STEP = 1.2;   // one press up or down

// Make everything bigger by one step.
function larger(){  changeFontSize(FONT_SIZE_STEP);     }
// Make everything smaller by one step.
function smaller(){ changeFontSize(1 / FONT_SIZE_STEP); }

// Multiply '--font-size' by a factor, starting from 16px when it is not set.
//   @param factor  A number. Above 1 enlarges, below 1 shrinks.
function changeFontSize(factor){
  const root = document.documentElement;
  if(root.style.getPropertyValue('--font-size') === ''){
    root.style.setProperty('--font-size', '16px');
  }
  const f_size = root.style.getPropertyValue('--font-size');
  const size = Number(f_size.replace('px', '')) * factor;
  root.style.setProperty('--font-size', size + 'px');
}
