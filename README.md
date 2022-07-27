
# Biodiversity Investigation Support System (BISS)

The goal of BISS is to support biodiversity investigation. 

## How to install

Download biodiv.html from URL below and save it in your mobile device or PC.
https://github.com/matutosi/biodiv/tree/main/www


## How to use

Launch biodiv.html with browser (Chrome etc.).

  # See example

## Caution

Please do not use keywords shown below for text value.
  - auto, button, checkbox, date, delButton, fixed, inputs, item, list, locAcc, locLat, locLon, no, number, occ, plot, settings, text, type, updateButton
Can use: alphabet, number, "-", and other characters. 
Can not use: "_" (underbar).


## Use data in R

Use `ecan::read_biss()` in ecan.

https://github.com/matutosi/ecan

``` r
  # install.packages("devtools")
devtools::install_github("matutosi/ecan")
```




## Citation

Toshikazu Matsumura (2022) Biodiversity Investigation Support System <https://matutosi.shinyapps.io/ecanvis/>.





# Memo: tools used for making BISS

## Node.js

Download installer and run. 

https://nodejs.org/ja/download/

## inliner

Install inliner

```
npm install -g inliner
```

Run inliner

```
inliner -m biodiv.html > biss.html
```



## eslint

```
npm install -g eslint
```


