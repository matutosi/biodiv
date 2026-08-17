"""The saved JSON, read back by ecan::read_biss() in a real R.

Everything else stops at the browser: the TSV is read as text, the JSON as a
Python dict. But what the survey is for is the analysis, and that happens in
R. A name like `Rosa A & B` or `Carex <sp>` has to arrive there exactly as it
was typed -- HTML would rather eat those characters, and once did (A8).

R and ecan are not part of the development setup, so this skips when they are
missing. Install with:

    Rscript --vanilla -e "install.packages('ecan', repos='https://cloud.r-project.org')"
"""

import json
import shutil
import subprocess

import pytest
from conftest import OCC_COLS, ROOT

CHECKER = ROOT / "R" / "read_biss_check.R"

# Characters HTML treats as markup, plus one non-ASCII name. The species input
# splits on commas, so a name cannot hold one.
SPECIES = ['Rosa A & B', 'Carex <sp>', 'Quercus "ao"', 'Pinus \\ sp', 'ブナ']
LOCATION = 'Sasaki & Co. <field>'


def r_with_ecan():
    """The Rscript to use, or None when this machine cannot run the check."""
    rscript = shutil.which("Rscript")
    if rscript is None:
        return None
    found = subprocess.run(
        [rscript, "--vanilla", "-e",
         "cat(requireNamespace('ecan', quietly = TRUE))"],
        capture_output=True, text=True,
    )
    return rscript if found.stdout.strip() == "TRUE" else None


RSCRIPT = r_with_ecan()
needs_r = pytest.mark.skipif(
    RSCRIPT is None, reason="R with the ecan package is not installed"
)


def set_cell(biss, table_id, col, value):
    """Type a value into the first data row of a column."""
    biss.js(
        "([id, col, value]) => {"
        "  const t = document.getElementById(id);"
        "  const j = getColNames(t).indexOf(col);"
        "  const input = firstDataRow(t).cells[j]"
        "                  .querySelector('input, select, textarea');"
        "  input.value = value;"
        "  input.dispatchEvent(new Event('change', { bubbles: true }));"
        "}",
        [table_id, col, value],
    )


def save_json(biss, tmp_path):
    """Press auto save and keep the file the browser wrote."""
    downloads = []
    biss.page.on("download", lambda d: downloads.append(d))
    biss.js("autoSave()")
    for _ in range(50):
        if downloads:
            break
        biss.page.wait_for_timeout(100)
    assert downloads, "auto save wrote no file"

    saved = tmp_path / downloads[0].suggested_filename
    downloads[0].save_as(saved)
    return saved


@needs_r
def test_the_saved_json_reaches_r_as_it_was_typed(biss, tmp_path):
    plot = "e2e-r"
    biss.js("changeSettingsByName('_5_layers')")
    biss.add_plot(plot)
    biss.page.fill(f"#sp_list_input-{plot}", ",".join(SPECIES))
    biss.page.click(f"#sp_list_add-{plot}")
    biss.js("updateInputsPlotLayerSpecies()")
    # Location is a text column. Investigator is "fixed" in this setting: it
    # is typed once in the settings, not per plot.
    set_cell(biss, f"input_plot_{plot}_tb", "Location", LOCATION)
    biss.js("updateAllInputsTables()")

    saved = save_json(biss, tmp_path)

    read = subprocess.run(
        [RSCRIPT, "--vanilla", str(CHECKER), str(saved)],
        capture_output=True, text=True, encoding="utf-8",
    )
    assert read.returncode == 0, f"ecan::read_biss() failed:\n{read.stderr}"
    got = json.loads(read.stdout)

    assert got["occ_cols"] == OCC_COLS, "the columns R sees are the saved ones"
    for name in SPECIES:
        assert name in got["species"], f"{name!r} did not survive the round trip"
    assert set(got["plots"]) == {plot}, got["plots"]
    assert LOCATION in got["joined_locations"], "the plot side was eaten"

    # join = TRUE is the everyday call: one row per record, plot data attached.
    # The layers nothing was put in keep an empty row each, as on screen.
    named = [s for s in got["joined_species"] if s != ""]
    assert sorted(named) == sorted(SPECIES), named
    assert biss.errors == []
