"""Drive BISS in a real browser.

The jsdom suite (npm test) is the fast one and runs on every edit. This one
covers what jsdom cannot reach:

  - the file selection dialogs, which are drawn by the browser
  - a real download, so the saved TSV is read as a file and not as an array
  - what is actually visible on screen, layout included
  - www/biss2.html, the single file that is distributed

Every test runs twice: once against biodiv2.html, which loads js2/ and css2/
from disk, and once against biss2.html, which inliner built out of them. A
stale build therefore fails instead of going out unnoticed.

The page is opened as a file://, because that is how the app is used in the
field: download the one file, open it, work offline.
"""

import pathlib
import pytest

ROOT = pathlib.Path(__file__).resolve().parents[1]
WWW = ROOT / "www"

SOURCE_PAGE = "biodiv2.html"    # loads js2/ and css2/
BUILT_PAGE = "biss2.html"       # what is distributed
PAGES = [SOURCE_PAGE, BUILT_PAGE]

# The columns of the "_5_layers" base setting, as ecan::read_biss() sees them.
OCC_COLS = [
    "PLOT", "Layer", "Species", "Cover", "Abundance", "Rank",
    "Sampled", "Identified", "Photo", "Memo", "SameAs",
]


class Biss:
    """One page of the app, with the complaints it made along the way."""

    def __init__(self, page, name):
        self.page = page
        self.name = name
        self.errors = []
        self.remote = []
        page.on("pageerror", lambda e: self.errors.append(f"pageerror: {e}"))
        page.on("console", self._on_console)
        page.on("request", self._on_request)

    def _on_console(self, message):
        if message.type == "error":
            self.errors.append(f"console: {message.text}")

    def _on_request(self, request):
        # Anything that leaves the machine breaks the promise of working offline.
        if request.url.startswith(("http://", "https://")):
            self.remote.append(request.url)

    def open(self):
        self.page.goto((WWW / self.name).as_uri())
        self.page.wait_for_function("typeof addInputTab === 'function'")
        return self

    def tab(self, label):
        """Show a tab by clicking it, as a user does.

        The page starts on Settings, so a test that touches Tools has to ask
        for it: Playwright refuses to act on what is not visible.
        """
        self.page.get_by_role("link", name=label).click()
        return self

    # -- driving the app ---------------------------------------------------

    def js(self, expression, *args):
        """Evaluate an expression in the page."""
        return self.page.evaluate(expression, *args)

    def add_plot(self, name):
        """Add a plot tab without going through the prompt."""
        self.js(
            "name => addInputTab({ obj: document.getElementById('add_tab'), id: name })",
            name,
        )

    def col_names(self, table_id):
        return self.js(
            "id => { const t = document.getElementById(id);"
            "        return t === null ? null : getColNames(t); }",
            table_id,
        )

    def col_data(self, table_id, col_name):
        return self.js(
            "([id, name]) => getColData(document.getElementById(id), name)",
            [table_id, col_name],
        )

    def survey_one_plot(self, plot="e2e01"):
        """Pick a setting, add a plot, put two species in it."""
        self.js("changeSettingsByName('_5_layers')")
        self.add_plot(plot)
        self.page.fill(f"#sp_list_input-{plot}", "Fagus crenata,Quercus serrata")
        self.page.click(f"#sp_list_add-{plot}")
        self.js("updateInputsPlotLayerSpecies()")
        return plot


@pytest.fixture
def browser_context_args(browser_context_args):
    """Pin the locale.

    BISS starts in the browser's language, and this machine's browser is
    Japanese. The tests would then read Japanese labels here and English
    ones on someone else's machine, so fix it and switch on purpose in the
    test that is about switching.
    """
    return {**browser_context_args, "locale": "en-US"}


@pytest.fixture(params=PAGES, ids=PAGES)
def biss(page, request):
    """The app, opened and ready. Runs once per page under test."""
    return Biss(page, request.param).open()


@pytest.fixture
def built(page):
    """Only the distributed single file."""
    return Biss(page, BUILT_PAGE).open()
