# Read a JSON saved by BISS the way a user's analysis does, and report what
# came through.
#
#   Rscript --vanilla R/read_biss_check.R biss_2026_08_17.json
#
# ecan::read_biss() is the door between the app and the analysis, so the
# characters that HTML likes to eat (& < > " \) have to survive it. The
# checking itself is left to the caller: this prints what it found as JSON.
#
# --vanilla matters. Rprofile.site here loads tidyverse, which is not needed
# and only slows the start.

args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 1) {
  stop("usage: Rscript --vanilla R/read_biss_check.R <biss.json>")
}

parts <- ecan::read_biss(args[1], join = FALSE)
joined <- ecan::read_biss(args[1], join = TRUE)

out <- list(
  plot_cols = names(parts$plot),
  occ_cols  = names(parts$occ),
  plots     = as.character(parts$plot$PLOT),
  species   = as.character(parts$occ$Species),
  covers    = as.character(parts$occ$Cover),
  joined_cols = names(joined),
  joined_species = as.character(joined$Species),
  joined_locations = as.character(joined$Location)
)

cat(jsonlite::toJSON(out, auto_unbox = FALSE), "\n")
