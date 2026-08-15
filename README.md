
# Biodiversity Investigation Support System (BISS)

The goal of BISS is to support biodiversity investigation. 

## How to install

Download the HTML file below and save it in your mobile device or PC.

- Current version (recommended): biss2.html
  <https://github.com/matutosi/biodiv/raw/main/www/biss2.html>
- Old version (frozen, no longer updated): biss.html
  <https://github.com/matutosi/biodiv/raw/main/www/biss.html>

Both files are in <https://github.com/matutosi/biodiv/tree/main/www>.

The current version supports Japanese and English.
Use the language select at the top left to switch.


## How to use

Launch biss2.html with browser (Chrome etc.).

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
  # install.packages("remotes")
remotes::install_github("matutosi/ecan")
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
inliner -m biodiv2.html > biss2.html
```



## eslint

```
npm install -g eslint
```
