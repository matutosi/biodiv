// Data for default settings
//    
//    data_types: input data types in setting table.
//    stand_json : stand settings.
//    occ_json  : occurrence settings.
//    @examples
//    data.data_types;
//    data.stand_json[0].item;
//    data.occ_json;
const data = {
  data_types: ["auto", "button", "checkbox", "fixed", "list", "text", "number"],

  stand_json: [{"item":"Project","type":"fixed","value":"","option":"Biodiv","hide":""},{"item":"Investigator","type":"text","value":"","option":"","hide":""},{"item":"Date","type":"auto","value":"","option":"","hide":""},{"item":"Location","type":"text","value":"","option":"","hide":""},{"item":"No","type":"auto","value":"","option":"","hide":""},{"item":"Stand","type":"text","value":"","option":"","hide":""},{"item":"locLatitude","type":"auto","value":"","option":"","hide":""},{"item":"locLongitude","type":"auto","value":"","option":"","hide":""},{"item":"locAccurracy","type":"auto","value":"","option":"","hide":""},{"item":"Altitude","type":"number","value":"","option":"","hide":""},{"item":"Aspect","type":"text","value":"","option":"","hide":""},{"item":"Inclination","type":"number","value":"","option":"","hide":""},{"item":"B1Height","type":"number","value":"","option":"","hide":""},{"item":"B1Cover","type":"number","value":"","option":"","hide":""},{"item":"B2Height","type":"number","value":"","option":"","hide":""},{"item":"B2Cover","type":"number","value":"","option":"","hide":""},{"item":"S1Height","type":"number","value":"","option":"","hide":""},{"item":"S1Cover","type":"number","value":"","option":"","hide":""},{"item":"S2Height","type":"number","value":"","option":"","hide":""},{"item":"S21Cover","type":"number","value":"","option":"","hide":""},{"item":"K1Hieght","type":"number","value":"","option":"","hide":""},{"item":"K1Cover","type":"number","value":"","option":"","hide":""},{"item":"memo","type":"text","value":"","option":"","hide":""},{"item":"","type":"","value":"","option":"","hide":""},{"item":"","type":"","value":"","option":"","hide":""},{"item":"","type":"","value":"","option":"","hide":""}],

  occ_json: [{"item":"date","type":"auto","value":"","option":"","hide":""},{"item":"locLat","type":"auto","value":"","option":"","hide":""},{"item":"locLon","type":"auto","value":"","option":"","hide":""},{"item":"locAcc","type":"auto","value":"","option":"","hide":""},{"item":"delButton","type":"button","value":"","option":"","hide":""},{"item":"no","type":"auto","value":"","option":"","hide":""},{"item":"Identified","type":"checkbox","value":"","option":"","hide":""},{"item":"Sampled","type":"checkbox","value":"","option":"","hide":""},{"item":"Stand","type":"fixed","value":"Stand_01","option":"","hide":""},{"item":"Layer","type":"list","value":"B1;B2;S1;S2;K","option":"","hide":""},{"item":"Species","type":"text","value":"","option":"","hide":""},{"item":"Cover","type":"number","value":"","option":"","hide":""},{"item":"memo","type":"text","value":"","option":"","hide":""},{"item":"","type":"","value":"","option":"optional","hide":""},{"item":"","type":"","value":"","option":"optional","hide":""},{"item":"","type":"","value":"","option":"optional","hide":""}]
};

// arrange JSON https://tools.m-bsys.com/development_tooles/json-beautifier.php
// csv2JSON https://www.site24x7.com/ja/tools/csv-to-json.html
// JSON2csv https://qiita.com/_s_/items/79c24b62cebb02e9304a
// 
// stand_csv
// item,type,value,option,hide
// Project,fixed,,Biodiv,
// Investigator,text,,,
// Date,auto,,,
// Location,text,,,
// No,auto,,,
// Stand,text,,,
// locLatitude,auto,,,
// locLongitude,auto,,,
// locAccurracy,auto,,,
// Altitude,number,,,
// Aspect,text,,,
// Inclination,number,,,
// B1Height,number,,,
// B1Cover,number,,,
// B2Height,number,,,
// B2Cover,number,,,
// S1Height,number,,,
// S1Cover,number,,,
// S2Height,number,,,
// S21Cover,number,,,
// K1Hieght,number,,,
// K1Cover,number,,,
// memo,,,,
// ,,,,
// ,,,,
// ,,,,
// 
// occ_csv
// item,type,value,option,hide
// date,auto,,,
// locLat,auto,,,
// locLon,auto,,,
// locAcc,auto,,,
// delButton,button,,,
// no,auto,,,
// Identified,checkbox,,,
// Sampled,checkbox,,,
// Stand,fixed,Stand_01,,
// Layer,list,B1;B2;S1;S2;K,,
// Species,text,,,
// Cover,number,,,
// memo,text,,,
// ,,,optional,
// ,,,optional,
// ,,,optional,
