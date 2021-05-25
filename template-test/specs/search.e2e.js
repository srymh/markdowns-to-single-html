const Page = require('../pageobjects/page');

describe('Search', () => {
  beforeEach(async () => {
    await Page.open();
  });

  it('text "Test Template"', async () => {
    await Page.inputSearch('文字実体参照');
    expect((await Page.searchHitTexts).length).toBe(1);
  });

  it('text "<"', async () => {
    await Page.inputSearch('<');
    expect((await Page.searchHitTexts).length).toBe(2);
  });

  describe('Searcher class', () => {
    it('_getElementsByText', async () => {
      const result = await Page.runJavaScript(() =>
        window.searcher._getElementsByText(
          'Searcher class _getElementsByText',
          'main'
        )
      );

      expect(result.length).toBe(1);
    });

    it('_escapeHtml', async () => {
      const result = await Page.runJavaScript(() =>
        window.searcher._escapeHtml('&\'`"<>')
      );

      expect(result).toBe('&amp;&#x27;&#x60;&quot;&lt;&gt;');
    });

    describe('_escapeXPathExpr', () => {
      it('single quote', async () => {
        const result = await Page.runJavaScript(() =>
          window.searcher._escapeXPathExpr("'")
        );

        expect(result).toBe('"\'"');
      });
    });

    describe('_escapeXPathExpr', () => {
      it('single quote', async () => {
        const result = await Page.runJavaScript(() =>
          window.searcher._escapeXPathExpr("'")
        );

        expect(result).toBe('"\'"');
      });

      it('double quote', async () => {
        const result = await Page.runJavaScript(() =>
          window.searcher._escapeXPathExpr('"')
        );

        expect(result).toBe("'\"'");
      });

      it('single and double quotes', async () => {
        const result = await Page.runJavaScript(() =>
          window.searcher._escapeXPathExpr('\'"')
        );

        expect(result).toBe('concat("\'", \'"\')');
      });
    });

    describe('_makeXPathExprSearchDeepestNodeContaining', () => {
      it('ルート指定なし', async () => {
        const result = await Page.runJavaScript(() =>
          window.searcher._makeXPathExprSearchDeepestNodeContaining('hello')
        );

        expect(result).toBe(
          '//*[contains(normalize-space(), "hello") and not(./*[contains(normalize-space(), "hello")])]'
        );
      });

      it('ルート指定 main', async () => {
        const result = await Page.runJavaScript(() =>
          window.searcher._makeXPathExprSearchDeepestNodeContaining(
            'hello',
            'main'
          )
        );

        expect(result).toBe(
          '//main//*[contains(normalize-space(), "hello") and not(./*[contains(normalize-space(), "hello")])]'
        );
      });
    });
  });
});
