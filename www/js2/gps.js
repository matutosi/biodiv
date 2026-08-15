// HTML5 and JavaScript Developper Guide
//    ISBN: 978-4-798102968-6
//    http://www.shoeisha.co.jp/book/download/
//    Chap04 Sec03 c4_3002.html

// settings for GPS
var watchId = 0;
var positionOptions = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
};
var locations = {
  lat: [],
  lon: [],
  acc: []
};

// The latitude of the last position the GPS reported.
function getLat() { return String(locations.lat[locations.lat.length - 1]); }
// The longitude of the last position the GPS reported.
function getLon() { return String(locations.lon[locations.lon.length - 1]); }
// The accuracy (m) of the last position the GPS reported.
function getAcc() { return String(locations.acc[locations.acc.length - 1]); }


// GPS success
//   Use with tags below in html
//   <input type="button" value="start" onclick="startGPS()" />
//   <input type="button" value="stop" onclick="stopGPS()" />
//   <div id="poslog" ></div>
function successCallback(position){
  locations.lat.push(position.coords.latitude);
  locations.lon.push(position.coords.longitude);
  locations.acc.push(position.coords.accuracy);
}

// GPS error
//   The book this came from had a <div id="poslog"> to write into. BISS has
//   no such element, so writing there threw and the error was lost. Report
//   it to the console instead, where it can be read while the app keeps
//   running: a position that does not arrive must not stop the survey.
function errorCallback(positionError) {
  console.error('GPS: ' + positionError.code + ', ' + positionError.message);
}

// stop GPS
function stopGPS(obj) {
  navigator.geolocation.clearWatch(watchId);
  obj.replaceWith( createStartGPSButton() );
}

// start GPS
function startGPS(obj) {
  watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, positionOptions);
  obj.replaceWith( createStopGPSButton() );
}

// Create the button that starts watching the position.
function createStartGPSButton(){
  //   return createInput({ type: "button", value: "Use GPS", onclick: "startGPS(this)" });
  return crEl({ el:'input', ats:{type: 'button', value: msg('use_gps'), 'data-msg': 'use_gps', onclick: 'startGPS(this)', class: 'margin_right'} });

}
// Create the button that stops watching the position.
function createStopGPSButton(){
  return createInput({ type: "button", value: msg('stop_gps'), 'data-msg': 'stop_gps', onclick: "stopGPS(this)" });
}
