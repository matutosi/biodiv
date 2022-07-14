// Data for default settings
//    data.setting_plot_default;
//    data.setting_occ_default;
//    data.input_occ_exam01;
// 
// arrange JSON https://tools.m-bsys.com/development_tooles/json-beautifier.php
// csv2JSON https://www.site24x7.com/ja/tools/csv-to-json.html
// JSON2csv https://qiita.com/_s_/items/79c24b62cebb02e9304a
const data = {
  setting_plot_default: '{"sys_c_names":["item","type","value","delButton"]};{"sys_d_types":["text","select-one","text","button"]};{"sys_selects":[null,["auto","button","checkbox","fixed","list","text","number"],null,null]};{"item":["Plot","Investigator","delButton","Date","No","Location","locLat","locLon","locAcc","updateButton","Altitude","Aspect","Inclination","B1Height","B2Height","S1Height","S2Height","K1Hieght","B1Cover","B2Cover","S1Cover","S21Cover","K1Cover","Memo"],"type":["text","text","button","auto","auto","text","auto","auto","auto","button","number","text","number","number","number","number","number","number","number","number","number","number","number","text"],"value":["","","","","","","","","","","","","","","","","","","","","","","",""],"delButton":["DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE"]}',

  setting_occ_default: '{"sys_c_names":["item","type","value","delButton"]};{"sys_d_types":["text","select-one","text","button"]};{"sys_selects":[null,["auto","button","checkbox","fixed","list","text","number"],null,null]};{"item":["Date","locLat","locLon","locAcc","delButton","updateButton","No","Layer","Species","Cover","Identified","Sampled","Memo"],"type":["auto","auto","auto","auto","button","button","auto","list","text","number","checkbox","checkbox","text"],"value":["","","","","","","","B1:B2:S1:S2:K","","","","",""],"delButton":["DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE"]}',

  input_occ_exam01: '{"sys_c_names":["Plot","Date","locLat","locLon","locAcc","delButton","updateButton","No","Layer","Species","Cover","Identified","Sampled","Memo"]};{"sys_d_types":["fixed","fixed","fixed","fixed","fixed","button","button","fixed","select-one","text","number","checkbox","checkbox","text"]};{"sys_selects":[null,null,null,null,null,null,null,null,["B1","B2","S1","S2","K",""],null,null,null,null,null]};{"Plot":["exam01","exam01","exam01","exam01","exam01","exam01","exam01","exam01"],"Date":["2022_07_08_14_47_27","2022_07_08_14_47_26","2022_07_08_14_48_21","2022_07_08_14_47_29","2022_07_08_14_47_31","2022_07_08_14_47_30","2022_07_08_14_47_30","2022_07_08_14_47_27"],"locLat":["34.734","34.734","34.734","34.734","34.734","34.734","34.734","34.734"],"locLon":["135.287","135.287","135.287","135.287","135.287","135.287","135.287","135.287"],"locAcc":["16.8","16.8","16.8","16.8","16.8","16.8","16.8","16.8"],"delButton":["DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE","DELETE"],"updateButton":["Update Time & GPS","Update Time & GPS","Update Time & GPS","Update Time & GPS","Update Time & GPS","Update Time & GPS","Update Time & GPS","Update Time & GPS"],"No":["2","1","8","4","7","6","5","3"],"Layer":["B1","B1","K","B2","K","S1","S2","B2"],"Species":["bbbb","abc","hhhh sp","dddddddddddd sp","ggg","fff","eeee","ccccccccc"],"Cover":["53","29","9","11","13","9","0.2",".1"],"Identified":[true,true,false,true,true,true,true,true],"Sampled":[false,false,true,true,false,false,false,false],"Memo":["","","","maybe","","","",""]}',
};
