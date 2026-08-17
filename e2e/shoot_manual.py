"""Take the screenshots of the manual again, with the page in Japanese.

    man/01-howtouse_jp.md speaks of Japanese buttons, but man/img/*.png was
    shot when the app was English only. This drives the app the way the
    manual does and writes the images again.

    Run it from the project root:

        .venv/Scripts/python.exe e2e/shoot_manual.py            # every scene
        .venv/Scripts/python.exe e2e/shoot_manual.py settings   # one chapter
        .venv/Scripts/python.exe e2e/shoot_manual.py settings00 # one image
        .venv/Scripts/python.exe e2e/shoot_manual.py --en       # in English

    The Japanese images go to man/img_jp/ and the English ones to man/img/,
    because the two manuals share neither their labels nor their pictures.

    What it cannot take is what the browser draws rather than the page:

        settings_autosave02  the download bar
        settings_autosave03  the "allow several downloads?" dialog
        settings_autosave04  the downloaded files
        add_plot01           the box that asks for the plot name

    Those four are left alone, and an open pull down is shown closed, with
    the value that was chosen in it. A screenshot only holds what the page
    itself draws; the rest belongs to the browser and the operating system.
"""

import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
WWW = ROOT / "www"
IMG_OF = {"en": ROOT / "man" / "img", "ja": ROOT / "man" / "img_jp"}
PAGE = "biss2.html"          # the file that is distributed, as a reader has it
WIDTH = 1200                 # the header row needs this much in Japanese
WIDE  = 1400                 # an occurrence table does not wrap: it needs more

scenes = []                  # [(chapter, name, function)]


def scene(chapter, name):
    """Register one screenshot."""
    def keep(fn):
        scenes.append((chapter, name, fn))
        return fn
    return keep


class Shooter:
    """A page in Japanese, and the clipped screenshots taken of it."""

    def __init__(self, page, lang):
        self.page = page
        self.lang = lang
        self.img = IMG_OF[lang]
        self.img.mkdir(exist_ok=True)
        self.name = None

    def open(self):
        self.page.goto((WWW / PAGE).as_uri())
        self.page.wait_for_function("typeof addInputTab === 'function'")
        self.page.select_option("#select_language", self.lang)
        self.page.evaluate("localStorage.removeItem('biss_backup')")
        return self

    def js(self, expression, *args):
        return self.page.evaluate(expression, *args)

    def top(self):
        """Scroll back to the top before measuring anything.

        bounding_box() answers in the coordinates of the viewport, while the
        clip of a full page screenshot is in the coordinates of the document.
        Clicking a button scrolls it into view, and the two then differ by
        however far the page went.
        """
        self.page.evaluate("window.scrollTo(0, 0)")

    def shot(self, width, height, y=0):
        """The top left corner of the page, as the old images were framed."""
        self.top()
        self.page.screenshot(path=str(self.img / f"{self.name}.png"), full_page=True,
                             clip={"x": 0, "y": y, "width": width, "height": height})

    def shot_through(self, selector, width=WIDTH, pad=10):
        """From the top of the page down to the bottom of an element."""
        self.top()
        box = self.page.locator(selector).first.bounding_box()
        self.page.screenshot(path=str(self.img / f"{self.name}.png"), full_page=True,
                             clip={"x": 0, "y": 0, "width": width,
                                   "height": box["y"] + box["height"] + pad})

    def box(self, selector):
        """The box of an element, or None when it does not draw one."""
        try:
            return self.page.locator(selector).first.bounding_box()
        except Exception:
            return None

    def shot_between(self, top, bottom, width=WIDE, pad=10, extra=0):
        """From the top of one element to the bottom of another.

        A module of BISS is a <span> holding blocks, and the box of such a
        span starts where its inline flow starts, not where it looks like it
        does. Naming the two ends leaves no room for that surprise.
        """
        self.top()
        t = self.page.locator(top).first.bounding_box()
        b = self.box(bottom) or t
        y = max(0, t["y"] - pad)
        self.page.screenshot(path=str(self.img / f"{self.name}.png"), full_page=True, clip={
            "x": 0, "y": y, "width": width,
            "height": b["y"] + b["height"] + pad + extra - y})

    def shot_of(self, selector, pad=8):
        """One element, with a little room around it."""
        self.top()
        box = self.page.locator(selector).first.bounding_box()
        self.page.screenshot(path=str(self.img / f"{self.name}.png"), full_page=True, clip={
            "x": max(0, box["x"] - pad), "y": max(0, box["y"] - pad),
            "width": box["width"] + 2 * pad, "height": box["height"] + 2 * pad})

    def settings(self, name):
        self.js("name => changeSettingsByName(name)", name)

    def add_plot(self, name):
        self.js("name => addInputTab({ obj: document.getElementById('add_tab'), id: name })",
                name)

    def tab(self, label):
        """A tab, by its Japanese label; the English one is looked up."""
        english = {"ツール": "Tools", "設定": "Settings", "全地点": "All plots"}
        name = label if self.lang == "ja" else english[label]
        self.page.get_by_role("link", name=name).click()


# ---------------------------------------------------------------- 設定 -----

@scene("settings", "settings00")
def settings00(s):
    """初期画面: the Settings tab as it comes up."""
    s.shot_through("#setting_occ_holder")


@scene("settings", "font_large")
def font_large(s):
    """文字：大 pressed once."""
    s.page.click("input[data-msg='large']")
    s.shot_through("#setting_plot_holder")


@scene("settings", "font_small")
def font_small(s):
    """文字：小 pressed once."""
    s.page.click("input[data-msg='small']")
    s.shot_through("#setting_plot_holder")


@scene("settings", "settings_autosave01")
def settings_autosave01(s):
    """保存間隔の選択. The pull down is drawn by the browser when it is open,
    so it is shown closed, with the interval that was picked."""
    s.page.select_option("#select_auto_save_interval", "5")
    s.shot_through("#mailer")


@scene("settings", "settings_base01")
def settings_base01(s):
    """基本的な組み合わせの選択, with _5_layers picked."""
    s.settings("_5_layers")
    s.shot_through("#_5_layers_plot_up b")


@scene("settings", "settings_base02")
def settings_base02(s):
    """The occurrence settings of _5_layers, the rows to delete in sight."""
    s.settings("_5_layers")
    s.shot_between("#_5_layers_occ_up b", "#_5_layers_occ_tb", width=WIDTH, extra=45)


@scene("settings", "settings_base03")
def settings_base03(s):
    """行を追加: two rows asked for at the bottom of the table."""
    s.settings("_5_layers")
    s.page.fill("#_5_layers_occ_nrow", "2")
    s.page.click("#_5_layers_occ_add_rows")
    s.shot_between("#_5_layers_occ_up b", "#_5_layers_occ_tb", width=WIDTH, extra=45)


@scene("settings", "settings_base04")
def settings_base04(s):
    """空の設定からボタンを追加: empty, before any button is pressed."""
    s.settings("empty")
    s.shot_through("#empty_plot")


@scene("settings", "settings_base05")
def settings_base05(s):
    """… and after date_GPS and _5_layers were added to the plot table."""
    s.settings("empty")
    s.page.click("#tab_settings input[value='date_GPS']")
    s.shot_through("#empty_plot")


@scene("settings", "settings_save01")
def settings_save01(s):
    """設定の保存: a file name typed next to 保存."""
    s.settings("_5_layers")
    s.page.fill("#_5_layers_plot_fname", "my_plot_setting")
    s.shot_through("#_5_layers_plot_tb")


@scene("settings", "settings_hide_show")
def settings_hide_show(s):
    """表を非表示 pressed on the plot settings."""
    s.settings("_5_layers")
    s.page.click("#_5_layers_plot input[data-msg='hide_table']")
    s.shot_through("#_5_layers_occ")


# -------------------------------------------------- 地点情報と観察情報 -----

def example(s):
    """The sample survey the manual works through: biss01 and biss02."""
    s.page.click("input[data-msg='show_example']")
    s.page.wait_for_selector("#input_occ_biss01_tb")


@scene("plot", "add_plot00")
def add_plot00(s):
    """新しい地点の追加: the tabs, with + 新規地点 to press."""
    s.settings("_5_layers")
    s.shot_through("#tabcontrol", width=WIDE)


@scene("plot", "add_plot02")
def add_plot02(s):
    """The tab of the plot that was just added."""
    s.settings("_5_layers")
    s.add_plot("biss01")
    s.shot_through("#input_occ_biss01", width=WIDE)


@scene("plot", "example01")
def example01(s):
    """サンプルデータの内容: the plot and the occurrences of biss01."""
    example(s)
    s.shot_through("#input_occ_biss01", width=WIDE)


@scene("plot", "example_hide_table02")
def example_hide_table02(s):
    """表を非表示 pressed on the occurrences."""
    example(s)
    s.page.click("#input_occ_biss01 input[data-msg='hide_table']")
    s.shot_between("#input_occ_biss01_up b",
                   "#input_occ_biss01_up input[data-msg='show_table']", extra=10)


@scene("plot", "example_hide_table01")
def example_hide_table01(s):
    """… and 表を表示 to bring it back."""
    example(s)
    s.page.click("#input_occ_biss01 input[data-msg='hide_table']")
    s.page.click("#input_occ_biss01 input[data-msg='show_table']")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_width01")
def example_width01(s):
    """横長に pressed on the plot table: no wrapping."""
    example(s)
    s.page.click("#input_plot_biss01_fit")
    s.shot_between("#input_plot_biss01_up b", "#input_plot_biss01_tb")


@scene("plot", "example_width02")
def example_width02(s):
    """幅を狭く: wrapped to the width of the screen again."""
    example(s)
    s.page.click("#input_plot_biss01_fit")
    s.page.click("#input_plot_biss01_fit")
    s.shot_between("#input_plot_biss01_up b", "#input_plot_biss01_tb")


@scene("plot", "example_hide_cols01")
def example_hide_cols01(s):
    """列の表示/非表示: two columns hidden, and the buttons that bring them back."""
    example(s)
    for name in ["Photo", "Memo"]:
        col = s.js("name => getColNames(document.getElementById('input_occ_biss01_tb'))"
                   "         .indexOf(name)", name)
        s.page.locator("#input_occ_biss01_tb tr.hide_button td").nth(col).locator("input").click()
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_sort01")
def example_sort01(s):
    """行の並べ替え: Species clicked once."""
    example(s)
    s.page.locator("#input_occ_biss01_tb tr").first.get_by_text("Species").click()
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_sort02")
def example_sort02(s):
    """… and clicked again, which turns the order round."""
    example(s)
    header = s.page.locator("#input_occ_biss01_tb tr").first.get_by_text("Species")
    header.click()
    header.click()
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_search01")
def example_search01(s):
    """テキストデータの検索: only the rows that hold the text are left."""
    example(s)
    s.page.fill("#input_occ_biss01_up input[type=text]", "sp0")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_search04")
def example_search04(s):
    """The search reads the columns that are shown, PLOT among them."""
    example(s)
    s.page.fill("#input_occ_biss01_up input[type=text]", "biss01")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_search05")
def example_search05(s):
    """… so hiding PLOT takes it out of the search."""
    example(s)
    col = s.js("() => getColNames(document.getElementById('input_occ_biss01_tb')).indexOf('PLOT')")
    s.page.locator("#input_occ_biss01_tb tr.hide_button td").nth(col).locator("input").click()
    s.page.fill("#input_occ_biss01_up input[type=text]", "biss01")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_addrows01")
def example_addrows01(s):
    """観察情報の行の追加: three rows asked for."""
    example(s)
    s.page.fill("#input_occ_biss01_nrow", "3")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_addrows02")
def example_addrows02(s):
    """… and 行を追加 pressed."""
    example(s)
    s.page.fill("#input_occ_biss01_nrow", "3")
    s.page.click("#input_occ_biss01_add_rows")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


def pick_species(s, ns, names):
    """Press the species buttons of a list, which stages them."""
    for name in names:
        s.page.locator(f"#sp_list_sp_list-{ns} input[value='{name}']").first.click()


@scene("plot", "example_species_list01")
def example_species_list01(s):
    """リストから種名を追加: a list picked shows its species."""
    example(s)
    s.page.select_option("#sp_list_select-biss01", "nara")
    s.shot_between("#sp_list_select-biss01", "#sp_list_sp_list-biss01")


@scene("plot", "example_species_list02")
def example_species_list02(s):
    """Two species staged, and one more typed in the text box."""
    example(s)
    s.page.select_option("#sp_list_select-biss01", "nara")
    names = s.js("() => [...document.querySelectorAll('#sp_list_sp_list-biss01 input')]"
                 "        .slice(0, 2).map(e => e.value)")
    pick_species(s, "biss01", names)
    s.page.fill("#sp_list_input-biss01", "ススキ,チガヤ")
    s.shot_between("#sp_list_select-biss01", "#sp_list_sp_list-biss01")


@scene("plot", "example_species_list03")
def example_species_list03(s):
    """種を追加 pressed: the species are in the occurrence table."""
    example(s)
    s.page.select_option("#sp_list_select-biss01", "nara")
    names = s.js("() => [...document.querySelectorAll('#sp_list_sp_list-biss01 input')]"
                 "        .slice(0, 2).map(e => e.value)")
    pick_species(s, "biss01", names)
    s.page.click("#sp_list_add-biss01")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_species_list05")
def example_species_list05(s):
    """出現種を含める: what was entered anywhere joins the list."""
    example(s)
    s.page.check("#sp_list_checkbox-biss01")
    s.shot_between("#sp_list_select-biss01", "#sp_list_sp_list-biss01")


@scene("plot", "example_species_list06")
def example_species_list06(s):
    """A species of another plot, added here, fills SameAs in."""
    example(s)
    s.page.check("#sp_list_checkbox-biss01")
    same = s.js("() => { const e = [...document.querySelectorAll('#sp_list_sp_list-biss01 input')]"
                "          .find(e => /_biss02$/.test(e.value)); return e === undefined ? null : e.value; }")
    if same is None:
        print("   (no species of biss02 to take: the sample is random, run again)")
        return
    pick_species(s, "biss01", [same])
    s.page.click("#sp_list_add-biss01")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_tb", extra=100)


@scene("plot", "example_calculate01")
def example_calculate01(s):
    """階層ごとの被度の計算: Cover summed by Layer."""
    example(s)
    s.page.select_option("#input_occ_biss01_sum_value", "Cover")
    s.page.select_option("#input_occ_biss01_sum_group", "Layer")
    s.page.click("#input_occ_biss01_dn input[onclick='sumWithGroup(this)']")
    s.shot_between("#input_occ_biss01_up b", "#input_occ_biss01_dn table")


@scene("plot", "example_all_plots")
def example_all_plots(s):
    """全入力情報の表示: the All plots tab."""
    example(s)
    s.tab("全地点")
    s.shot_through("#comp_table", width=WIDE)


# ------------------------------------------------------------ 種名ツール ----

@scene("tools", "tools_list00")
def tools_list00(s):
    """種名ツール: the Tools tab."""
    example(s)
    s.tab("ツール")
    s.shot_through("#flora", width=WIDE)


@scene("tools", "tools_list02")
def tools_list02(s):
    """小規模な種名リスト: a list picked shows its species."""
    example(s)
    s.tab("ツール")
    s.page.select_option("#sp_list_select-all", "nara")
    s.shot_between("#sp_list_ncols-all", "#sp_list_sp_list-all")


@scene("tools", "tools_list03")
def tools_list03(s):
    """種名リストの削除: the list to delete picked next to 削除."""
    example(s)
    s.tab("ツール")
    s.page.select_option("#sp_list_delete_name-all", "kaya")
    s.shot_between("#sp_list_ncols-all", "#sp_list_delete-all", extra=12)


@scene("tools", "tools_list04")
def tools_list04(s):
    """種名リストの利用: the list that is in use."""
    example(s)
    s.tab("ツール")
    s.page.select_option("#sp_list_select-all", "buna")
    s.shot_between("#sp_list_ncols-all", "#sp_list_sp_list-all")


@scene("tools", "tools_list05")
def tools_list05(s):
    """Species pressed once are staged above the list."""
    example(s)
    s.tab("ツール")
    s.page.select_option("#sp_list_select-all", "buna")
    names = s.js("() => [...document.querySelectorAll('#sp_list_sp_list-all input')]"
                 "        .slice(0, 3).map(e => e.value)")
    pick_species(s, "all", names)
    s.shot_between("#sp_list_ncols-all", "#sp_list_sp_list-all")


@scene("tools", "tools_list06")
def tools_list06(s):
    """表示列数 changed: the same list in three columns."""
    example(s)
    s.tab("ツール")
    s.page.select_option("#sp_list_select-all", "buna")
    s.page.select_option("#sp_list_ncols-all", "3")
    s.shot_between("#sp_list_ncols-all", "#sp_list_sp_list-all")


@scene("tools", "tools_list08")
def tools_list08(s):
    """The plot and the layer to add the staged species to."""
    example(s)
    s.tab("ツール")
    s.page.select_option("#sp_list_select-all", "buna")
    names = s.js("() => [...document.querySelectorAll('#sp_list_sp_list-all input')]"
                 "        .slice(0, 2).map(e => e.value)")
    pick_species(s, "all", names)
    s.page.fill("#sp_list_input-all", "ススキ,チガヤ")
    s.page.select_option("#sp_list_options_Layer-all", "T1")
    s.shot_between("#sp_list_ncols-all", "#sp_list_sp_list-all")


@scene("tools", "tools_list07")
def tools_list07(s):
    """出現種を含める: what was entered in any plot joins the list."""
    example(s)
    s.tab("ツール")
    s.page.check("#sp_list_checkbox-all")
    s.shot_between("#sp_list_ncols-all", "#sp_list_sp_list-all")


@scene("tools", "tools_list10")
def tools_list10(s):
    """大規模な種名リストの登録: 植物相の入替 and the file to pick."""
    example(s)
    s.tab("ツール")
    s.shot_between("#flora span[data-msg='replace_flora']", "#flora_input", extra=10)


@scene("tools", "tools_list12")
def tools_list12(s):
    """種名の検索: what the flora holds for a text."""
    example(s)
    s.tab("ツール")
    s.page.fill("#flora_input", "アイ ガヤ")
    s.page.click("#search_flora_button")
    s.shot_between("#flora_input", "#sp_list_sp_list-flora", extra=20)


@scene("tools", "tools_list09")
def tools_list09(s):
    """An empty search puts the result away again."""
    example(s)
    s.tab("ツール")
    s.page.fill("#flora_input", "アイ ガヤ")
    s.page.click("#search_flora_button")
    s.page.fill("#flora_input", "")
    s.page.click("#search_flora_button")
    s.shot_between("#flora_input", "#sp_list_sp_list-flora", extra=20)


# ------------------------------------------------------------------ run ----

def main(argv):
    lang = "ja"
    if "--en" in argv:
        argv.remove("--en")
        lang = "en"
    wanted = set(argv)
    picked = [s for s in scenes
              if not wanted or s[0] in wanted or s[1] in wanted]
    if not picked:
        print(f"no scene matches {wanted}")
        print("chapters:", sorted({c for c, _, _ in scenes}))
        return 1
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(locale=("ja-JP" if lang == "ja" else "en-US"),
                                      viewport={"width": 1400, "height": 1000})
        page = context.new_page()
        shooter = Shooter(page, lang)
        for chapter, name, fn in picked:
            shooter.open()          # every scene starts from a fresh page
            shooter.name = name
            print(f"{lang}  {chapter:10s} {name}", flush=True)
            fn(shooter)
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
