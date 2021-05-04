describe('search.js', function () {
  describe('_getElementsByText', function () {
    it('Lorem ipsum', function () {
      var elements = window.searcher._getElementsByText('Lorem ipsum');
      assert.equal(elements.length, 1);
    });
  });

  describe('_escapeHtml', function () {
    it('single quote', function () {
      var excaped = window.searcher._escapeHtml('&\'`"<>');
      assert.equal(excaped, '&amp;&#x27;&#x60;&quot;&lt;&gt;');
    });
  });

  describe('_escapeXPathExpr', function () {
    it('single quote', function () {
      var excaped = window.searcher._escapeXPathExpr("'");
      assert.equal(excaped, '"\'"');
    });

    it('double quote', function () {
      var excaped = window.searcher._escapeXPathExpr('"');
      assert.equal(excaped, "'\"'");
    });

    it('single and double quotes', function () {
      var excaped = window.searcher._escapeXPathExpr('\'"');
      assert.equal(excaped, 'concat("\'", \'"\')');
    });
  });

  describe('_makeXPathExprSearchDeepestNodeContaining', function () {
    it('hello', function () {
      var expr = window.searcher._makeXPathExprSearchDeepestNodeContaining(
        'hello'
      );
      assert.equal(
        expr,
        '//*[contains(normalize-space(), "hello") and not(./*[contains(normalize-space(), "hello")])]'
      );
    });
  });
});
