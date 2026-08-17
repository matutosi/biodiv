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


def test_a_plot_named_with_a_hyphen_works(biss):
    """Adding a plot refuses '_' and asks for '-', so '-' has to work."""
    page = biss.page
    biss.js("changeSettingsByName('_5_layers')")
    biss.add_plot("sito-A")

    page.fill("#sp_list_input-sito-A", "Fagus crenata,Quercus serrata")
    page.click("#sp_list_add-sito-A")

    species = biss.col_data("input_occ_sito-A_tb", "Species")
    assert "Fagus crenata" in species, "the species did not reach the plot"
    plots = [p for p in biss.col_data("occ_all_tb", "PLOT") if p != ""]
    assert set(plots) == {"sito-A"}, f"the plot name was cut: {set(plots)}"
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


def test_a_settings_file_can_be_loaded_back(biss, tmp_path):
    """Save the plot settings, load them again, and get that table back."""
    page = biss.page
    biss.js("changeSettingsByName('_5_layers')")

    settings = tmp_path / "mysetting.json"
    settings.write_text(
        biss.js("JSON.stringify(getTableData(document.getElementById('_5_layers_plot_tb')))"),
        encoding="utf-8",
    )

    page.get_by_role("link", name="Settings").click()
    # The first Choose file on the page belongs to the plot settings module.
    with page.expect_file_chooser() as chooser:
        page.locator("#_5_layers_plot input[data-msg='choose_file']").click()
    chooser.value.set_files(settings)

    page.wait_for_function("() => document.getElementById('mysetting_tb') !== null")
    loaded = page.locator("#mysetting_tb")
    assert loaded.count() == 1, "the loaded settings built a table"
    assert biss.col_names("mysetting_tb") == ["item", "type", "value", "DELETE", "memo"]

    # The module it replaced is gone: one settings table per side, not two.
    assert page.locator("#_5_layers_plot_tb").count() == 0, "the old table is still there"
    assert page.locator("#tab_settings table").count() == 2, "one plot and one occ table"

    # A plot added now is built from the loaded settings. The table is found
    # by the holder it sits in, not by its name or by where it comes on the page.
    biss.add_plot("after-load")
    assert biss.col_names("input_plot_after-load_tb") is not None, "the plot table was built"
    assert "Investigator" in biss.col_names("input_plot_after-load_tb")
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

    # Hide a column first: that puts a "Show: All cols | Species" list in the
    # module, which has to go with the table. Walking to the next sibling used
    # to reach a <br> instead whenever a Fit width button sat in between.
    species_col = biss.col_names(f"input_occ_{plot}_tb").index("Species")
    table.locator("tr.hide_button td").nth(species_col).locator("input").click()
    shown_list = page.locator(f"#input_occ_{plot}_up > span").last
    assert shown_list.is_visible()

    assert table.is_visible()
    button.click()
    assert table.is_hidden(), "the table is still on screen after Hide table"
    assert shown_list.is_hidden(), "the list of hidden columns stayed behind"

    page.locator(f"#input_occ_{plot} input[data-msg='show_table']").click()
    assert table.is_visible(), "the table did not come back"
    assert shown_list.is_visible(), "the list of hidden columns did not come back"
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


def test_the_font_size_buttons_change_what_is_drawn(biss):
    """--font-size only means something once the browser lays the page out."""
    page = biss.page
    biss.survey_one_plot()
    box = page.locator("#sp_list_input-e2e01")
    drawn = "el => parseFloat(getComputedStyle(el).fontSize)"

    start = box.evaluate(drawn)
    page.click("input[data-msg='large']")
    larger = box.evaluate(drawn)
    assert larger > start, f"LARGE did not grow the text: {start} -> {larger}"

    page.click("input[data-msg='small']")
    assert abs(box.evaluate(drawn) - start) < 0.5, "small did not undo LARGE"
    assert biss.errors == []


def test_the_flora_can_be_replaced_from_a_file(biss, tmp_path):
    """The third file dialog: the other two are covered above."""
    page = biss.tab("Tools").page
    flora = tmp_path / "my_flora.txt"
    flora.write_text("ススキ\nチガヤ\nヨシ\n", encoding="utf-8")

    with page.expect_file_chooser() as chooser:
        # The first one belongs to Replace flora; the species list module
        # inside #flora has one of its own.
        page.locator("#flora input[data-msg='choose_file']").first.click()
    chooser.value.set_files(flora)

    # The button says which flora it searches now.
    page.wait_for_function(
        "() => /my_flora/.test(document.getElementById('search_flora_button').value)"
    )
    assert page.locator("#note_wamei").is_hidden(), "the note about the bundled flora stayed"

    page.fill("#flora_input", "チガヤ")
    page.click("#search_flora_button")
    hits = page.eval_on_selector_all(
        "#sp_list_module-flora input[type=button]", "els => els.map(e => e.value)"
    )
    assert "チガヤ" in hits, f"the new flora is not what is searched: {hits}"
    assert biss.errors == []


def test_a_page_that_was_left_offers_the_input_back(biss):
    """Only a real browser leaves a page the way closing a tab does."""
    page = biss.page
    plot = biss.survey_one_plot()
    species = biss.col_data(f"input_occ_{plot}_tb", "Species")

    page.reload()   # the page goes away, which is when the copy is written
    page.wait_for_function("typeof addInputTab === 'function'")

    restore = page.locator("#restore_holder input[onclick='restoreSurvey()']")
    assert restore.is_visible(), "nothing was offered after the page was left"
    restore.click()

    assert biss.col_data(f"input_occ_{plot}_tb", "Species") == species, "the input came back"
    assert page.locator("#restore_holder").inner_text() == "", "the offer is gone"
    assert biss.errors == []


def test_the_page_can_go_full_screen_and_come_back(biss):
    """Full screen needs a real click on a real browser."""
    page = biss.page
    is_full = "() => document.fullscreenElement !== null"
    assert page.evaluate(is_full) is False

    page.click("#switch_screen_show")
    page.wait_for_function(is_full)

    page.click("#switch_screen_show")
    page.wait_for_function("() => document.fullscreenElement === null")
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
