/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
class Page {
  get inputSearchText() {
    return $('#search-text');
  }
  get inputSearchButton() {
    return $('#search-button');
  }
  get inputSearchResetButton() {
    return $('#search-reset-button');
  }
  get searchHitTexts() {
    return $$('.search-hit-text');
  }
  get linkToPage1() {
    return $('a[href="#page1"]');
  }
  get linkToPage2() {
    return $('a[href="#page2"]');
  }
  get currentPage() {
    return $('.page.show');
  }

  async inputSearch(text) {
    await (await this.inputSearchText).setValue(text);
    await (await this.inputSearchButton).click();
  }

  async resetInputSearch() {
    await (await this.inputSearchResetButton).click();
  }

  /**
   * Opens a sub page of the page
   */
  open() {
    return browser.url(`http://localhost:5000/`);
  }
}

module.exports = new Page();
