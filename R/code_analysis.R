library(tidyverse)

## read file
main_path <- "D:/matu/work/ToDo/biodiv/www/biodiv.html"
main <- readr::read_tsv(main_path, col_names = "main", show_col_types = FALSE)

funs_path <- "D:/matu/work/ToDo/biodiv/www/js/"

funs <- 
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
code_funs <- 
  funs %>%
  dplyr::filter(! stringr::str_detect(funs, ' *//')) %>%
  dplyr::mutate(funs = stringr::str_replace_all(funs, "//.*", "")) %>%
  # function
  # ( fun ) "fun" { fun }
  # = fun( 
  dplyr::filter(stringr::str_detect(funs, '^.{0,6}function|= *[A-z0-9]+\\(|[\\(\\"\\{] *[A-z0-9]+\\(' )) %>%
  unlist() %>%
  purrr::reduce(stringr::str_c) %>%
  stringr::str_replace_all("[A-z]*\\.[A-z]*", "") %>%
  stringr::str_split("function") %>%
  data.frame() %>%
  tibble::tibble() %>%
  magrittr::set_colnames("code") %>%
  dplyr::filter(code != "") %>%
  dplyr::filter(! stringr::str_detect(code, "^\\(")) %>%
  dplyr::mutate(code = stringr::str_replace(code, "^ ", ""))

funs <- 
  code_funs %>%
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
  code_funs %>%
  unlist() %>%
  map(split_code) %>%
  bind_rows() %>%
  distinct() %>%
  dplyr::filter(code %in% unique(.$fun)) %>%
  dplyr::filter(fun != code) %>%
  dplyr::arrange(fun, code)


codes %>%
  dplyr::filter(stringr::str_detect(fun, "makePlotInputModule"))
code_funs %>%
  dplyr::filter(stringr::str_detect(code, "makePlotInputModule"))

  # makePlotInputModule が code で落ちている
codes %>%
  dplyr::filter(stringr::str_detect(code, "makePlotInputModule"))

## 

main_funs %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  dplyr::left_join(codes) %>%
  magrittr::set_colnames(c(str_c("code_", 1:(length(.)-1)), "fun")) %>%
  na.omit()

print(codes, n=200)
funs



## 
