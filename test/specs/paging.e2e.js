const Page = require('../pageobjects/page');

describe('Paging', () => {
  it('from page1 to page2', async () => {
    await Page.open();

    const page1link = await Page.linkToPage1;
    expect(page1link).toBeTruthy();

    const page2link = await Page.linkToPage2;
    expect(page2link).toBeTruthy();

    await page1link.click();
    let currentPage = await Page.currentPage;
    expect(currentPage).toBeTruthy();
    console.log(currentPage);
    expect(await currentPage.getAttribute('id')).toBe('page1');

    await page2link.click();
    currentPage = await Page.currentPage;
    expect(currentPage).toBeTruthy();
    expect(await currentPage.getAttribute('id')).toBe('page2');
  });
});
