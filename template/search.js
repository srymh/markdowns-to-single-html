var Searcher = (function () {
  function Searcher() {
    this.result = [];
    this.tagsToBeExcluded = [
      'script',
      'style',
      'meta',
      'head',
      'title',
      'link',
    ];
  }

  Searcher.prototype._getElementsByText = function (text) {
    /** @type {HTMLElement[]} */
    var elements = [];

    /*
     * var expression =
     *   '//*[contains(text(), ' + escapeXPathExpr(text) + ')]';
     * テキストが部分一致している要素を取得する。
     * ただし、以下のような例の ipsum を検索し取得することができない。
     *
     * <div>
     *   <p>lorem</p>
     *   ipsum
     * </div>
     *
     * text() を . に置き換えると、 ipsum が検索できるが、親ノードまですべて取得してしまう。
     * var expression = '//*[contains(., ' + escapeXPathExpr(text) + ')]';
     *
     * ipsum も検索できるように下記リンク先を参考に改善した。
     * https://stackoverflow.com/questions/53906387/select-all-deepest-nodes-with-xpath-1-0-containing-text-ignoring-markup
     *
     * 完全一致: '//*[normalize-space()="ipsum" and not(./*[normalize-space()="ipsum"])]'
     * 部分一致: '//*[contains(normalize-space(), "ipsum") and not(./*[contains(normalize-space(), "ipsum")])]'
     *
     */
    var expression =
      '//*[contains(normalize-space(), ' +
      escapeXPathExpr(text) +
      ') and not(./*[contains(normalize-space(), ' +
      escapeXPathExpr(text) +
      ')])]';

    var xPathResult = document.evaluate(
      expression,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    if (xPathResult.snapshotLength) {
      var length = xPathResult.snapshotLength;

      while (length--) {
        var item = xPathResult.snapshotItem(length);

        if (
          this.tagsToBeExcluded.findIndex(
            (tag) => tag === item.nodeName.toLowerCase()
          ) >= 0
        ) {
          // Exclude this Node
        } else {
          elements.push(item);
        }
      }
    }

    return elements;
  };

  Searcher.prototype.search = function (text, callback) {
    if (this.result.length > 0) {
      this.reset();
    }

    var elements = this._getElementsByText(text);

    if (elements && elements.length) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        this.result.push({
          element: element,
          bufferedHTML: element.innerHTML,
          borderStyle: element.style.border,
        });

        if (callback && typeof callback === 'function') {
          callback(element);
        }

        element.style.border = '5px solid red';
        var regexEscaped = text; // ToDo: . や * などの正規表現の特殊文字をエスケープしなければならない。
        var htmlEscaped = text; // ToDo: <> やらなんやらをエスケープしなければならない。
        element.innerHTML = element.innerHTML.replace(
          new RegExp(regexEscaped, 'g'),
          `<span style="background-color: yellow; color: black;">${htmlEscaped}</span>`
        );
      }
    }
  };

  Searcher.prototype.reset = function () {
    while (this.result.length) {
      var item = this.result.pop();
      item.element.innerHTML = item.bufferedHTML;
      item.element.style.border = item.borderStyle;
    }
  };

  /**
   * https://amachang.hatenablog.com/entry/20090917/1253179486
   * @param {*} text
   */
  function escapeXPathExpr(text) {
    var matches = text.match(/[^"]+|"/g);

    function esc(t) {
      return t == '"' ? "'" + t + "'" : '"' + t + '"';
    }

    if (matches) {
      if (matches.length == 1) {
        return esc(matches[0]);
      } else {
        var results = [];
        for (var i = 0; i < matches.length; i++) {
          results.push(esc(matches[i]));
        }
        return 'concat(' + results.join(', ') + ')';
      }
    } else {
      return '""';
    }
  }

  return Searcher;
})();