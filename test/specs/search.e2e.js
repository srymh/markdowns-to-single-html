const Page = require('../pageobjects/page');

describe('Search', () => {
  it('text "Test Template"', async () => {
    await Page.open();

    await Page.inputSearch('Test Template');
    expect((await Page.searchHitTexts).length).toBe(2);
  });

  it('text "<"', async () => {
    await Page.open();

    await Page.inputSearch('<');
    expect((await Page.searchHitTexts).length).toBe(2);
  });
});
