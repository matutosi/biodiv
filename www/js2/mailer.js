// Launch mailer
//    https://rukiadia.hatenablog.jp/entry/2014/02/19/132445

// Create the span with the mailer button and the address box.
function createMailerSpan(){
  const span = crEl({ el:'span', ats:{id: 'mailer'} });
  span.appendChild( createLaunchMailerButton()    );
  span.appendChild( createEmailInput()            );
  return span;
}

// Open the default mailer with the input data as the mail body.
function launchMailer(){
  const email_adress = document.getElementById('email_adress').value;
  const check = /.+@.+\..+/;
  if( !check.test(email_adress) ){
    alert( msg('alert_email') );
    return void 0;
  }
  const body = getAllPlotOccDataAsJSON();
  const ref = 'mailto: '+ email_adress + '?subject=biss_' + getNow() + '&body=' + body;
  location.href = ref;
}

// Create the box for the address the mail is sent to.
function createEmailInput(){
  return crEl({ el:'input', ats:{id: 'email_adress', type: 'email', placeholder: 'biss@send.mail.com'} });
}

// Create the button that calls launchMailer().
function createLaunchMailerButton(){
  return createInput({ type: 'button', value: msg('launch_mailer'), 'data-msg': 'launch_mailer', onclick: 'launchMailer()' });
}
