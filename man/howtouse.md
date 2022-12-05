# How to use Investigation Support System (BISS)


## Settings

### 

![search_wamei](img/allplots00.png.png)  
![search_wamei](img/crop_example01.png.png)  
![search_wamei](img/crop_example02.png.png)  
![search_wamei](img/crop_example02_01.png.png)  
![search_wamei](img/crop_example03.png.png)  
![search_wamei](img/crop_settings00.png.png)  
![search_wamei](img/crop_settings_autosave01.png.png)  
![search_wamei](img/crop_settings_autosave02.png.png)  
![search_wamei](img/crop_settings_autosave04.png.png)  
![search_wamei](img/crop_settings_autosave05.png.png)  
![search_wamei](img/crop_settings_hide_show.png.png)  
![search_wamei](img/crop_settings_main01.png.png)  
![search_wamei](img/crop_settings_main02.png.png)  
![search_wamei](img/crop_settings_main03.png.png)  
![search_wamei](img/crop_settings_main04.png.png)  
![search_wamei](img/crop_settings_main05.png.png)  
![search_wamei](img/crop_settings_main06save.png.png)  
![search_wamei](img/crop_settings_main07save.png.png)  
![search_wamei](img/crop_tools02.png.png)  
![search_wamei](img/crop_tools02en.png.png)  
![search_wamei](img/settings_autosave03.png.png)  

![search_wamei](img/tools00.png.png)  
![search_wamei](img/tools00en.png.png)  
![search_wamei](img/tools01.png.png)  
![search_wamei](img/tools02.png.png)  
![search_wamei](img/tools02en.png.png)  
![search_wamei](img/tools03en.png.png)  
![search_wamei](img/tools04en.png.png)  
![search_wamei](img/tools05en.png.png)  
![search_wamei](img/tools06en.png.png)  
![search_wamei](img/tools07en.png.png)  
![search_wamei](img/tools08en.png.png)  
![search_wamei](img/tools09en.png.png)  
![search_wamei](img/tools10en.png.png)  
![search_wamei](img/tools11en.png.png)  
![search_wamei](img/tools12en.png.png)  
![search_wamei](img/tools13en.png.png)  

## Input data



## Search wamei

- Choose "Tools" tab
![tools_tab](img/03_00.png)    

- Input wamei and Choose "Search Text"  
- Show results  
![search_wamei](img/03_01.png)  
![search_wamei_res](img/03_02.png)  

- Use space (" ") to search including [A and B]  
- Results of [A and B]  
![search_wamei_multi](img/03_03.png)  
![search_wamei_multi_res](img/03_04.png)  

- Can use [A and B and C]  
![search_wamei_multi](img/03_05.png)  

- Case of results over 100  
- Alert will be desplayed and show only 100 results  
![search_wamei_over100](img/03_06.png)  
![search_wamei_over100_alert](img/03_07.png)  
![search_wamei_over100_res](img/03_08.png)  

- 空欄でSearch Textを選択すると，検索結果がクリアされる  
![search_wamei_clear](img/03_09.png)  
![search_wamei](img/03_01.png)  


## Inport data into R

```{r}
read_biss <- function(json, join = TRUE){
  biss <- jsonlite::fromJSON(json)
  plot <- data.frame(biss$plot)
  occ  <- data.frame(biss$occ)
  if(join){
    return(dplyr::left_join(plot, occ))
  }else{
    return(list(plot = plot, occ = occ))
  }
}

library(jsonlite)
url <- "https://raw.githubusercontent.com/matutosi/biodiv/main/man/example.json"
json <- readr::read_tsv(url, col_names = FALSE)$X1

read_biss(json)
read_biss(json, join = FALSE)



```


<!-- 
Basic use in a table
* Hide button: hide a col
* DELETE: delete a row
* Click col names: sort
* add row: copy last rows
* Search text: filter by text
* Hide/Show table
* Fit/Extend width to page
* Calculate cover
   in each layer
* Can add species from list
   by Add species to PLOT
-->
