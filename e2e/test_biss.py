"""What only a real browser can check. See conftest.py for the setup."""

import re

from conftest import BUILT_PAGE, OCC_COLS, WWW


def test_the_page_comes_up_clean(biss):
    """Nothing thrown, and the tabs are actually on screen."""
    for label in ["Tools", "Settings", "All plots"]:
        assert biss.page.get_by_role("link", name=label).is_visible()
    assert biss.errors == []


def test_the_distributed_file_stands_alone(built):
    """biss2.html must carry everything: no request may leave the machine."""
    built.survey_one_plot()
    assert built.remote == [], "the built file asked for something over the network"

    html = (WWW / BUILT_PAGE).read_text(encoding="utf-8")
    assert "<script src=" not in html, "a script is still linked instead of inlined"
    assert "<link rel=\"stylesheet\" href=" not in html, "a stylesheet is still linked"


def test_the_species_list_picked_in_tools_survives_a_tab_change(biss):
    """The bug reported from the browser: the list emptied on coming back."""
    page = biss.tab("Tools").page
    biss.js("addSLinLS(['Fagus crenata', 'Quercus serrata'], 'e2elist')")
    biss.js("updateSelectSLById('sp_list_select-all')")
    page.select_option("#sp_list_select-all", "e2elist")

    shown = page.locator("#sp_list_sp_list-all li")
    assert shown.count() == 2

    # Leave for the Settings tab and come back, by clicking, as a user does.
    page.get_by_role("link", name="Settings").click()
    page.get_by_role("link", name="Tools").click()

    assert page.locator("#sp_list_select-all").input_value() == "e2elist"
    assert shown.count() == 2, "the species disappeared on coming back"
    assert biss.errors == []


def test_a_species_list_can_be_registered_from_a_file(biss, tmp_path):
    """The file dialog is drawn by the browser, so jsdom cannot open it."""
    page = biss.tab("Tools").page
    species_file = tmp_path / "narayama.txt"
    species_file.write_text("Quercus serrata\nQuercus acutissima\n", encoding="utf-8")

    # The real input is hidden; the visible button opens it. Go through the button.
    with page.expect_file_chooser() as chooser:
        page.click("#sp_list_module-all input[data-msg='choose_file']")
    chooser.value.set_files(species_file)

    options = page.locator("#sp_list_select-all option")
    page.wait_for_function(
        "() => [...document.querySelectorAll('#sp_list_select-all option')]"
        "        .some(o => o.value === 'narayama')"
    )
    assert "narayama" in options.all_inner_texts()
    assert page.locator("#sp_list_sp_list-all li").count() == 2
    assert biss.errors == []


def test_saving_writes_the_plot_and_occurrence_tsv(biss):
    """A real download, read back as a file."""
    page = biss.page
    biss.survey_one_plot()

    downloads = []
    page.on("download", lambda d: downloads.append(d))
    page.click("input[data-msg='save_input']")
    for _ in range(50):
        if len(downloads) >= 2:
            break
        page.wait_for_timeout(100)

    assert len(downloads) == 2, f"expected two files, got {len(downloads)}"
    names = sorted(d.suggested_filename for d in downloads)
    assert re.fullmatch(r"biss_[\d_]+_occ\.tsv", names[0]), names
    assert re.fullmatch(r"biss_[\d_]+_plot\.tsv", names[1]), names

    by_name = {d.suggested_filename: d for d in downloads}
    occ = next(d for n, d in by_name.items() if n.endswith("_occ.tsv"))
    text = pathlib_read(occ)
    header = text.splitlines()[0].split("\t")
    assert header == OCC_COLS, "the saved columns are what ecan::read_biss() reads"
    assert "Fagus crenata" in text
    assert biss.errors == []


def pathlib_read(download):
    """The bytes a download actually wrote, as text."""
    import pathlib

    return pathlib.Path(download.path()).read_text(encoding="utf-8")


def test_hiding_the_table_really_hides_it(biss):
    """Visibility needs layout, which jsdom does not do."""
    page = biss.page
    plot = biss.survey_one_plot()
    table = page.locator(f"#input_occ_{plot}_tb")
    button = page.locator(f"#input_occ_{plot} input[data-msg='hide_table']")

    assert table.is_visible()
    button.click()
    assert table.is_hidden(), "the table is still on screen after Hide table"
    page.locator(f"#input_occ_{plot} input[data-msg='show_table']").click()
    assert table.is_visible(), "the table did not come back"
    assert biss.errors == []


def test_hiding_a_column_leaves_a_button_that_brings_it_back(biss):
    page = biss.page
    plot = biss.survey_one_plot()
    table = page.locator(f"#input_occ_{plot}_tb")
    species_col = biss.col_names(f"input_occ_{plot}_tb").index("Species")

    header = table.locator("tr").first.locator("th").nth(species_col)
    assert header.is_visible()

    table.locator("tr.hide_button td").nth(species_col).locator("input").click()
    assert header.is_hidden(), "the column is still shown after Hide"

    page.locator(f"#input_occ_{plot} input[value='Species']").click()
    assert header.is_visible(), "the column did not come back"
    assert biss.errors == []


def test_the_language_switch_relabels_the_page(biss):
    page = biss.page
    plot = biss.survey_one_plot()
    before = biss.col_data(f"input_occ_{plot}_tb", "Species")

    page.select_option("#select_language", "ja")

    assert page.locator("#add_tab").input_value() == "＋ 新規地点"
    assert biss.col_data(f"input_occ_{plot}_tb", "Species") == before, "data changed"
    assert biss.col_names("occ_all_tb") == OCC_COLS, "the column names moved"

    page.select_option("#select_language", "en")
    assert page.locator("#add_tab").input_value() == "+ PLOT"
    assert biss.errors == []
