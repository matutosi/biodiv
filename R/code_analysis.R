rm(list=ls(all=TRUE));gc();gc();
library(tidyverse)

## read file
main_path <- "D:/matu/work/ToDo/biodiv/www/biodiv.html"
main <- readr::read_tsv(main_path, col_names = "main", show_col_types = FALSE)

funs_path <- "D:/matu/work/ToDo/biodiv/www/js/"

  # funs <- 
codes_funs <-
   dir(funs_path) %>%
  .[!stringr::str_detect(., "data")] %>%
  map(~str_c(funs_path, .)) %>%
  map(readr::read_tsv, col_names = "funs", show_col_types = FALSE) %>%
  bind_rows()

## main
main_funs <- 
  main %>%
  dplyr::filter(! stringr::str_detect(main, ' *//')) %>%
  dplyr::filter(! stringr::str_detect(main, "document\\.getElementById")) %>%
  dplyr::mutate(main = stringr::str_extract(main, '[^= ]+\\([^ ]*\\)')) %>%
  na.omit() %>%
  dplyr::mutate(main = stringr::str_replace_all(main, '\\"', '')) %>%
  dplyr::mutate(main = stringr::str_replace_all(main, '\\(.*\\)', '')) %>%
  dplyr::distinct() %>%
  magrittr::set_colnames("fun")

## code
all_funs <- 
  codes_funs %>%
  #   dplyr::filter(! stringr::str_detect(funs, ' *//')) %>%
  dplyr::mutate(funs = stringr::str_replace_all(funs, "//.*", "")) %>%
  #   dplyr::filter(stringr::str_detect(funs, fun_name))
    # function
    # ( fun ) "fun" { fun }
    # = fun( 
  dplyr::filter(stringr::str_detect(funs, '^.{0,6}function|= *[A-z0-9]+\\(|[\\(\\"\\{] *[A-z0-9]+\\(' )) %>%
  #   print()
  unlist() %>%
  purrr::reduce(stringr::str_c) %>%
  stringr::str_split("function") %>%
  data.frame() %>%
  tibble::tibble() %>%
  magrittr::set_colnames("code") %>%
  dplyr::filter(code != "") %>%
  dplyr::filter(! stringr::str_detect(code, "^\\(")) %>%
  dplyr::mutate(code = stringr::str_replace(code, "^ ", "")) %>%
  tidyr::separate(code, into=c("fun", NA), sep="\\(")

split_code <- function(x){
  # x <- code_funs[[1]][3]
  x <- 
  x %>%
    stringr::str_split('[" \\(\\),;=\\{\\}\\[\\]]',  simplify = TRUE) %>%
    .[. != ""]
  df <- tibble::tibble(fun = x[1], code = x[2:length(x)])
  return(df)
}

codes <- 
  codes_funs %>%
  dplyr::mutate(funs = stringr::str_replace_all(funs, "//.*", "")) %>%
  unlist() %>%
  purrr::reduce(stringr::str_c) %>%
  stringr::str_replace_all("[A-z]*\\.[A-z]*", "") %>%  # "document.getElementById"  -> ""
  stringr::str_split("function") %>%
  data.frame() %>%
  tibble::tibble() %>%
  magrittr::set_colnames("code") %>%
  dplyr::filter(code != "") %>%
  dplyr::filter(! stringr::str_detect(code, "^\\(")) %>%
  dplyr::mutate(code = stringr::str_replace(code, "^ ", "")) %>%
  unlist() %>%
  map(split_code) %>%
  bind_rows() %>%
  distinct() %>%
  dplyr::filter(code %in% unique(.$fun)) %>%
  dplyr::filter(fun != code) %>%
  dplyr::arrange(fun, code)


  # check if function remain
  # fun_name <- "createNewOccButton"     OK
  # fun_name <- "makePlotInputModule"    OK
  # fun_name <- "makeNewOccTableModule"  OK
  # fun_name <- "setSortable"
  # dplyr::filter(codes,    stringr::str_detect(fun,  fun_name))
  # dplyr::filter(codes,    stringr::str_detect(code, fun_name))
  # dplyr::filter(all_funs, stringr::str_detect(fun,  fun_name))

## 

trace_fun <- function(main_funs, codes, i, n = 20){
  tmp <- 
    dplyr::left_join(main_funs, codes) %>%
    magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun"))
    i <- i + 1
  if(i < n){
    tmp <- trace_fun(tmp, codes, i, n)
  }
  return(tmp)
}

used_funs_10 <- trace_fun(main_funs, codes, i = 0, n = 10) %>% unlist() %>% unique() %>% sort()
used_funs_15 <- trace_fun(main_funs, codes, i = 0, n = 15) %>% unlist() %>% unique() %>% sort()
  # used_funs_20 <- trace_fun(main_funs, codes, i = 0, n = 20) %>% unlist() %>% unique()
used_funs_15

setdiff(all_funs[[1]], used_funs_15)


 # > used_funs_15
 # [1] "addRow" "addRows" "addThLabel" "blank2Null" "checkFullScreen" "colByType" "createAddRowButton" "createDelButton" 
 # [9] "createFileButton" "createHideButton" "createHideRowButton" "createInput" "createInputTd" "createMakePlotButton" "createNewOccButton" "createNrowInput" 
 # [17] "createSaveInputButton" "createSaveSettingButton" "createSearchInput" "createSelectOpt" "createShowColButton" "createShowRowButton" "createShowShortTable" "createShowWideTable" 
 # [25] "createSumButton" "createTd" "createUpdateButton" "crEl" "delRow" "errorCallback" "get_data_type" "get_data_types" 
 # [33] "getAcc" "getCellData" "getColData" "getColNames" "getDataType" "getLat" "getLon" "getNow" 
 # [41] "getSelectOne" "getSelectOptionInCell" "getTableDataPlus" "hasDupPlot" "hash2table" "hideRow" "hideShowNext" "hideTableCol" 
 # [49] "inputTableModule" "launchMailer" "makeNewOccTable" "makeNewOccTableModule" "makeOccTable" "makePlotInputModule" "makePlotTable" "makeTable" 
 # [57] "rank" "readFile" "removeThLabel" "replaceTable" "restoreTable" "restoreTd" "saveHTML" "saveInputs" 
 # [65] "saveSettings" "searchTableText" "setSortable" "settingTableModule" "shortTable" "showAllCols" "showCol" "showRow" 
 # [73] "sortByOrder" "splitByGroup" "startWatchPosition" "stopWatchPosition" "string2Numeric" "successCallback" "sumWithGroup" "switchScreenShow" 
 # [81] "updateTimeGPS" "var" "wideTable" 
 # > setdiff(all_funs[[1]], used_funs_15)
 # 

  # 使われているが，コードの途中で落ちた関数
  # "changeTab" # 定義が()ではされていないので，拾えなかった
  # 
  # exampleで使われている
  # "loadExample" 

 # コードの中では使っていないが，残しておく
 # keep in json.js: "uniq" "csv2json" "extractJson" "json2Array" "jsonKeys" 


 #  使われていないっぽいので，一旦削除した関数  (とりあえず，以下に保存) 2022-07-11 16:18ぐらい
 #              D:/matu/work/ToDo/biodiv/www/tools/unused.js
 #  #  #  #  #  #  #  #  MAYBE UNUSED  #  #  #  #  #  #  #  #  
 # "fetchLSKeys" "saveTable" "getPosition" "restoreInputPart" "createInputPart" "createSettingSpan"  "createButtonNewTable"
 #   "createInputTable" "createTable" "cloneRows" "cloneRow"  "hiddenInputCols"  "showInputCols" "hideInputCol" 
 # "createInputNrow" "createButtonAddRow" "createButtonHideShow" "switchHideShowSpan"  "createSetting"  "hideCol" 
 # "getNs" "setNs" "showSumByGroup" "sumByGroup" 
 # "getSelectOption" "getTableData" "selectColByType" "searchTable"
